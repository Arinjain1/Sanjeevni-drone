// frontend/src/components/requests/RequestSection.jsx
import React from "react";
import RequestCard from "./RequestCard";

const RequestSection = ({
  title,
  requests,
  onAccept,
  onDecline,
  onTrack,
  variant = "default",
  emptyMessage = "No requests available.",
  emptyDescription = "Check back later for new requests."
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "my-requests":
        return {
          headerBg: "bg-gradient-to-r from-blue-50 to-indigo-50",
          headerBorder: "border-blue-200",
          icon: (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ),
          iconBg: "bg-blue-600"
        };
      case "available":
        return {
          headerBg: "bg-gradient-to-r from-emerald-50 to-green-50",
          headerBorder: "border-emerald-200",
          icon: (
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          ),
          iconBg: "bg-emerald-600"
        };
      default:
        return {
          headerBg: "bg-gradient-to-r from-gray-50 to-slate-50",
          headerBorder: "border-gray-200",
          icon: (
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          ),
          iconBg: "bg-gray-600"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className={`${styles.headerBg} ${styles.headerBorder} border rounded-2xl p-6 shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${styles.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
              <div className="text-white">
                {styles.icon}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-600 mt-1">
                {requests.length === 1 
                  ? `${requests.length} request available` 
                  : `${requests.length} requests available`
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Updates</span>
            </div>
            
            {requests.length > 0 && (
              <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                Updated just now
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{emptyMessage}</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            {emptyDescription}
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Real-time monitoring</span>
            </div>
            <div className="w-1 h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Secure network</span>
            </div>
            <div className="w-1 h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Fast delivery</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request, index) => (
            <div 
              key={request.id || request.request_id || index}
              className="transform transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: `fadeInUp 0.6s ease-out forwards`
              }}
            >
              <RequestCard
                request={request}
                onAccept={onAccept}
                onDecline={onDecline}
                onTrack={onTrack}
                variant={variant}
              />
            </div>
          ))}
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RequestSection;