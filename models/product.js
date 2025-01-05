const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// สร้าง Schema สำหรับสินค้า
const productSchema = new Schema({
  productId: String,
  product_name: String,
  price: Number,
  product_data: String,
  image: String,
});

// สร้างโมเดลจาก Schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;