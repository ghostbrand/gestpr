const Joi = require('joi');

const mongoose = require('mongoose');

const checkAndCorrectURL = require('./checkAndCorrectURL');
const sendMail = require('./sendMail');
const shortid = require('shortid');
const loadSettings = require('../../../middlewares/settings/loadSettings');

const { useAppSettings } = require('../../../settings');

const forgetPassword = async (req, res, { userModel }) => {
  const UserPassword = mongoose.model(userModel + 'Password');
  const User = mongoose.model(userModel);
  const { email } = req.body;

  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
  });

  const { error } = objectSchema.validate({ email });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'E-mail inválido.',
      errorMessage: error.message,
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail, removed: false });
  if (!user) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Não existe conta registada com este e-mail.',
    });
  }

  const databasePassword = await UserPassword.findOne({ user: user._id, removed: false });
  if (!databasePassword) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Conta incompleta. Contacte o administrador.',
    });
  }

  const resetToken = shortid.generate();
  await UserPassword.findOneAndUpdate(
    { user: user._id },
    { resetToken },
    {
      new: true,
    }
  ).exec();

  const defaults = useAppSettings();
  const dbSettings = await loadSettings();
  const settings = { ...defaults, ...dbSettings };

  const idurar_app_email = settings['idurar_app_email'] || process.env.MAIL_FROM;
  const idurar_base_url =
    settings['idurar_base_url'] || process.env.PUBLIC_APP_URL || 'http://localhost:3000';

  const url = checkAndCorrectURL(String(idurar_base_url));

  const link = url + '/resetpassword/' + user._id + '/' + resetToken;

  try {
    await sendMail({
      email: normalizedEmail,
      name: user.name,
      link,
      subject: 'Redefinir palavra-passe — GestPR',
      idurar_app_email,
      settings,
    });
  } catch (mailError) {
    return res.status(502).json({
      success: false,
      result: null,
      message:
        'Não foi possível enviar o e-mail. Verifique as definições de e-mail (SMTP ou Resend) e tente novamente.',
      error: mailError.message,
    });
  }

  return res.status(200).json({
    success: true,
    result: null,
    message: 'Enviámos um e-mail com o link para redefinir a palavra-passe. Verifique também a pasta de spam.',
  });
};

module.exports = forgetPassword;
