import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { TrackingProvider } from "./TrackingContext";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import HomePage from "./HomePage";
import DroneRegister from "./DroneRegister";
import DroneManagement from "./DroneManagement";
import DeviceManagement from "./DeviceManagement";
import TrackerPage from "./TrackerPage";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

function AppContent() {
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col">
      <Header title="Hospital Medicine Request System" />
      <div className="flex flex-1">
        <Sidebar onOpenRequest={() => setIsRequestOpen(true)} />
        <main className="flex-1 p-4 overflow-auto">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage isRequestOpen={isRequestOpen} setIsRequestOpen={setIsRequestOpen} />
              </ProtectedRoute>
            } />
            <Route path="/register-drone" element={
              <ProtectedRoute>
                <DroneRegister />
              </ProtectedRoute>
            } />
            <Route path="/drone-management" element={
              <ProtectedRoute>
                <DroneManagement />
              </ProtectedRoute>
            } />
            <Route path="/device-management" element={
              <ProtectedRoute>
                <DeviceManagement />
              </ProtectedRoute>
            } />
            <Route path="/track" element={
              <ProtectedRoute>
                <TrackerPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TrackingProvider>
        <AppContent />
      </TrackingProvider>
    </AuthProvider>
  );
}
