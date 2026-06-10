const Joi = require('joi');
const mongoose = require('mongoose');
const { generate: uniqueId } = require('shortid');

const { canAssignRole } = require('./helpers');
const sendMail = require('../../middlewaresControllers/createAuthMiddleware/sendMail');
const checkAndCorrectURL = require('../../middlewaresControllers/createAuthMiddleware/checkAndCorrectURL');
const loadSettings = require('../../../middlewares/settings/loadSettings');
const { useAppSettings } = require('../../../settings');
const { generatePassword } = require('../../../utils/generatePassword');

module.exports = async (req, res) => {
  const Admin = mongoose.model('Admin');
  const AdminPassword = mongoose.model('AdminPassword');
  const actor = req.admin;

  const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: true } }).required(),
    password: Joi.string().min(6).optional().allow('', null),
    name: Joi.string().required(),
    surname: Joi.string().allow('', null),
    role: Joi.string().valid('owner', 'manager', 'staff').required(),
    enabled: Joi.boolean().default(true),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: error.details[0]?.message,
    });
  }

  if (!canAssignRole(actor.role, value.role)) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Não pode atribuir este nível de acesso.',
    });
  }

  const email = value.email.toLowerCase();

  const exists = await Admin.findOne({
    email,
    removed: false,
  }).exec();
  if (exists) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Já existe uma conta com este e-mail.',
    });
  }

  const plainPassword = value.password?.trim() || generatePassword();
  const newAdminPassword = new AdminPassword();
  const salt = uniqueId();
  const passwordHash = newAdminPassword.generateHash(salt, plainPassword);

  const doc = await new Admin({
    email,
    name: value.name,
    surname: value.surname || '',
    role: value.role,
    enabled: value.enabled !== false,
    removed: false,
  }).save();

  await new AdminPassword({
    password: passwordHash,
    emailVerified: true,
    salt,
    user: doc._id,
    removed: false,
  }).save();

  try {
    const defaults = useAppSettings();
    const dbSettings = await loadSettings();
    const settings = { ...defaults, ...dbSettings };

    const idurar_app_email = settings.idurar_app_email || process.env.MAIL_FROM;
    const idurar_base_url =
      settings.idurar_base_url || process.env.PUBLIC_APP_URL || 'http://localhost:3000';
    const loginLink = checkAndCorrectURL(String(idurar_base_url)) + '/login';

    await sendMail({
      email,
      name: value.name,
      link: loginLink,
      subject: 'A sua conta GestPR foi criada',
      idurar_app_email,
      settings,
      plainPassword,
    });
  } catch (mailError) {
    await AdminPassword.deleteOne({ user: doc._id });
    await Admin.deleteOne({ _id: doc._id });
    return res.status(502).json({
      success: false,
      result: null,
      message:
        'Utilizador não criado: falha ao enviar e-mail com a palavra-passe. Verifique SMTP/Resend nas definições.',
      error: mailError.message,
    });
  }

  const result = {
    _id: doc._id,
    email: doc.email,
    name: doc.name,
    surname: doc.surname,
    role: doc.role,
    enabled: doc.enabled,
    created: doc.created,
  };

  return res.status(200).json({
    success: true,
    result,
    message: 'Utilizador criado. A palavra-passe foi enviada para o e-mail indicado.',
  });
};
