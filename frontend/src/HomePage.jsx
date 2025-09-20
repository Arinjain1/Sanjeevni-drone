import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Button from "./components/Button";
import Modal from "./components/Modal";
import RequestForm from "./components/requests/RequestForm";
import RequestCard from "./components/requests/RequestCard";
import { useAuth } from "./AuthContext";

export default function HomePage({ isRequestOpen, setIsRequestOpen }) {
  const [showModal, setShowModal] = useState(isRequestOpen);
  const [requests, setRequests] = useState([]);
  const [socket, setSocket] = useState(null);
  const { token, user } = useAuth();

  useEffect(() => {
    setIsRequestOpen(false);
  }, [setIsRequestOpen]);

  useEffect(() => {
    // Load existing requests
    const loadRequests = async () => {
      try {
        const res = await fetch("/api/requests", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.ok) {
          setRequests(data.requests || []);
        }
      } catch (error) {
        console.error("Error loading requests:", error);
      }
    };

    loadRequests();

    // Initialize socket connection
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    // Listen for new requests
    newSocket.on("request-created", (request) => {
      setRequests(prev => [request, ...prev]);
    });

    // Listen for request acceptance
    newSocket.on("request-accepted", (data) => {
      setRequests(prev => 
        prev.map(req => 
          req.request_id === data.request_id 
            ? { ...req, status: "assigned", tracking_id: data.tracking_id }
            : req
        )
      );
    });

    return () => {
      newSocket.close();
    };
  }, [token]);

  const handleSubmitRequest = async (data) => {
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.ok) {
        console.log("Request submitted successfully");
        setShowModal(false);
      } else {
        alert(result.error || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Server error");
    }
  };

  const handleAcceptRequest = (requestId, trackingId) => {
    console.log(`Request ${requestId} accepted with tracking ID: ${trackingId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Medicine Requests Dashboard
        </h1>
        <Button onClick={() => setShowModal(true)}>
          New Request
        </Button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Available Requests
        </h2>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No requests available. Create a new request to get started.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <RequestCard
                key={request.request_id}
                request={request}
                onAccept={handleAcceptRequest}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="New Medicine Request"
      >
        <RequestForm
          onSubmit={handleSubmitRequest}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}
