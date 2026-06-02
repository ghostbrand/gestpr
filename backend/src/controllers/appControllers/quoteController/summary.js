const mongoose = require('mongoose');

const Model = mongoose.model('Quote');

/** Same shape as invoice summary so the dashboard cards work. */
const summary = async (req, res) => {
  let defaultType = 'month';

  const { type } = req.query;

  if (type) {
    if (['week', 'month', 'year'].includes(type)) {
      defaultType = type;
    } else {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid type',
      });
    }
  }

  const statuses = ['draft', 'pending', 'overdue', 'paid', 'unpaid', 'partially'];

  const response = await Model.aggregate([
    {
      $match: {
        removed: false,
      },
    },
    {
      $facet: {
        totalQuote: [
          {
            $group: {
              _id: null,
              total: { $sum: '$total' },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              total: '$total',
              count: '$count',
            },
          },
        ],
        statusCounts: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              status: '$_id',
              count: '$count',
            },
          },
        ],
        paymentStatusCounts: [
          {
            $group: {
              _id: '$paymentStatus',
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              status: '$_id',
              count: '$count',
            },
          },
        ],
        overdueCounts: [
          {
            $match: {
              expiredDate: { $lt: new Date() },
            },
          },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              status: '$_id',
              count: '$count',
            },
          },
        ],
      },
    },
  ]);

  let result = [];

  const totalQuotes = response[0].totalQuote?.[0] || { total: 0, count: 0 };
  const statusResult = response[0].statusCounts || [];
  const paymentStatusResult = response[0].paymentStatusCounts || [];
  const overdueResult = response[0].overdueCounts || [];

  const denom = totalQuotes.count || 1;

  const statusResultMap = statusResult.map((item) => ({
    ...item,
    percentage: Math.round((item.count / denom) * 100),
  }));

  const paymentStatusResultMap = paymentStatusResult.map((item) => ({
    ...item,
    percentage: Math.round((item.count / denom) * 100),
  }));

  const overdueResultMap = overdueResult.map((item) => ({
    ...item,
    status: 'overdue',
    percentage: Math.round((item.count / denom) * 100),
  }));

  statuses.forEach((status) => {
    const found = [...paymentStatusResultMap, ...statusResultMap, ...overdueResultMap].find(
      (item) => item.status === status
    );
    if (found) {
      result.push(found);
    }
  });

  const unpaid = await Model.aggregate([
    {
      $match: {
        removed: false,
        paymentStatus: { $in: ['unpaid', 'partially'] },
      },
    },
    {
      $group: {
        _id: null,
        total_amount: {
          $sum: {
            $subtract: ['$total', '$credit'],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total_amount: '$total_amount',
      },
    },
  ]);

  const finalResult = {
    total: totalQuotes?.total,
    total_undue: unpaid.length > 0 ? unpaid[0].total_amount : 0,
    type,
    performance: result,
  };

  return res.status(200).json({
    success: true,
    result: finalResult,
    message: `Successfully found all quotes for the last ${defaultType}`,
  });
};

module.exports = summary;
