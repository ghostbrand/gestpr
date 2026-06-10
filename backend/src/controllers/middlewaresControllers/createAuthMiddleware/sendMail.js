const { passwordVerfication } = require('../../../emailTemplate/emailVerfication');
const { accountWelcome } = require('../../../emailTemplate/accountWelcome');
const { Resend } = require('resend');
const nodemailer = require('nodemailer');

function resolveTransport(settings = {}) {
  const fromEnv = (process.env.MAIL_TRANSPORT || '').toLowerCase();
  const fromSettings = (settings.mail_transport || '').toLowerCase();
  const mode = fromEnv || fromSettings || 'resend';

  if (mode === 'smtp' && (process.env.SMTP_HOST || settings.smtp_host)) {
    return 'smtp';
  }
  if (process.env.RESEND_API) {
    return 'resend';
  }
  if (mode === 'smtp') {
    return 'smtp';
  }
  return 'resend';
}

const sendMail = async ({
  email,
  name,
  link,
  idurar_app_email,
  subject = 'GestPR — notificação',
  settings = {},
  plainPassword = null,
}) => {
  const html = plainPassword
    ? accountWelcome({
        title: subject,
        name,
        email,
        password: plainPassword,
        link,
      })
    : passwordVerfication({
        title: subject,
        name,
        link,
      });

  const from =
    idurar_app_email ||
    process.env.MAIL_FROM ||
    settings.idurar_app_email ||
    'noreply@example.com';

  const transport = resolveTransport(settings);

  if (transport === 'smtp') {
    const host = process.env.SMTP_HOST || settings.smtp_host;
    const port = Number(process.env.SMTP_PORT || settings.smtp_port || 587);
    const secure =
      String(process.env.SMTP_SECURE || settings.smtp_secure || '').toLowerCase() === 'true' ||
      port === 465;
    const user = process.env.SMTP_USER || settings.smtp_user;
    const pass = process.env.SMTP_PASS || settings.smtp_password;

    if (!host) {
      throw new Error('SMTP_HOST em falta (env ou definições).');
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user ? { user, pass: pass || '' } : undefined,
    });

    const info = await transporter.sendMail({
      from,
      to: email,
      subject,
      html,
    });
    return info;
  }

  const apiKey = process.env.RESEND_API;
  if (!apiKey) {
    throw new Error(
      'Configure RESEND_API no servidor ou defina mail_transport=smtp com SMTP_HOST nas definições.'
    );
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject,
    html,
  });
  if (error) {
    throw new Error(error.message || 'Resend error');
  }
  return data;
};

module.exports = sendMail;
