const pug = require('pug');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const PDF_DIR = path.join(__dirname, '../../pdf');

function pdfTemplate(modelName) {
  return path.join(PDF_DIR, `${modelName}.pug`);
}
let pdf;

function getPdfEngine() {
  if (!pdf) {
    pdf = require('html-pdf');
  }
  return pdf;
}

async function renderHtmlToPdfFile(htmlContent, targetLocation, options = {}) {
  const format = options.format || 'A4';
  const landscape = options.orientation === 'landscape';

  if (process.env.VERCEL) {
    const chromium = require('@sparticuz/chromium');
    const puppeteer = require('puppeteer-core');
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      await page.pdf({
        path: targetLocation,
        format,
        landscape,
        printBackground: true,
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      });
    } finally {
      await browser.close();
    }
    return;
  }

  await new Promise((resolve, reject) => {
    getPdfEngine()
      .create(htmlContent, {
        format,
        orientation: landscape ? 'landscape' : 'portrait',
        border: options.border || '10mm',
      })
      .toFile(targetLocation, function (error) {
        if (error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        } else {
          resolve();
        }
      });
  });
}
const { loadSettings } = require('../../middlewares/settings');
const useLanguage = require('../../locale/useLanguage');
const { useMoney, useDate } = require('../../settings');

const { supportsPdf } = require('../../utils/pdfEntities');

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

exports.generatePdf = async (
  modelName,
  info = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
  result
) => {
  const { targetLocation } = info;
  if (!targetLocation) {
    throw new Error('PDF targetLocation is required');
  }

  if (!supportsPdf(modelName)) {
    throw new Error(`PDF não disponível para: ${modelName}`);
  }

  if (fs.existsSync(targetLocation)) {
    fs.unlinkSync(targetLocation);
  }

  const settings = await loadSettings();
  const selectedLang = settings['idurar_app_language'];
  const translate = useLanguage({ selectedLang });

  const {
    currency_symbol,
    currency_position,
    decimal_sep,
    thousand_sep,
    cent_precision,
    zero_format,
  } = settings;

  const { moneyFormatter } = useMoney({
    settings: {
      currency_symbol,
      currency_position,
      decimal_sep,
      thousand_sep,
      cent_precision,
      zero_format,
    },
  });
  const { dateFormat } = useDate({ settings });

  settings.public_server_file = process.env.PUBLIC_SERVER_FILE;

  const htmlContent = pug.renderFile(pdfTemplate(modelName), {
    model: result,
    settings,
    translate,
    dateFormat,
    moneyFormatter,
    moment: moment,
  });

  await renderHtmlToPdfFile(htmlContent, targetLocation, {
    format: info.format,
    orientation: 'portrait',
    border: '10mm',
  });
};

/**
 * Relatório de movimentos (faturas, pagamentos, orçamentos) — HTML→PDF.
 */
exports.generateMovementReportPdf = async (
  info = { format: 'A4', targetLocation: '' },
  payload
) => {
  const { targetLocation } = info;
  if (!targetLocation) {
    throw new Error('PDF targetLocation is required');
  }

  if (fs.existsSync(targetLocation)) {
    fs.unlinkSync(targetLocation);
  }

  const settings = await loadSettings();
  const selectedLang = settings['idurar_app_language'];
  const translate = useLanguage({ selectedLang });

  const {
    currency_symbol,
    currency_position,
    decimal_sep,
    thousand_sep,
    cent_precision,
    zero_format,
  } = settings;

  const { moneyFormatter } = useMoney({
    settings: {
      currency_symbol,
      currency_position,
      decimal_sep,
      thousand_sep,
      cent_precision,
      zero_format,
    },
  });
  const { dateFormat } = useDate({ settings });

  settings.public_server_file = process.env.PUBLIC_SERVER_FILE;

  const htmlContent = pug.renderFile(path.join(PDF_DIR, 'MovementReport.pug'), {
    ...payload,
    settings,
    translate,
    dateFormat,
    moneyFormatter,
    moment,
  });

  await renderHtmlToPdfFile(htmlContent, targetLocation, {
    format: info.format || 'A4',
    orientation: 'landscape',
    border: '8mm',
  });
};
