const { getModel } = require('../../models/getModel');

const increaseBySettingKey = async ({ settingKey }) => {
  try {
    if (!settingKey) {
      return null;
    }

    const Model = getModel('Setting');
    const result = await Model.findOneAndUpdate(
      { settingKey },
      { $inc: { settingValue: 1 } },
      {
        new: true,
        runValidators: true,
      }
    ).exec();

    return result || null;
  } catch {
    return null;
  }
};

module.exports = increaseBySettingKey;
