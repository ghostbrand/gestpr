const mongoose = require('mongoose');

module.exports = async (req, res) => {
  const Admin = mongoose.model('Admin');
  const actor = req.admin;

  const tmpResult = await Admin.findOne({
    _id: req.params.id,
    removed: false,
  })
    .select('email name surname role enabled created photo')
    .lean()
    .exec();

  if (!tmpResult) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found',
    });
  }

  const { canModifyTarget } = require('./helpers');
  if (!canModifyTarget(actor.role, tmpResult) && String(actor._id) !== String(tmpResult._id)) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Sem permissão para ver este utilizador.',
    });
  }

  return res.status(200).json({
    success: true,
    result: tmpResult,
    message: 'we found this document ',
  });
};
