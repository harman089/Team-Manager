// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - at least 6 characters, 1 uppercase, 1 number, 1 special char
export const validatePassword = (password) => {
  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character (!@#$%^&*)",
    };
  }
  return { isValid: true, message: "Password is valid" };
};

// Input sanitization - trim and remove potentially harmful characters
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "");
};

// Validate registration data
export const validateRegistration = (data) => {
  const errors = [];

  if (!data.name || !data.name.trim()) {
    errors.push("Name is required");
  }
  if (!data.email || !data.email.trim()) {
    errors.push("Email is required");
  } else if (!isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }
  if (!data.password) {
    errors.push("Password is required");
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation.message);
    }
  }
  if (!data.title || !data.title.trim()) {
    errors.push("Title is required");
  }
  if (!data.role || !data.role.trim()) {
    errors.push("Role is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate login data
export const validateLogin = (data) => {
  const errors = [];

  if (!data.email || !data.email.trim()) {
    errors.push("Email is required");
  } else if (!isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }
  if (!data.password) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Get password strength score (0-4)
export const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;
  return strength;
};

export const getPasswordStrengthLabel = (strength) => {
  switch (strength) {
    case 0:
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Strong";
    default:
      return "Unknown";
  }
};
