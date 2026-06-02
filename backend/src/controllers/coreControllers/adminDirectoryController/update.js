const Joi = require('joi');
const mongoose = require('mongoose');

const { canModifyTarget, canAssignRole, countOwners } = require('./helpers');

module.exports = async (req, res) => {
  const Admin = mongoose.model('Admin');
  const actor = req.admin;

  const schema = Joi.object({
    name: Joi.string(),
    surname: Joi.string().allow('', null),
    role: Joi.string().valid('owner', 'manager', 'staff'),
    enabled: Joi.boolean(),
  }).min(1);

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: error.details[0]?.message,
    });
  }

  const target = await Admin.findOne({
    _id: req.params.id,
    removed: false,
  }).exec();

  if (!target) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Utilizador não encontrado.',
    });
  }

  if (!canModifyTarget(actor.role, target)) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Sem permissão para alterar este utilizador.',
    });
  }

  if (value.role !== undefined && value.role !== target.role) {
    if (!canAssignRole(actor.role, value.role)) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Não pode atribuir este nível de acesso.',
      });
    }
    if (target.role === 'owner' && value.role !== 'owner') {
      const owners = await countOwners(Admin);
      if (owners <= 1) {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'Tem de existir pelo menos um administrador com perfil Proprietário.',
        });
      }
    }
  }

  if (value.enabled === false && String(actor._id) === String(target._id)) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Não pode desativar a sua própria conta.',
    });
  }

  if (value.enabled === false && target.role === 'owner') {
    const owners = await countOwners(Admin);
    if (owners <= 1) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Não pode desativar o único proprietário.',
      });
    }
  }

  Object.assign(target, value);
  const saved = await target.save();

  const result = {
    _id: saved._id,
    email: saved.email,
    name: saved.name,
    surname: saved.surname,
    role: saved.role,
    enabled: saved.enabled,
    photo: saved.photo,
    created: saved.created,
  };

  return res.status(200).json({
    success: true,
    result,
    message: 'Utilizador atualizado.',
  });
};
