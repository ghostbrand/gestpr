const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const updateManySetting = async (req, res) => {
  let settingsHasError = false;
  const updateDataArray = [];
  const { settings } = req.body;

  for (const setting of settings) {
    if (!setting.hasOwnProperty('settingKey') || !setting.hasOwnProperty('settingValue')) {
      settingsHasError = true;
      break;
    }

    const { settingKey, settingValue, settingCategory = 'app_settings' } = setting;

    updateDataArray.push({
      updateOne: {
        filter: { settingKey },
        update: {
          $set: {
            settingKey,
            settingValue,
            settingCategory,
            removed: false,
            enabled: true,
          },
        },
        upsert: true,
      },
    });
  }

  if (updateDataArray.length === 0) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'No settings provided ',
    });
  }
  if (settingsHasError) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'Settings provided has Error',
    });
  }

  await Model.bulkWrite(updateDataArray);

  return res.status(200).json({
    success: true,
    result: [],
    message: 'we update all settings',
  });
};

module.exports = updateManySetting;
