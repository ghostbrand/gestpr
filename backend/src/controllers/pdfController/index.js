const pug = require('pug');
const fs = require('fs');
const moment = require('moment');
let pdf;

function getPdfEngine() {
  if (!pdf) {
    pdf = require('html-pdf');
  }
  return pdf;
}
const { loadSettings } = require('../../middlewares/settings');
const useLanguage = require('../../locale/useLanguage');
const { useMoney, useDate } = require('../../settings');

const pugFiles = ['invoice', 'offer', 'quote', 'payment'];

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

  if (!pugFiles.includes(modelName.toLowerCase())) {
    throw new Error(`PDF template not registered: ${modelName}`);
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

  const htmlContent = pug.renderFile('src/pdf/' + modelName + '.pug', {
    model: result,
    settings,
    translate,
    dateFormat,
    moneyFormatter,
    moment: moment,
  });

  await new Promise((resolve, reject) => {
    getPdfEngine()
      .create(htmlContent, {
        format: info.format,
        orientation: 'portrait',
        border: '10mm',
      })
      .toFile(targetLocation, function (error) {
        if (error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        } else {
          resolve();
        }
      });
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

  const htmlContent = pug.renderFile('src/pdf/MovementReport.pug', {
    ...payload,
    settings,
    translate,
    dateFormat,
    moneyFormatter,
    moment,
  });

  await new Promise((resolve, reject) => {
    getPdfEngine()
      .create(htmlContent, {
        format: info.format || 'A4',
        orientation: 'landscape',
        border: '8mm',
      })
      .toFile(targetLocation, function (error) {
        if (error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        } else {
          resolve();
        }
      });
  });
};
