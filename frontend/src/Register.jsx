/* import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    code: "", name: "", email: "", password: "",
    lat: "", lng: "", address: "", contact_phone: ""
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      const body = {
        ...form,
        lat: Number(form.lat),
        lng: Number(form.lng)
      };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.ok) {
        setMsg("Registration successful. Redirecting to login…");
        setTimeout(() => navigate("/login", { replace: true }), 1200);
      } else {
        setErr(data.error || "Registration failed");
      }
    } catch {
      setErr("Server error");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow w-full max-w-lg space-y-3">
        <h1 className="text-xl font-semibold">Register Hospital</h1>
        {msg && <div className="p-2 bg-green-100 text-green-700 rounded">{msg}</div>}
        {err && <div className="p-2 bg-red-100 text-red-700 rounded">{err}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="code" placeholder="Code (HOSP_A)" className="border p-2 rounded w-full" value={form.code} onChange={handleChange} required />
          <input name="name" placeholder="Hospital Name" className="border p-2 rounded w-full" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" className="border p-2 rounded w-full" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" className="border p-2 rounded w-full" value={form.password} onChange={handleChange} required />
          <input name="lat" type="number" step="any" placeholder="Latitude" className="border p-2 rounded w-full" value={form.lat} onChange={handleChange} required />
          <input name="lng" type="number" step="any" placeholder="Longitude" className="border p-2 rounded w-full" value={form.lng} onChange={handleChange} required />
          <input name="contact_phone" placeholder="Contact Phone" className="border p-2 rounded w-full" value={form.contact_phone} onChange={handleChange} />
          <input name="address" placeholder="Address" className="border p-2 rounded w-full md:col-span-2" value={form.address} onChange={handleChange} />
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 w-full">Register</button>
        <div className="text-sm text-center">Already have an account? <Link className="text-blue-600" to="/login">Login</Link></div>
      </form>
    </div>
  );
}
 
 */
/* import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    code: "", name: "", email: "", password: "",
    lat: "", lng: "", address: "", contact_phone: ""
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      const body = { ...form, lat: Number(form.lat), lng: Number(form.lng) };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg("Registration successful. Redirecting to login…");
        setTimeout(() => navigate("/login", { replace: true }), 1200);
      } else {
        setErr(data.error || "Registration failed");
      }
    } catch {
      setErr("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 p-6">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Register Hospital
        </h1>
        <p className="text-center text-white/80 mb-6">
          Create an account to manage your hospital
        </p>

        {msg && (
          <div className="p-3 mb-4 text-sm text-green-200 bg-green-900/40 border border-green-700 rounded-md">
            {msg}
          </div>
        )}
        {err && (
          <div className="p-3 mb-4 text-sm text-red-200 bg-red-900/40 border border-red-700 rounded-md">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input
            name="code"
            placeholder="Code (HOSP_A)"
            value={form.code}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
          <input
            name="name"
            placeholder="Hospital Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
          <input
            name="lat"
            type="number"
            step="any"
            placeholder="Latitude"
            value={form.lat}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
          <input
            name="lng"
            type="number"
            step="any"
            placeholder="Longitude"
            value={form.lng}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
          <input
            name="contact_phone"
            placeholder="Contact Phone"
            value={form.contact_phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full md:col-span-2 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
        </form>

        <button
          onClick={handleSubmit}
          className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition transform hover:scale-[1.02] shadow-lg"
        >
          Register
        </button>

        <p className="mt-6 text-center text-sm text-white/80">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-300 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
 */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    code: "", name: "", email: "", password: "",
    lat: "", lng: "", address: "", contact_phone: ""
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); 
    setMsg("");
    try {
      const body = { ...form, lat: Number(form.lat), lng: Number(form.lng) };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg("Registration successful. Redirecting to login…");
        setTimeout(() => navigate("/login", { replace: true }), 1200);
      } else {
        setErr(data.error || "Registration failed");
      }
    } catch {
      setErr("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-100 to-blue-300 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 border border-blue-300">
        <h1 className="text-3xl font-bold text-blue-800 text-center mb-2">
          Register Hospital
        </h1>
        <p className="text-center text-blue-700 mb-6">
          Join our network to manage <span className="font-semibold">Medical Drone</span> emergencies efficiently.
        </p>
        <p className="text-center text-blue-600 mb-6 text-sm">
          Fast, reliable, and life-saving logistics for your hospital.
        </p>

        {msg && (
          <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 border border-green-400 rounded-md">
            {msg}
          </div>
        )}
        {err && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input
            name="code"
            placeholder="Code (HOSP_A)"
            value={form.code}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-blue-50 text-blue-800 placeholder-blue-400 border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <input
            name="name"
            placeholder="Hospital Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-blue-50 text-blue-800 placeholder-blue-400 border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-blue-50 text-blue-800 placeholder-blue-400 border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-blue-50 text-blue-800 placeholder-blue-400 border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <input
            name="lat"
            type="number"
            step="any"
            placeholder="Latitude"
            value={form.lat}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-blue-50 text-blue-800 placeholder-blue-400 border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <input
            name="lng"
            type="number"
            step="any"
            placeholder="Longitude"
            value={form.lng}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-blue-50 text-blue-800 placeholder-blue-400 border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <input
            name="contact_phone"
            placeholder="Contact Phone"
            value={form.contact_phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-blue-50 text-blue-800 placeholder-blue-400 border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full md:col-span-2 px-4 py-3 rounded-lg bg-blue-50 text-blue-800 placeholder-blue-400 border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        </form>

        <button
          type="submit"
          onClick={handleSubmit}
          className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold transition transform hover:scale-[1.02] shadow-lg"
        >
          Register
        </button>

        <p className="mt-6 text-center text-sm text-blue-800">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
