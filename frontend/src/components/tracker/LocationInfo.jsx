// frontend/src/components/tracking/LocationInfo.jsx
import React, { useState } from "react";

const LocationInfo = ({ lastLocation, eta, droneId, connectionStatus }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!lastLocation) return null;

  const formatCoordinate = (coord) => coord?.toFixed(6) || "N/A";
  const formatSpeed = (speed) => speed ? `${Math.round(speed)} km/h` : "0 km/h";
  const formatAltitude = (altitude) => altitude ? `${Math.round(altitude)}m` : "N/A";

  return (
    <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-10 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold">Location Info</h3>
              {droneId && (
                <p className="text-sm text-blue-200">Drone: {droneId}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
            <span className="text-sm font-medium text-gray-700">Connection Status</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span className={`text-sm font-bold ${
                connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'
              }`}>
                {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span className="text-sm font-medium text-blue-800">Latitude</span>
              </div>
              <code className="text-sm font-mono text-blue-900 bg-blue-100 px-2 py-1 rounded">
                {formatCoordinate(lastLocation.lat)}
              </code>
            </div>

            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span className="text-sm font-medium text-indigo-800">Longitude</span>
              </div>
              <code className="text-sm font-mono text-indigo-900 bg-indigo-100 px-2 py-1 rounded">
                {formatCoordinate(lastLocation.lng)}
              </code>
            </div>
          </div>

          {/* Speed and Altitude */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-1">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs font-medium text-emerald-800">Speed</span>
              </div>
              <div className="text-lg font-bold text-emerald-900">
                {formatSpeed(lastLocation.speed)}
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-1">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                <span className="text-xs font-medium text-purple-800">Altitude</span>
              </div>
              <div className="text-lg font-bold text-purple-900">
                {formatAltitude(lastLocation.altitude)}
              </div>
            </div>
          </div>

          {/* ETA */}
          {eta && (
            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-800">Estimated Arrival</p>
                    <p className="text-xs text-orange-600">Time remaining</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-900">
                  {eta} min
                </div>
              </div>
            </div>
          )}

          {/* Last Update */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Last Update:</span>
              </div>
              <span className="font-mono">
                {new Date(lastLocation.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;