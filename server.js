// server/server.js
require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/user");

const app = express();
app.use(cors());
app.use(express.json());

console.log("URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Change the port from 5000 to 5050 to avoid macOS AirTunes conflict
const PORT = 5050;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
