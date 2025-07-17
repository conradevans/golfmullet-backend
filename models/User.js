// server/models/User.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    _id: String, // match product._id from frontend
    name: String,
    price: String,
    img: String,
    url: String,
  },
  { _id: false }
);

const cartItemSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    price: String,
    img: String,
    url: String,
    size: String,
    quantity: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    id: Number,
    items: [cartItemSchema],
    purchasedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [productSchema], // full product objects
  cart: [cartItemSchema], // full product objects + size + quantity
  orderHistory: [orderSchema],
});

module.exports = mongoose.model("User", userSchema);
