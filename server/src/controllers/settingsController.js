const bcrypt = require("bcryptjs");
const Settings = require("../models/Settings");
const { User } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");
const sanitizeUser = require("../utils/sanitizeUser");

const adminOnlySections = ["organization", "rolePermissions", "integration"];

const roleSections = {
  ADMIN: [
    "account",
    "notifications",
    "appearance",
    "organization",
    "rolePermissions",
    "inventory",
    "payment",
    "invoice",
    "security",
    "integration",
    "data",
  ],
  WAREHOUSE_MANAGER: ["account", "notifications", "appearance", "inventory", "invoice", "security", "data"],
  STORE_MANAGER: ["account", "notifications", "appearance", "inventory", "payment", "invoice", "security", "data"],
  SUPPLIER: ["account", "notifications", "appearance", "security"],
};

const getDefaultRolePermissions = () => ({
  ADMIN: ["users", "products", "warehouses", "orders", "payments", "invoices", "reports", "settings"],
  WAREHOUSE_MANAGER: ["warehouses", "stock", "transfers", "orders", "invoices", "reports"],
  STORE_MANAGER: ["browse", "cart", "checkout", "orders", "invoices", "analytics"],
  SUPPLIER: ["orders", "deliveryStatus", "deliveryHistory"],
});

const getEnvBackedDefaults = () => ({
  payment: {
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
    razorpayEnabled: true,
    upiEnabled: true,
    cardEnabled: true,
    cashEnabled: true,
  },
  invoice: {
    gstPercent: Number(process.env.GST_PERCENTAGE || 18),
    invoicePrefix: "INV",
    logoUrl: "",
    footerNote: "Thank you for using OmniStock Flow.",
  },
  integration: {
    smtpHost: process.env.SMTP_HOST || "",
    smtpPort: Number(process.env.SMTP_PORT || 587),
    smtpUser: process.env.SMTP_USER || "",
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
  },
  rolePermissions: getDefaultRolePermissions(),
});

const getSettingsDocument = async ({ scope, user }) => {
  const query = scope === "GLOBAL" ? { scope, user: null } : { scope, user };
  const defaults = scope === "GLOBAL" ? getEnvBackedDefaults() : {};
  return Settings.findOneAndUpdate(query, { $setOnInsert: { ...query, ...defaults } }, { upsert: true, new: true });
};

const getAllowedSections = (role) => roleSections[role] || roleSections.SUPPLIER;

const toPlainSection = (sectionValue) => {
  if (!sectionValue) return {};
  return sectionValue.toObject ? sectionValue.toObject() : sectionValue;
};

const pickSections = ({ userSettings, globalSettings, role }) => {
  const allowed = getAllowedSections(role);
  return allowed.reduce((payload, section) => {
    const source = adminOnlySections.includes(section) ? globalSettings : userSettings;
    payload[section] = toPlainSection(source[section]);
    return payload;
  }, {});
};

const sectionScope = (section) => (adminOnlySections.includes(section) ? "GLOBAL" : "USER");

const ensureSectionAccess = (res, role, section) => {
  if (!getAllowedSections(role).includes(section)) {
    res.status(403);
    throw new Error("You do not have access to this settings section");
  }
};

const sanitizeSectionPayload = (section, payload = {}) => {
  const next = { ...payload };
  delete next._id;
  delete next.createdAt;
  delete next.updatedAt;

  if (section === "integration") {
    delete next.smtpPass;
    delete next.cloudinaryApiSecret;
    delete next.razorpayKeySecret;
  }

  if (section === "payment") {
    delete next.razorpayKeySecret;
  }

  return next;
};

const getSettings = asyncHandler(async (req, res) => {
  const [userSettings, globalSettings] = await Promise.all([
    getSettingsDocument({ scope: "USER", user: req.user._id }),
    getSettingsDocument({ scope: "GLOBAL", user: null }),
  ]);

  successResponse(res, "Settings fetched", {
    user: sanitizeUser(req.user),
    sections: pickSections({ userSettings, globalSettings, role: req.user.role }),
    allowedSections: getAllowedSections(req.user.role),
  });
});

const updateSettingsSection = asyncHandler(async (req, res) => {
  const { section } = req.params;
  ensureSectionAccess(res, req.user.role, section);

  const scope = sectionScope(section);
  const settings = await getSettingsDocument({
    scope,
    user: scope === "USER" ? req.user._id : null,
  });

  settings.set(section, {
    ...toPlainSection(settings[section]),
    ...sanitizeSectionPayload(section, req.body),
  });
  settings.markModified(section);
  await settings.save();

  successResponse(res, "Settings saved", { section, settings: toPlainSection(settings[section]) });
});

const updateAccountSettings = asyncHandler(async (req, res) => {
  const { name, phone, storeName, currentPassword, newPassword, otpEnabled } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (storeName !== undefined) user.storeName = storeName;

  if (newPassword) {
    if (!currentPassword || !(await bcrypt.compare(currentPassword, user.password))) {
      res.status(400);
      throw new Error("Current password is incorrect");
    }
    user.password = newPassword;
  }

  await user.save();

  const settings = await getSettingsDocument({ scope: "USER", user: req.user._id });
  if (otpEnabled !== undefined) {
    settings.set("account", {
      ...toPlainSection(settings.account),
      otpEnabled: Boolean(otpEnabled),
    });
    settings.markModified("account");
    await settings.save();
  }

  successResponse(res, "Account settings saved", {
    user: sanitizeUser(user),
    settings: toPlainSection(settings.account),
  });
});

module.exports = {
  getSettings,
  updateSettingsSection,
  updateAccountSettings,
};
