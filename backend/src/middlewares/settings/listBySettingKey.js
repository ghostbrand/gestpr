const { getModel } = require('../../models/getModel');

const listBySettingKey = async ({ settingKeyArray = [] }) => {
  try {
    const Model = getModel('Setting');

    if (settingKeyArray.length === 0) {
      return [];
    }

    const settingsToShow = { $or: settingKeyArray.map((settingKey) => ({ settingKey })) };

    const results = await Model.find({ ...settingsToShow }).where('removed', false);

    return results.length >= 1 ? results : [];
  } catch {
    return [];
  }
};

module.exports = listBySettingKey;
