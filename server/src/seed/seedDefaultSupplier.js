require("dotenv").config();
const connectDB = require("../config/db");
const { User } = require("../models/User");

const DEFAULT_SUPPLIER_EMAIL = process.env.DEFAULT_SUPPLIER_EMAIL || "supplier@omnistock.com";
const DEFAULT_SUPPLIER_PASSWORD = process.env.DEFAULT_SUPPLIER_PASSWORD || "Supplier@123";

const seedDefaultSupplier = async () => {
  await connectDB();

  const existing = await User.findOne({ email: DEFAULT_SUPPLIER_EMAIL });
  if (existing) {
    console.log(`Default supplier already exists: ${DEFAULT_SUPPLIER_EMAIL}`);
    process.exit(0);
  }

  await User.create({
    name: "Default Supplier",
    email: DEFAULT_SUPPLIER_EMAIL,
    phone: "8888888888",
    password: DEFAULT_SUPPLIER_PASSWORD,
    role: "SUPPLIER",
    isVerified: true,
  });

  console.log(
    `Default supplier created: ${DEFAULT_SUPPLIER_EMAIL} / ${DEFAULT_SUPPLIER_PASSWORD}`
  );
  process.exit(0);
};

seedDefaultSupplier().catch((error) => {
  console.error(error);
  process.exit(1);
});
