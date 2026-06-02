const mongoose = require('mongoose');

const taxesSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  taxName: {
    type: String,
    required: true,
  },
  taxValue: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },

  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

taxesSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Taxes', taxesSchema);
