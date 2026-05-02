require("dotenv").config();
const connectDB = require("../config/db");
const { User } = require("../models/User");

const seedAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ email: "admin@omnistock.com" });
  if (existing) {
    console.log("Default admin already exists.");
    process.exit(0);
  }

  await User.create({
    name: "System Admin",
    email: "",
    phone: "9999999999",
    password: "Admin@123",
    role: "ADMIN",
    isVerified: true,
  });

  console.log("Default admin created: admin@omnistock.com / Admin@123");
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
