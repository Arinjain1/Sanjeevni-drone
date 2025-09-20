import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import Card from "./components/Card";
import Button from "./components/Button";
import Input from "./components/Input";

export default function DroneRegister() {
  const { token, user } = useAuth();
  const [form, setForm] = useState({ 
    drone_id: "", 
    model: "",
    status: "idle",
    description: ""
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registeredDrone, setRegisteredDrone] = useState(null);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const generateDroneId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    setForm(prev => ({ ...prev, drone_id: `DRONE_${timestamp}_${random}` }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/drones", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (data.ok) {
        setRegisteredDrone({
          drone_id: data.drone_id,
          api_key: data.api_key,
          model: form.model,
          status: form.status
        });
        setMsg("Drone registered successfully!");
        setForm({ drone_id: "", model: "", status: "idle", description: "" });
      } else {
        setErr(data.error || "Registration failed");
      }
    } catch (error) {
      setErr("Server error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyApiKey = () => {
    if (registeredDrone?.api_key) {
      navigator.clipboard.writeText(registeredDrone.api_key);
      setMsg("API Key copied to clipboard!");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Register New Drone</h2>
        <p className="text-gray-600">
          Add a new drone to your fleet. Each drone will get a unique API key for tracking.
        </p>
      </div>

      {msg && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200">
          {msg}
        </div>
      )}

      {err && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {err}
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Drone ID"
                name="drone_id"
                value={form.drone_id}
                onChange={handleChange}
                placeholder="DRONE_001"
                required
              />
              <button
                type="button"
                onClick={generateDroneId}
                className="mt-1 text-sm text-blue-600 hover:text-blue-800"
              >
                Generate ID
              </button>
            </div>

            <Input
              label="Drone Model"
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="Pixhawk 4, DJI Mavic, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="idle">Idle</option>
                <option value="in-flight">In Flight</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <Input
              label="Description (Optional)"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of the drone"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setForm({ drone_id: "", model: "", status: "idle", description: "" })}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register Drone"}
            </Button>
          </div>
        </form>
      </Card>

      {registeredDrone && (
        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">✅ Drone Registered Successfully!</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Drone ID:</span>
              <span className="font-mono">{registeredDrone.drone_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Model:</span>
              <span>{registeredDrone.model || "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="capitalize">{registeredDrone.status}</span>
            </div>
            <div className="mt-3">
              <label className="block font-medium text-gray-700 mb-1">API Key:</label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 p-2 bg-gray-100 rounded text-xs font-mono break-all">
                  {registeredDrone.api_key}
                </code>
                <Button
                  onClick={copyApiKey}
                  variant="secondary"
                  size="sm"
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Use this API key to send location data from your drone
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
