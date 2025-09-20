// frontend/src/components/Notification.jsx
import React, { useEffect, useState } from "react";

const types = {
  success: {
    bg: "bg-gradient-to-r from-emerald-50 to-green-50",
    border: "border-emerald-200",
    text: "text-emerald-900",
    icon: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  error: {
    bg: "bg-gradient-to-r from-red-50 to-rose-50",
    border: "border-red-200",
    text: "text-red-900",
    icon: "text-red-600",
    iconBg: "bg-red-100",
  },
  warning: {
    bg: "bg-gradient-to-r from-amber-50 to-orange-50",
    border: "border-amber-200",
    text: "text-amber-900",
    icon: "text-amber-600",
    iconBg: "bg-amber-100",
  },
  info: {
    bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
    border: "border-blue-200",
    text: "text-blue-900",
    icon: "text-blue-600",
    iconBg: "bg-blue-100",
  },
};

const icons = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const Notification = ({ 
  type = "info", 
  title, 
  message, 
  onClose, 
  autoClose = false,
  duration = 5000,
  className = "",
  showIcon = true
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const typeConfig = types[type];

  return (
    <div className={`
      transform transition-all duration-300 ease-out
      ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      ${className}
    `}>
      <div className={`
        rounded-xl shadow-lg border backdrop-blur-sm p-5 mb-3
        ${typeConfig.bg} ${typeConfig.border}
        hover:shadow-xl transition-shadow duration-200
      `}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {showIcon && (
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                ${typeConfig.iconBg}
              `}>
                <span className={typeConfig.icon}>
                  {icons[type]}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              {title && (
                <h3 className={`font-semibold mb-1 ${typeConfig.text}`}>
                  {title}
                </h3>
              )}
              <p className={`text-sm leading-relaxed ${typeConfig.text}`}>
                {message}
              </p>
            </div>
          </div>
          
          {onClose && (
            <button
              onClick={handleClose}
              className={`
                ml-4 p-1 rounded-lg hover:bg-white/50 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400
                ${typeConfig.icon}
              `}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Progress bar for auto-close */}
        {autoClose && (
          <div className="mt-3 w-full bg-white/30 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all ease-linear ${
                type === 'success' ? 'bg-emerald-500' :
                type === 'error' ? 'bg-red-500' :
                type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{
                width: '100%',
                animation: `shrink ${duration}ms linear forwards`
              }}
            ></div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Notification;