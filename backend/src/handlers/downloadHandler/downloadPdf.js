const fs = require('fs');
const custom = require('../../controllers/pdfController');
const mongoose = require('mongoose');
const { downloadTarget } = require('../../utils/pdfPaths');
const { serveFile } = require('../../../api/_files');

module.exports = downloadPdf = async (req, res, { directory, id }) => {
  try {
    const modelName = directory.slice(0, 1).toUpperCase() + directory.slice(1);
    if (mongoose.models[modelName]) {
      const Model = mongoose.model(modelName);
      const result = await Model.findOne({
        _id: id,
      }).exec();

      // Throw error if no result
      if (!result) {
        throw { name: 'ValidationError' };
      }

      // Continue process if result is returned

      const fileId = modelName.toLowerCase() + '-' + result._id + '.pdf';
      const folderPath = modelName.toLowerCase();
      const targetLocation = downloadTarget(folderPath, fileId);
      await custom.generatePdf(modelName, { filename: folderPath, format: 'A4', targetLocation }, result);
      res.setHeader('Content-Disposition', `attachment; filename="${fileId}"`);
      serveFile(targetLocation, res);
      res.on('finish', () => {
        if (process.env.VERCEL) fs.unlink(targetLocation, () => {});
      });
      return;
    } else {
      return res.status(404).json({
        success: false,
        result: null,
        message: `Model '${modelName}' does not exist`,
      });
    }
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    if (error.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        error: error.message,
        message: 'Required fields are not supplied',
      });
    } else if (error.name == 'BSONTypeError') {
      // If error is thrown by Mongoose due to invalid ID
      return res.status(400).json({
        success: false,
        result: null,
        error: error.message,
        message: 'Invalid ID',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        error: error.message,
        message: error.message,
        controller: 'downloadPDF.js',
      });
    }
  }
};
