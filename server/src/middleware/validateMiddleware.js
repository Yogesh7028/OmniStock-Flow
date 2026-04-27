const validate = (schema) => (req, res, next) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];

    if (rules.required && (value === undefined || value === null || value === "")) {
      errors.push(`${field} is required`);
      continue;
    }

    if (value === undefined || value === null || value === "") continue;

    if (rules.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value))) errors.push(`${field} must be a valid email`);
    }

    if (rules.type === "number" && Number.isNaN(Number(value))) {
      errors.push(`${field} must be a number`);
    }

    if (rules.minLength && String(value).length < rules.minLength) {
      errors.push(`${field} must be at least ${rules.minLength} characters`);
    }

    if (rules.min !== undefined && Number(value) < rules.min) {
      errors.push(`${field} must be at least ${rules.min}`);
    }

    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${field} must be one of: ${rules.enum.join(", ")}`);
    }
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

module.exports = validate;
