// frontend/src/components/requests/RequestCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Card";
import Button from "../Button";
import Modal from "../Modal";
import Input from "../Input";
import { useAuth } from "../../AuthContext";
import { useTracking } from "../../TrackingContext";

const RequestCard = ({ request, onAccept }) => {
  const { token, user } = useAuth();
  const { setApiKeyInput } = useTracking();
  const navigate = useNavigate();
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAccept = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`/api/requests/${request.request_id}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ apiKey }),
      });
      const data = await res.json();
      if (data.ok) {
        alert(`Request accepted! Tracking ID: ${data.trackingId}`);
        setShowAcceptModal(false);
        setApiKey("");
        if (onAccept) onAccept(request.request_id, data.trackingId);
      } else {
        alert(data.error || "Error accepting request");
      }
    } catch (error) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
      case "pending":
        return {
          bg: "bg-gradient-to-r from-amber-100 to-yellow-100",
          text: "text-amber-800",
          border: "border-amber-200",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      case "assigned":
        return {
          bg: "bg-gradient-to-r from-blue-100 to-indigo-100",
          text: "text-blue-800",
          border: "border-blue-200",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        };
      case "in-transit":
        return {
          bg: "bg-gradient-to-r from-purple-100 to-pink-100",
          text: "text-purple-800",
          border: "border-purple-200",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          ),
        };
      case "delivered":
        return {
          bg: "bg-gradient-to-r from-emerald-100 to-green-100",
          text: "text-emerald-800",
          border: "border-emerald-200",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      case "cancelled":
        return {
          bg: "bg-gradient-to-r from-red-100 to-rose-100",
          text: "text-red-800",
          border: "border-red-200",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-100 to-slate-100",
          text: "text-gray-800",
          border: "border-gray-200",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  const isOwnRequest = request.requester_hospital_id === user?.id;
  const statusConfig = getStatusConfig(request.status);

  return (
    <>
      <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-l-blue-500" hover>
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{request.medicine}</h3>
              <p className="text-sm text-gray-600 font-medium">
                {isOwnRequest ? "Your Request" : "Available Request"}
              </p>
            </div>
          </div>
          
          <div className={`
            inline-flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold border
            ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}
          `}>
            {statusConfig.icon}
            <span>{request.status?.toUpperCase() || "PENDING"}</span>
          </div>
        </div>
        
        {/* Details */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Requested By</p>
                <p className="text-sm font-semibold text-gray-900">
                  {request.requester_hospital_name || `Hospital #${request.requester_hospital_id}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Quantity</p>
                <p className="text-sm font-semibold text-gray-900">{request.quantity} kg</p>
              </div>
            </div>
          </div>
          
          {request.notes && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Notes</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{request.notes}</p>
                </div>
              </div>
            </div>
          )}
          
          {request.tracking_id && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs text-blue-600 font-medium mb-1">Tracking ID</p>
                  <div className="flex items-center space-x-2">
                    <code className="bg-blue-100 px-2 py-1 rounded text-xs font-mono text-blue-800">
                      {request.tracking_id}
                    </code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(request.tracking_id)}
                      className="p-1 hover:bg-blue-200 rounded transition-colors"
                      title="Copy tracking ID"
                    >
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3">
          {request.status === "open" && !isOwnRequest && (
            <Button
              variant="primary"
              onClick={() => setShowAcceptModal(true)}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
              className="group-hover:scale-105 transition-transform"
            >
              Accept Request
            </Button>
          )}

          {isOwnRequest && request.tracking_id && (
            <Button
              variant="secondary"
              onClick={() => {
                setApiKeyInput(request.tracking_id);
                navigate('/track');
              }}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>}
              className="group-hover:scale-105 transition-transform"
            >
              Track Delivery
            </Button>
          )}
        </div>
      </Card>

      {/* Accept Request Modal */}
      <Modal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        title="Accept Medical Request"
        size="lg"
      >
        <div className="space-y-6">
          {/* Request Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Request Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-600 font-medium">Medicine</p>
                <p className="text-blue-900 font-semibold">{request.medicine}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Quantity</p>
                <p className="text-blue-900 font-semibold">{request.quantity} kg</p>
              </div>
            </div>
            {request.notes && (
              <div className="mt-4">
                <p className="text-sm text-blue-600 font-medium">Notes</p>
                <p className="text-blue-900">{request.notes}</p>
              </div>
            )}
          </div>

          {/* Information Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important Information</p>
                <p>Enter your drone's API key below. This will be shared with the requester as their tracking ID, allowing them to monitor the delivery progress in real-time.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAccept} className="space-y-4">
            <Input
              label="Drone API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your drone's unique API key"
              required
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
              </svg>}
              helperText="This key will be used by the requester to track the delivery"
            />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAcceptModal(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="success"
                loading={loading}
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>}
              >
                Confirm Accept
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default RequestCard;