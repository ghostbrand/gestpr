const Joi = require('joi');
const mongoose = require('mongoose');
const { generate: uniqueId } = require('shortid');

const { canAssignRole } = require('./helpers');

module.exports = async (req, res) => {
  const Admin = mongoose.model('Admin');
  const AdminPassword = mongoose.model('AdminPassword');
  const actor = req.admin;

  const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: true } }).required(),
    password: Joi.string().min(6).required(),
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

  const exists = await Admin.findOne({
    email: value.email.toLowerCase(),
    removed: false,
  }).exec();
  if (exists) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Já existe uma conta com este e-mail.',
    });
  }

  const newAdminPassword = new AdminPassword();
  const salt = uniqueId();
  const passwordHash = newAdminPassword.generateHash(salt, value.password);

  const doc = await new Admin({
    email: value.email.toLowerCase(),
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
    message: 'Utilizador criado com sucesso.',
  });
};
