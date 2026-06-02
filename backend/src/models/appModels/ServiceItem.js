const mongoose = require('mongoose');

const serviceItemSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  /** `service` = prestação sem stock; `article` = produto com stock */
  itemKind: {
    type: String,
    enum: ['service', 'article'],
    default: 'service',
    required: true,
  },
  /** Apenas artigos — referência / código interno */
  sku: {
    type: String,
    default: '',
    trim: true,
  },
  /** Stock disponível (artigos) */
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  /** Alerta de reposição (artigos) */
  minStockLevel: {
    type: Number,
    default: 0,
    min: 0,
  },
  /** Unidade (ex.: un, cx, kg) — principalmente artigos */
  unit: {
    type: String,
    default: 'un',
    trim: true,
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

serviceItemSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('ServiceItem', serviceItemSchema);
