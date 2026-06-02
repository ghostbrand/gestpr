const mongoose = require('mongoose');

module.exports = async (req, res) => {
  const Admin = mongoose.model('Admin');
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.items, 10) || 10;
  const skip = page * limit - limit;
  const sortBy = req.query.sortBy || 'created';
  const sortValue =
    req.query.sortValue !== undefined && req.query.sortValue !== ''
      ? parseInt(req.query.sortValue, 10)
      : -1;

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];
  let searchFilter = {};
  if (fieldsArray.length > 0 && req.query.q) {
    searchFilter = {
      $or: fieldsArray.map((field) => ({ [field]: { $regex: new RegExp(req.query.q, 'i') } })),
    };
  }

  const [result, count] = await Promise.all([
    Admin.find({ removed: false, ...searchFilter })
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortValue })
      .select('email name surname role enabled created photo')
      .lean()
      .exec(),
    Admin.countDocuments({ removed: false, ...searchFilter }),
  ]);

  const pages = Math.ceil(count / limit) || 1;
  const pagination = { page, pages, count };

  return res.status(200).json({
    success: true,
    result,
    pagination,
    message: count > 0 ? 'Successfully found all documents' : 'Collection is Empty',
  });
};
