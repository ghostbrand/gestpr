const { getModel } = require('../../models/getModel');

const readBySettingKey = async ({ settingKey }) => {
  try {
    if (!settingKey) {
      return null;
    }

    const Model = getModel('Setting');
    const result = await Model.findOne({ settingKey });

    return result || null;
  } catch {
    return null;
  }
};

module.exports = readBySettingKey;
