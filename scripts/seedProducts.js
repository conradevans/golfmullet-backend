const mongoose = require("mongoose");
const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: __dirname + "/../.env" });

// Read and parse db.json
const filePath = path.join(__dirname, "db.json");
const rawData = fs.readFileSync(filePath, "utf-8");
const parsedData = JSON.parse(rawData);
const sampleProducts = parsedData.clothes; // 👈 since the array is under "clothes"

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log("✅ Sample products seeded!");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ MongoDB seed error:", err);
  });
