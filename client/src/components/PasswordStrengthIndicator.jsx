import React from "react";
import {
  getPasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from "../utils/validation";

const PasswordStrengthIndicator = ({ password }) => {
  const strength = getPasswordStrength(password);
  const label = getPasswordStrengthLabel(strength);
  const color = getPasswordStrengthColor(strength);

  const colorClasses = {
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    gray: "bg-gray-300",
  };

  const textColorClasses = {
    red: "text-red-600",
    yellow: "text-yellow-600",
    blue: "text-blue-600",
    green: "text-green-600",
    gray: "text-gray-600",
  };

  if (!password) return null;

  return (
    <div className='mt-2'>
      <div className='flex gap-1'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full ${
              i < strength ? colorClasses[color] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs mt-1 ${textColorClasses[color]}`}>
        Password Strength: <span className='font-semibold'>{label}</span>
      </p>
    </div>
  );
};

export default PasswordStrengthIndicator;
