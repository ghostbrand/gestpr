const moment = require('moment');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getModels() {
  return {
    Invoice: mongoose.model('Invoice'),
    Payment: mongoose.model('Payment'),
    Quote: mongoose.model('Quote'),
  };
}

function parsePeriod(query) {
  const period = (query.period || 'monthly').toLowerCase();
  const now = moment();
  let start;
  let end;
  let label;

  switch (period) {
    case 'daily': {
      const d = query.date ? moment(query.date, 'YYYY-MM-DD', true) : now;
      if (!d.isValid()) {
        const err = new Error('Invalid date');
        err.status = 400;
        throw err;
      }
      start = d.clone().startOf('day');
      end = d.clone().endOf('day');
      label = start.format('LL');
      break;
    }
    case 'monthly': {
      const y = parseInt(query.year, 10) || now.year();
      const m = parseInt(query.month, 10) || now.month() + 1;
      start = moment({ year: y, month: m - 1, day: 1 }).startOf('month');
      end = start.clone().endOf('month');
      label = start.format('MMMM YYYY');
      break;
    }
    case 'yearly': {
      const y = parseInt(query.year, 10) || now.year();
      start = moment({ year: y, month: 0, day: 1 }).startOf('year');
      end = start.clone().endOf('year');
      label = String(y);
      break;
    }
    case 'range': {
      start = query.start
        ? moment(query.start).startOf('day')
        : now.clone().subtract(30, 'days').startOf('day');
      end = query.end ? moment(query.end).endOf('day') : now.endOf('day');
      if (!start.isValid() || !end.isValid()) {
        const err = new Error('Invalid start or end date');
        err.status = 400;
        throw err;
      }
      label = `${start.format('L')} – ${end.format('L')}`;
      break;
    }
    default: {
      const err = new Error('period must be daily, monthly, yearly, or range');
      err.status = 400;
      throw err;
    }
  }

  return { period, start: start.toDate(), end: end.toDate(), label };
}

async function fetchMovements(range) {
  const { Invoice, Payment, Quote } = getModels();
  const { start, end } = range;
  const dateQuery = { $gte: start, $lte: end };

  const [invoices, payments, quotes] = await Promise.all([
    Invoice.find({ removed: false, date: dateQuery })
      .populate('client', 'name')
      .sort({ date: -1 })
      .lean(),
    Payment.find({ removed: false, date: dateQuery })
      .populate('client', 'name')
      .populate('invoice', 'number year')
      .sort({ date: -1 })
      .lean(),
    Quote.find({ removed: false, date: dateQuery })
      .populate('client', 'name')
      .sort({ date: -1 })
      .lean(),
  ]);

  const invoiceTotal = invoices.reduce((s, i) => s + (i.total || 0), 0);
  const paymentTotal = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const quoteTotal = quotes.reduce((s, q) => s + (q.total || 0), 0);

  return {
    invoices,
    payments,
    quotes,
    summary: {
      invoiceCount: invoices.length,
      paymentCount: payments.length,
      quoteCount: quotes.length,
      invoiceTotal,
      paymentTotal,
      quoteTotal,
    },
  };
}

exports.list = async (req, res) => {
  try {
    const range = parsePeriod(req.query);
    const data = await fetchMovements(range);
    return res.status(200).json({
      success: true,
      result: {
        ...data,
        period: range.period,
        periodLabel: range.label,
        start: range.start,
        end: range.end,
      },
      message: 'Movements report',
    });
  } catch (e) {
    return res.status(e.status || 500).json({
      success: false,
      result: null,
      message: e.message,
    });
  }
};

exports.pdf = async (req, res) => {
  let targetLocation;
  try {
    const range = parsePeriod(req.query);
    const data = await fetchMovements(range);

    const dir = path.join('src', 'public', 'download', 'report');
    await fs.promises.mkdir(dir, { recursive: true });
    const fileName = `movement-${crypto.randomBytes(6).toString('hex')}.pdf`;
    targetLocation = path.join(dir, fileName);

    const custom = require('../pdfController');
    await custom.generateMovementReportPdf(
      { format: 'A4', targetLocation },
      {
        periodLabel: range.label,
        period: range.period,
        start: range.start,
        end: range.end,
        invoices: data.invoices,
        payments: data.payments,
        quotes: data.quotes,
        summary: data.summary,
      }
    );

    const downloadName = `relatorio-movimentos-${range.period}.pdf`;
    res.download(targetLocation, downloadName, (err) => {
      fs.unlink(targetLocation, () => {});
      if (err && !res.headersSent) {
        res.status(500).json({ success: false, message: err.message });
      }
    });
  } catch (e) {
    if (targetLocation) {
      fs.unlink(targetLocation, () => {});
    }
    return res.status(e.status || 500).json({
      success: false,
      result: null,
      message: e.message,
    });
  }
};
