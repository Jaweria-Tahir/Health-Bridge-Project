const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.MONGO_URI) {
  console.error("\n  MONGO_URI is not set!");
  console.error("   Make sure backend/.env exists and contains:");
  console.error('   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/healthbridge?retryWrites=true&w=majority\n');
  process.exit(1);
}

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const educationRoutes = require("./routes/educationRoutes");
const questionRoutes = require("./routes/questionRoutes");
const seedDatabase = require("../seed");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/questions", questionRoutes);



app.get("/", (req, res) => {
  res.json({
    message: "HealthBridge API is running!"
  });
});



app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "HealthBridge API"
  });
});


mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    tls: true,
  })
  .then(async () => {
    console.log(" MongoDB connected successfully");

    try {
      await seedDatabase();
    } catch (error) {
      console.error(" Database seed failed; continuing without seed data:", error.message);
    }

    const PORT = parseInt(process.env.PORT, 10) || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(` HealthBridge server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("\n MongoDB connection failed:");
    console.error("   Error:", error.message);
    console.error("\n   Common fixes:");
    console.error("   1. Check MONGO_URI in backend/.env is correct");
    console.error("   2. If password has special chars (like @, #, !), URL-encode them");
    console.error("   3. In Atlas → Network Access → Allow Access from Anywhere (0.0.0.0/0)");
    console.error("   4. In Atlas → Database Access → verify username/password\n");
    process.exit(1);
  });