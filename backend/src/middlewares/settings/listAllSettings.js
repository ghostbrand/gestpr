const { getModel } = require('../../models/getModel');

const listAllSettings = async () => {
  try {
    const Model = getModel('Setting');
    const result = await Model.find({
      removed: false,
    }).exec();

    if (result.length > 0) {
      return result;
    } else {
      return [];
    }
  } catch (error) {
    console.error('listAllSettings error:', error.message);
    return [];
  }
};

module.exports = listAllSettings;
