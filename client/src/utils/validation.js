// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - at least 6 characters
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters" };
  }
  return { isValid: true, message: "Password is valid" };
};

// Get password strength score (0-4)
export const getPasswordStrength = (password) => {
  let strength = 0;
  if (!password) return strength;

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

export const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 0:
    case 1:
      return "red";
    case 2:
      return "yellow";
    case 3:
      return "blue";
    case 4:
      return "green";
    default:
      return "gray";
  }
};

// Validate form data
export const validateRegisterForm = (data) => {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = "Full name is required";
  }

  if (!data.email || !data.email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (!validatePassword(data.password).isValid) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!data.cpassword) {
    errors.cpassword = "Please confirm your password";
  } else if (data.cpassword !== data.password) {
    errors.cpassword = "Passwords do not match";
  }

  if (!data.title || !data.title.trim()) {
    errors.title = "Title is required";
  }

  if (!data.role || !data.role.trim()) {
    errors.role = "Role is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = (data) => {
  const errors = {};

  if (!data.email || !data.email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
