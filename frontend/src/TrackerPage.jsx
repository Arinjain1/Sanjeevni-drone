import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTracking } from "./TrackingContext";
import LocationInfo from "./components/tracker/LocationInfo";

// Fix Leaflet image paths under Vite
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
});

function makeIcon(color = "#dc2626", size = 28) {
  const svg = encodeURIComponent(
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="${color}" stroke="#fff" stroke-width="2"/></svg>`
  );
  return L.divIcon({
    html: `<img src="data:image/svg+xml,${svg}" style="width:${size}px;height:${size}px" />`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function TrackerPage() {
  const [searchParams] = useSearchParams();
  const { 
    apiKeyInput, 
    setApiKeyInput, 
    isTracking, 
    resolvedDroneId, 
    lastLocation, 
    setLastLocation,
    startTracking,
    stopTracking
  } = useTracking();
  const [status, setStatus] = useState("disconnected");
  const [follow, setFollow] = useState(true);

  const mapRef = useRef(null);
  const markersRef = useRef({ drone: null, circle: null });

  // socket
  const socket = useMemo(() => io("http://localhost:3000", { transports: ["websocket", "polling"], autoConnect: true }), []);

  useEffect(() => {
    // map init
    const map = L.map("map", { center: [22.7, 75.88], zoom: 5, preferCanvas: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 120);
    return () => map.remove();
  }, []);

  useEffect(() => {
    socket.on("connect", () => setStatus("connected"));
    socket.on("disconnect", () => setStatus("disconnected"));
    socket.on("receive-location", (rec) => {
      if (!rec || !mapRef.current) return;
      // rec: { id/drone_id, latitude, longitude, accuracy, speed, heading, ts }
      const lat = rec.latitude, lng = rec.longitude;
      setLastLocation({
        lat, lng,
        speed: rec.speed || 0,
        altitude: 0,
        accuracy: rec.accuracy || null,
        timestamp: rec.ts || Date.now(),
      });

      if (!markersRef.current.drone) {
        markersRef.current.drone = L.marker([lat, lng], { icon: makeIcon("#dc2626", 28) }).addTo(mapRef.current).bindPopup(rec.id || rec.drone_id);
      } else {
        markersRef.current.drone.setLatLng([lat, lng]);
      }

      if (rec.accuracy) {
        if (!markersRef.current.circle) {
          markersRef.current.circle = L.circle([lat, lng], { radius: rec.accuracy, color: "#dc2626", fillOpacity: 0.12, weight: 1 }).addTo(mapRef.current);
        } else {
          markersRef.current.circle.setLatLng([lat, lng]);
          markersRef.current.circle.setRadius(rec.accuracy);
        }
      }

      if (follow) {
        const z = Math.max(mapRef.current.getZoom(), 14);
        mapRef.current.setView([lat, lng], z);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receive-location");
      socket.disconnect();
    };
  }, [socket, follow]);

  // Auto-start tracking if API key is provided via URL parameter
  useEffect(() => {
    if (apiKeyInput && !resolvedDroneId && !isTracking) {
      startTracking();
    }
  }, [apiKeyInput]);

  // Clear markers when tracking stops
  useEffect(() => {
    if (!isTracking) {
      if (markersRef.current.drone) {
        mapRef.current?.removeLayer(markersRef.current.drone);
        markersRef.current.drone = null;
      }
      if (markersRef.current.circle) {
        mapRef.current?.removeLayer(markersRef.current.circle);
        markersRef.current.circle = null;
      }
    }
  }, [isTracking]);

  const centerAll = () => {
    const map = mapRef.current;
    if (!map) return;
    const latlngs = [];
    if (markersRef.current.drone) latlngs.push(markersRef.current.drone.getLatLng());
    if (!latlngs.length) return;
    map.fitBounds(L.latLngBounds(latlngs).pad(0.15));
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 relative">
        <div id="map" className="absolute inset-0" />
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-3 z-10">
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded text-xs font-medium ${status === "connected" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {status === "connected" ? "Connected" : "Disconnected"}
            </div>
            <button
              onClick={() => setFollow((f) => !f)}
              className={`px-3 py-1 rounded text-xs font-medium ${
                follow ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {follow ? "Following" : "Follow"}
            </button>
            <button
              onClick={centerAll}
              className="px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
            >
              Center
            </button>
          </div>
        </div>
        
        <LocationInfo lastLocation={lastLocation} />
      </div>
    </div>
  );
}
