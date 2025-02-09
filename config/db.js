const mongoose = require("mongoose");
require("dotenv").config();

const DB_NAME = process.env.DB_NAME;
const DB_USER_NAME = process.env.DB_USER_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const CLUSTER_ID = process.env.CLUSTER_ID;
DB_CONNECTION = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@cluster63457.${CLUSTER_ID}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_CONNECTION);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
