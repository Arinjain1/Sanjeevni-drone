// frontend/src/components/Input.jsx
import React, { useState } from "react";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  error = "",
  disabled = false,
  className = "",
  icon = null,
  iconPosition = "left",
  helperText = "",
  success = false,
  size = "default"
}) => {
  const [focused, setFocused] = useState(false);

  const sizes = {
    sm: "px-3 py-2 text-sm",
    default: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg",
  };

  const getInputClasses = () => {
    let classes = `
      w-full rounded-xl border transition-all duration-200 font-medium
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
      ${sizes[size]}
    `;

    if (error) {
      classes += " border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20 text-red-900";
    } else if (success) {
      classes += " border-emerald-300 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-500/20 text-emerald-900";
    } else if (focused) {
      classes += " border-blue-400 bg-blue-50/30 focus:border-blue-500 focus:ring-blue-500/20";
    } else {
      classes += " border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500/20";
    }

    if (icon) {
      classes += iconPosition === "left" ? " pl-11" : " pr-11";
    }

    return classes;
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          {label} 
          {required && <span className="text-red-500 text-lg">*</span>}
          {success && (
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </label>
      )}
      
      <div className="relative group">
        {icon && iconPosition === "left" && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={`
              transition-colors duration-200
              ${error ? "text-red-400" : 
                success ? "text-emerald-400" : 
                focused ? "text-blue-500" : "text-gray-400"}
            `}>
              {icon}
            </span>
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={getInputClasses()}
        />
        
        {icon && iconPosition === "right" && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className={`
              transition-colors duration-200
              ${error ? "text-red-400" : 
                success ? "text-emerald-400" : 
                focused ? "text-blue-500" : "text-gray-400"}
            `}>
              {icon}
            </span>
          </div>
        )}
        
        {/* Focus ring effect */}
        <div className={`
          absolute inset-0 rounded-xl transition-opacity duration-200 pointer-events-none
          ${focused ? "opacity-100" : "opacity-0"}
          ${error ? "shadow-lg shadow-red-500/10" : 
            success ? "shadow-lg shadow-emerald-500/10" : 
            "shadow-lg shadow-blue-500/10"}
        `}></div>
      </div>
      
      {/* Helper text or error message */}
      {(helperText || error) && (
        <div className="flex items-center gap-2">
          {error && (
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <p className={`text-sm ${error ? "text-red-600 font-medium" : "text-gray-600"}`}>
            {error || helperText}
          </p>
        </div>
      )}
    </div>
  );
};

export default Input;