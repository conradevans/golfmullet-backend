// server/server.js
require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/user");

const app = express();

// CORS options
const corsOptions = {
  origin: [
    "https://golfmullet.vercel.app", // Vercel frontend
    "http://localhost:3000", // Local frontend
  ],
  credentials: true,
};

app.use(cors(corsOptions));
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

// Use Render's PORT or default to 5050
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
