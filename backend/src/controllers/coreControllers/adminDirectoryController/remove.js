const mongoose = require('mongoose');

const { canModifyTarget, countOwners } = require('./helpers');

module.exports = async (req, res) => {
  const Admin = mongoose.model('Admin');
  const AdminPassword = mongoose.model('AdminPassword');
  const actor = req.admin;

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

  if (String(actor._id) === String(target._id)) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Não pode eliminar a sua própria conta.',
    });
  }

  if (!canModifyTarget(actor.role, target)) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Sem permissão para eliminar este utilizador.',
    });
  }

  if (target.role === 'owner') {
    const owners = await countOwners(Admin);
    if (owners <= 1) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Não pode eliminar o único proprietário.',
      });
    }
  }

  target.removed = true;
  await target.save();

  await AdminPassword.findOneAndUpdate(
    { user: target._id },
    { removed: true },
    { new: true }
  ).exec();

  return res.status(200).json({
    success: true,
    result: null,
    message: 'Utilizador removido.',
  });
};
