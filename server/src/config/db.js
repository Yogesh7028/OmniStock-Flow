const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/omnistock-flow";
  const conn = await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
