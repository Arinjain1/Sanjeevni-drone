import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import Card from "./components/Card";
import Button from "./components/Button";

export default function DeviceManagement() {
  const { token, user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, idle, in-flight, maintenance, offline

  useEffect(() => {
    loadDevices();
  }, [token]);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/drones", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      if (data.ok) {
        setDevices(data.drones || []);
        setError("");
      } else {
        setError(data.error || "Failed to load devices");
      }
    } catch (err) {
      setError("Server error: " + err.message);
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "idle": return "🟢";
      case "in-flight": return "✈️";
      case "maintenance": return "🔧";
      case "offline": return "🔴";
      default: return "⚪";
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

  const filteredDevices = devices.filter(device => 
    filter === "all" || device.status === filter
  );

  const statusCounts = {
    all: devices.length,
    idle: devices.filter(d => d.status === 'idle').length,
    'in-flight': devices.filter(d => d.status === 'in-flight').length,
    maintenance: devices.filter(d => d.status === 'maintenance').length,
    offline: devices.filter(d => d.status === 'offline').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading devices...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Device Management</h2>
        <p className="text-gray-600">Monitor and manage all registered devices</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('-', ' ').toUpperCase()} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Devices Grid */}
      {filteredDevices.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No devices registered' : `No devices with status: ${filter}`}
          </h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' 
              ? 'Get started by registering your first device' 
              : 'Try selecting a different status filter'
            }
          </p>
          {filter === 'all' && (
            <Button variant="primary" onClick={() => window.location.href = '/register-drone'}>
              Register Device
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map((device) => (
            <Card key={device.drone_id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{device.drone_id}</h3>
                  <p className="text-sm text-gray-600">{device.model || "No model specified"}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getStatusIcon(device.status)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                    {device.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Registered:</span>
                  <span>{formatDate(device.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hospital ID:</span>
                  <span>{device.hospital_id}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">API Key:</label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-xs font-mono break-all">
                    {device.api_key}
                  </code>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(device.api_key);
                      alert("API Key copied to clipboard!");
                    }}
                    variant="secondary"
                    size="sm"
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(device.api_key);
                    window.location.href = `/track?apiKey=${device.api_key}`;
                  }}
                >
                  Track
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(device.api_key);
                    alert(`API Key copied! Use this in your device code:\n\napiKey = "${device.api_key}"`);
                  }}
                >
                  Get Code
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{statusCounts.idle}</div>
          <div className="text-sm text-gray-600">Idle</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{statusCounts['in-flight']}</div>
          <div className="text-sm text-gray-600">In Flight</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.maintenance}</div>
          <div className="text-sm text-gray-600">Maintenance</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{statusCounts.offline}</div>
          <div className="text-sm text-gray-600">Offline</div>
        </Card>
      </div>
    </div>
  );
}
