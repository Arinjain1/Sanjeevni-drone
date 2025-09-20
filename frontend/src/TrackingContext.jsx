import React, { createContext, useContext, useState } from "react";

export const TrackingContext = createContext(null);
export const useTracking = () => useContext(TrackingContext);

export function TrackingProvider({ children }) {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [resolvedDroneId, setResolvedDroneId] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);

  const startTracking = async () => {
    const apiKey = apiKeyInput.trim();
    if (!apiKey) return false;
    
    try {
      const res = await fetch(`/api/track/resolve/${encodeURIComponent(apiKey)}`);
      const data = await res.json();
      if (!data.ok) {
        alert(data.error || "Invalid API Key");
        return false;
      }
      
      setResolvedDroneId(data.droneId);
      setIsTracking(true);
      return true;
    } catch {
      alert("Server error starting tracking");
      return false;
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    setResolvedDroneId(null);
    setLastLocation(null);
  };

  return (
    <TrackingContext.Provider value={{
      apiKeyInput,
      setApiKeyInput,
      isTracking,
      setIsTracking,
      resolvedDroneId,
      setResolvedDroneId,
      lastLocation,
      setLastLocation,
      startTracking,
      stopTracking
    }}>
      {children}
    </TrackingContext.Provider>
  );
}
