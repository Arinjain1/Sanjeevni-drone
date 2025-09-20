import React, { useState } from "react";
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
