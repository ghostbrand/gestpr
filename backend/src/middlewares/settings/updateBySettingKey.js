const { getModel } = require('../../models/getModel');

const updateBySettingKey = async ({ settingKey, settingValue }) => {
  try {
    if (!settingKey || !settingValue) {
      return null;
    }

    const Model = getModel('Setting');
    const result = await Model.findOneAndUpdate(
      { settingKey },
      { settingValue },
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

module.exports = updateBySettingKey;
