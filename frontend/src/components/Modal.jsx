// frontend/src/components/Modal.jsx
import React, { useEffect } from "react";

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "default",
  showCloseButton = true,
  closeOnOverlay = true,
  className = ""
}) => {
  const sizes = {
    sm: "max-w-md",
    default: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl mx-4",
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeOnOverlay ? onClose : undefined}
      ></div>
      
      {/* Modal Content */}
      <div className={`
        relative w-full ${sizes[size]} mx-4 transform transition-all duration-300 animate-modalSlide
      `}>
        <div className={`
          bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden
          ${className}
        `}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {title && (
                  <>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                  </>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="group p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
      
      {/* Custom CSS for modal animation */}
      <style jsx>{`
        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-modalSlide {
          animation: modalSlide 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;