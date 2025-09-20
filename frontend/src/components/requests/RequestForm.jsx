// frontend/src/components/requests/RequestForm.jsx
import React, { useState } from "react";
import Input from "../Input";
import Button from "../Button";

const RequestForm = ({ onSubmit, onCancel }) => {
  const [medicine, setMedicine] = useState("");
  const [weight, setWeight] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!medicine.trim()) {
      newErrors.medicine = "Medicine name is required";
    }
    
    if (!weight.trim()) {
      newErrors.weight = "Weight is required";
    } else if (isNaN(weight) || Number(weight) <= 0) {
      newErrors.weight = "Please enter a valid weight";
    }
    
    if (!deadline.trim()) {
      newErrors.deadline = "Deadline is required";
    } else {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.deadline = "Deadline cannot be in the past";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await onSubmit({
        medicine: medicine.trim(),
        quantity: Number(weight),
        notes: `Deadline: ${deadline}`,
      });
      
      // Reset form on success
      setMedicine("");
      setWeight("");
      setDeadline("");
      setErrors({});
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Create Medical Request</h3>
        <p className="text-gray-600">Fill out the form below to request medical supplies from other hospitals in the network.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <Input
            label="Medicine(s) Required"
            value={medicine}
            onChange={(e) => {
              setMedicine(e.target.value);
              if (errors.medicine) {
                setErrors(prev => ({ ...prev, medicine: "" }));
              }
            }}
            placeholder="e.g., Paracetamol, Insulin, Antibiotics"
            required
            error={errors.medicine}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>}
            helperText="List all medicines you need separated by commas"
          />
          
          <Input
            label="Total Weight (kg)"
            type="number"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              if (errors.weight) {
                setErrors(prev => ({ ...prev, weight: "" }));
              }
            }}
            placeholder="e.g., 2.5"
            required
            error={errors.weight}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>}
            helperText="Enter the approximate total weight of all medicines"
          />
          
          <Input
            label="Delivery Deadline"
            type="date"
            value={deadline}
            onChange={(e) => {
              setDeadline(e.target.value);
              if (errors.deadline) {
                setErrors(prev => ({ ...prev, deadline: "" }));
              }
            }}
            required
            error={errors.deadline}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>}
            helperText="When do you need these medicines delivered?"
          />
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Request Information</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Your request will be visible to all hospitals in the network</li>
                <li>Once accepted, you'll receive a tracking ID for delivery monitoring</li>
                <li>Emergency requests are prioritized automatically</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>}
            className="min-w-32"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;