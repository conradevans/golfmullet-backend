const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  url: String,
  price: String,
  tags: [String],
  img: String,
});

module.exports = mongoose.model("Product", productSchema);
