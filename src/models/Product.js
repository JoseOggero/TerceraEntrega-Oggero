const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;