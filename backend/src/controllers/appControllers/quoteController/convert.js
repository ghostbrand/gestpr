const mongoose = require('mongoose');
const readBySettingKey = require('../../../middlewares/settings/readBySettingKey');
const { increaseBySettingKey } = require('../../../middlewares/settings');

module.exports = async (req, res) => {
  const Quote = mongoose.model('Quote');
  const Invoice = mongoose.model('Invoice');

  const quote = await Quote.findOne({ _id: req.params.id, removed: false });
  if (!quote) {
    return res.status(404).json({
      success: false,
      message: 'Orçamento não encontrado.',
    });
  }

  const lastInvSetting = await readBySettingKey({ settingKey: 'last_invoice_number' });
  const lastNum = Number(lastInvSetting?.settingValue ?? 0);
  const nextNum = lastNum + 1;
  const year = new Date().getFullYear();
  const clientId = quote.client?._id || quote.client;

  const invoiceData = {
    createdBy: req.admin._id,
    number: nextNum,
    year,
    content: quote.content,
    date: new Date(),
    expiredDate: quote.expiredDate || new Date(),
    client: clientId,
    converted: { from: 'quote', quote: quote._id },
    items: quote.items,
    taxRate: quote.taxRate,
    subTotal: quote.subTotal,
    taxTotal: quote.taxTotal,
    total: quote.total,
    currency: quote.currency || 'EUR',
    credit: 0,
    discount: quote.discount || 0,
    notes: quote.notes,
    status: 'draft',
    paymentStatus: 'unpaid',
  };

  const inv = await new Invoice(invoiceData).save();
  await Invoice.findByIdAndUpdate(inv._id, { pdf: 'invoice-' + inv._id + '.pdf' });
  await increaseBySettingKey({ settingKey: 'last_invoice_number' });
  await Quote.findByIdAndUpdate(quote._id, { status: 'accepted' });

  return res.status(200).json({
    success: true,
    result: inv,
    message: 'Fatura criada a partir do orçamento.',
  });
};
