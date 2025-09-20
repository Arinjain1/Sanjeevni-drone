import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import Card from "./components/Card";
import Button from "./components/Button";

export default function DroneManagement() {
  const { token, user } = useAuth();
  const [drones, setDrones] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState("");

  useEffect(() => {
    loadDrones();
  }, [token]);

  const loadDrones = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/drones", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      if (data.ok) {
        setDrones(data.drones || []);
        setErr("");
      } else {
        setErr(data.error || "Failed to load drones");
      }
    } catch (error) {
      setErr("Server error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyApiKey = async (apiKey, droneId) => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopiedKey(droneId);
      setTimeout(() => setCopiedKey(""), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "idle": return "bg-green-100 text-green-800";
      case "in-flight": return "bg-blue-100 text-blue-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "offline": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading drones...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Drones</h2>
          <p className="text-gray-600">Manage your drone fleet and API keys</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {drones.length} drone{drones.length !== 1 ? 's' : ''}
        </div>
      </div>

      {err && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {err}
        </div>
      )}

      {drones.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No drones registered</h3>
          <p className="text-gray-500 mb-4">Get started by registering your first drone</p>
          <Button variant="primary" onClick={() => window.location.href = '/register-drone'}>
            Register Drone
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drones.map((drone) => (
            <Card key={drone.drone_id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{drone.drone_id}</h3>
                  <p className="text-sm text-gray-600">{drone.model || "No model specified"}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(drone.status)}`}>
                  {drone.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Registered:</span>
                  <span>{formatDate(drone.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hospital:</span>
                  <span>{user?.name || user?.code}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">API Key:</label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-xs font-mono break-all">
                    {drone.api_key}
                  </code>
                  <Button
                    onClick={() => copyApiKey(drone.api_key, drone.drone_id)}
                    variant="secondary"
                    size="sm"
                  >
                    {copiedKey === drone.drone_id ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use this key to send location data from your drone
                </p>
              </div>

              <div className="mt-4 flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(drone.api_key);
                    // Navigate to tracker with API key
                    window.location.href = `/track?apiKey=${drone.api_key}`;
                  }}
                >
                  Track
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // Copy API key and show usage instructions
                    navigator.clipboard.writeText(drone.api_key);
                    alert(`API Key copied! Use this in your drone code:\n\napiKey = "${drone.api_key}"`);
                  }}
                >
                  Get Code
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
