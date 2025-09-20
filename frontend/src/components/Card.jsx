// frontend/src/components/Card.jsx
import React from "react";

const Card = ({ 
  children, 
  className = "",
  variant = "default",
  padding = "default",
  hover = false,
  gradient = false,
  blur = false
}) => {
  const variants = {
    default: "bg-white border border-gray-200",
    elevated: "bg-white border border-gray-100 shadow-xl",
    glass: "bg-white/80 backdrop-blur-lg border border-white/20",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-200",
    dark: "bg-gray-800 border border-gray-700 text-white",
  };

  const paddings = {
    none: "p-0",
    sm: "p-4",
    default: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const hoverEffects = hover 
    ? "hover:shadow-2xl hover:scale-105 hover:-translate-y-1" 
    : "";

  const blurEffect = blur 
    ? "backdrop-blur-lg" 
    : "";

  return (
    <div
      className={`
        rounded-2xl shadow-lg transition-all duration-300 
        ${variants[variant]} 
        ${paddings[padding]} 
        ${hoverEffects}
        ${blurEffect}
        ${className}
      `}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl pointer-events-none"></div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;