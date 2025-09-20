/* import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok && data.token) {
        login(data.token, data.user);
        navigate("/", { replace: true });
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Login</h1>
        {error && <div className="p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        <input name="email" type="email" placeholder="Email" className="border p-2 rounded w-full" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="border p-2 rounded w-full" value={form.password} onChange={handleChange} required />
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 w-full">Login</button>
        <div className="text-sm text-center">No account? <Link className="text-blue-600" to="/register">Register</Link></div>
      </form>
    </div>
  );
}
  */
   /* import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok && data.token) {
        login(data.token, data.user);
        navigate("/", { replace: true });
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back
        </h1>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-200 bg-red-900/40 border border-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition transform hover:scale-[1.02] shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-200">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-300 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
   */
  import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok && data.token) {
        login(data.token, data.user);
        navigate("/", { replace: true });
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-100 to-blue-300 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-blue-300">
        <h1 className="text-3xl font-bold text-blue-800 text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-blue-700 mb-6">
          Your gateway to real-time <span className="font-semibold">Medical Drone</span> emergencies and deliveries.
        </p>
        <p className="text-center text-blue-600 mb-6 text-sm">
          Fast, Reliable, and Life-saving logistics at your fingertips.
        </p>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-blue-50 text-blue-800 placeholder-blue-400 border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-blue-50 text-blue-800 placeholder-blue-400 border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold transition transform hover:scale-[1.02] shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-blue-800">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
