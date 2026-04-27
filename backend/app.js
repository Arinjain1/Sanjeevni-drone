require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg"); // Replaced mysql2 with pg
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", credentials: true } });

app.use(cors());
app.use(bodyParser.json());

// ---------- DB ----------
let pool;
(async () => {
  pool = new Pool({
    // Get this connection string from Supabase: Project Settings -> Database -> Connection String (URI)
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase
  });
  
  try {
    await pool.query("SELECT 1");
    console.log("Supabase (PostgreSQL) connected");
  } catch (e) {
    console.error("Supabase connection failed:", e.message);
  }
})();

// ---------- Helpers ----------
function authRequired(req, res, next) {
  const auth = req.header("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, code, name, email? }
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// in-memory maps for fast tracking id lookups
const trackingMap = {};     // trackingId (drone api key) -> drone_id

// ---------- Auth ----------
app.post("/api/auth/register", async (req, res) => {
  try {
    const { code, name, email, password, lat, lng, address, contact_phone } = req.body;
    if (!code || !name || !email || !password || typeof lat !== "number" || typeof lng !== "number") {
      return res.status(400).json({ error: "code,name,email,password,lat,lng required" });
    }
    const hash = await bcrypt.hash(password, 10);
    
    // Postgres uses RETURNING id to get the inserted row's ID
    const { rows } = await pool.query(
      `INSERT INTO hospitals (code,name,address,contact_phone,lat,lng,email,password_hash)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [code, name, address || null, contact_phone || null, lat, lng, email, hash]
    );
    return res.json({ ok: true, id: rows[0].id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email and password required" });

  try {
    const { rows } = await pool.query(
      `SELECT id, code, name, email, password_hash FROM hospitals WHERE email=$1 LIMIT 1`,
      [email]
    );
    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });
    const u = rows[0];
    const ok = await bcrypt.compare(password, u.password_hash || "");
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const payload = { id: u.id, code: u.code, name: u.name, email: u.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "8h" });
    return res.json({ ok: true, token, user: payload });
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
});

// ---------- Drones ----------
app.post("/api/drones", authRequired, async (req, res) => {
  const { drone_id, model, status = "idle", description } = req.body;
  if (!drone_id) return res.status(400).json({ error: "drone_id required" });
  
  // Validate status
  const validStatuses = ['idle', 'in-flight', 'maintenance', 'offline'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status. Must be one of: " + validStatuses.join(', ') });
  }
  
  try {
    const api_key = uuidv4();
    await pool.query(
      `INSERT INTO drones (drone_id, hospital_id, model, status, api_key) VALUES ($1,$2,$3,$4,$5)`,
      [drone_id, req.user.id, model || null, status, api_key]
    );
    // for quick resolve by tracking id
    trackingMap[api_key] = drone_id;
    return res.json({ 
      ok: true, 
      drone_id, 
      api_key,
      model: model || null,
      status,
      hospital_id: req.user.id
    });
  } catch (err) {
    // 23505 is the Postgres error code for unique constraint violation
    if (err.code === '23505') { 
      return res.status(400).json({ error: "Drone ID already exists" });
    }
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/drones", authRequired, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, drone_id, hospital_id, model, status, api_key, created_at
       FROM drones WHERE hospital_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    return res.json({ ok: true, drones: rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ---------- Requests ----------
app.post("/api/requests", authRequired, async (req, res) => {
  const { medicine, quantity = 1, notes } = req.body;
  if (!medicine) return res.status(400).json({ error: "medicine required" });

  const request_id = "REQ-" + uuidv4();
  try {
    await pool.query(
      `INSERT INTO requests (request_id, requester_hospital_id, medicine, quantity, notes)
       VALUES ($1,$2,$3,$4,$5)`,
      [request_id, req.user.id, medicine, quantity, notes || null]
    );
    const payload = {
      request_id,
      requester_hospital_id: req.user.id,
      requester_hospital_name: req.user.name,
      medicine,
      quantity,
      notes,
      status: "open",
      created_at: new Date().toISOString()
    };
    io.emit("request-created", payload);
    return res.json({ ok: true, request_id, request: payload });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get all requests
app.get("/api/requests", authRequired, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT r.*, h.name as requester_hospital_name
      FROM requests r
      JOIN hospitals h ON r.requester_hospital_id = h.id
      ORDER BY r.created_at DESC
    `);
    return res.json({ ok: true, requests: rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// B accepts A's request with a Drone API Key
app.post("/api/requests/:requestId/accept", authRequired, async (req, res) => {
  const { requestId } = req.params;
  const { apiKey } = req.body;
  if (!apiKey) return res.status(400).json({ error: "apiKey required" });

  try {
    // ensure apiKey belongs to accepting hospital (B)
    const { rows: drows } = await pool.query(
      `SELECT id, drone_id, hospital_id, api_key FROM drones WHERE api_key=$1 LIMIT 1`,
      [apiKey.trim()]
    );
    if (!drows.length) return res.status(400).json({ error: "Invalid Drone API Key" });
    const drone = drows[0];
    if (drone.hospital_id !== req.user.id) return res.status(403).json({ error: "You don't own this drone" });

    // set accepted & assigned
    await pool.query(
      `UPDATE requests
       SET status='assigned', accepted_by_hospital_id=$1, accepted_at=NOW(), assigned_drone_id=$2
       WHERE request_id=$3`,
      [req.user.id, drone.id, requestId]
    );

    // Let requester know the tracking id (api key)
    io.emit("request-accepted", {
      request_id: requestId,
      tracking_id: drone.api_key,
      assigned_drone_id: drone.drone_id,
      accepted_by: req.user.id
    });

    // cache for tracking resolves
    trackingMap[drone.api_key] = drone.drone_id;

    return res.json({ ok: true, trackingId: drone.api_key });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ---------- Tracking Resolve ----------
app.get("/api/track/resolve/:trackingId", async (req, res) => {
  const { trackingId } = req.params;
  const cached = trackingMap[trackingId];
  if (cached) return res.json({ ok: true, droneId: cached, trackingId });

  try {
    const { rows } = await pool.query(`SELECT drone_id FROM drones WHERE api_key=$1 LIMIT 1`, [trackingId]);
    if (!rows.length) return res.status(404).json({ error: "Tracking ID not found" });
    trackingMap[trackingId] = rows[0].drone_id;
    return res.json({ ok: true, droneId: rows[0].drone_id, trackingId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ---------- Drone Location Ingest ----------
app.post("/api/locations", async (req, res) => {
  const { apiKey, latitude, longitude, accuracy, speed, heading } = req.body;
  if (!apiKey || typeof latitude !== "number" || typeof longitude !== "number") {
    return res.status(400).json({ error: "apiKey, latitude, longitude required" });
  }

  try {
    const { rows: drows } = await pool.query(`SELECT drone_id FROM drones WHERE api_key=$1 LIMIT 1`, [apiKey.trim()]);
    if (!drows.length) return res.status(400).json({ error: "Invalid apiKey" });
    const droneId = drows[0].drone_id;

    await pool.query(
      `INSERT INTO locations (drone_id, latitude, longitude, accuracy, speed, heading, ts)
       VALUES ($1,$2,$3,$4,$5,$6,NOW())`,
      [droneId, latitude, longitude, accuracy || null, speed || null, heading || null]
    );
    
    // PostgreSQL Upsert (replaces MySQL REPLACE INTO)
    await pool.query(
      `INSERT INTO latest_locations (drone_id, latitude, longitude, accuracy, speed, heading, ts, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
       ON CONFLICT (drone_id) 
       DO UPDATE SET 
         latitude = EXCLUDED.latitude, 
         longitude = EXCLUDED.longitude,
         accuracy = EXCLUDED.accuracy,
         speed = EXCLUDED.speed,
         heading = EXCLUDED.heading,
         ts = EXCLUDED.ts,
         updated_at = NOW()`,
      [droneId, latitude, longitude, accuracy || null, speed || null, heading || null]
    );

    // push to all clients
    io.emit("receive-location", {
      id: droneId,
      drone_id: droneId,
      latitude,
      longitude,
      accuracy,
      speed,
      heading,
      ts: Date.now()
    });

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ---------- Socket.io ----------
io.on("connection", async (socket) => {
  console.log("socket connected", socket.id);
  socket.on("disconnect", () => console.log("socket disconnected", socket.id));

  // send snapshot of latest requests? (optional)
  // send snapshot of routes? (optional)
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on :${process.env.PORT || 3000}`);
});