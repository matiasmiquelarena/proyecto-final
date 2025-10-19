// src/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  stock: { type: Number, required: true },
  status: { type: Boolean, default: true },
  thumbnail: String
});

export default mongoose.model("Product", productSchema);
