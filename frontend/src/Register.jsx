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
