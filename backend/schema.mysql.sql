-- Create database
CREATE DATABASE IF NOT EXISTS realtime_tracker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE realtime_tracker;

-- ===============================
-- 1. Hospitals (users)
-- ===============================
CREATE TABLE IF NOT EXISTS hospitals (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,        -- hospital code (HOSP_A)
  name VARCHAR(255) NOT NULL,              -- hospital name
  address TEXT,
  contact_phone VARCHAR(50),
  lat DOUBLE NOT NULL,                     -- latitude
  lng DOUBLE NOT NULL,                     -- longitude
  email VARCHAR(255) UNIQUE,               -- login email
  password_hash VARCHAR(255),              -- bcrypt hashed password
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 2. Drones
-- ===============================
CREATE TABLE IF NOT EXISTS drones (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  drone_id VARCHAR(128) NOT NULL UNIQUE,   -- external drone name/id
  hospital_id BIGINT NOT NULL,             -- owner hospital
  model VARCHAR(128),
  status ENUM('idle','in-flight','maintenance','offline') NOT NULL DEFAULT 'idle',
  api_key VARCHAR(128) UNIQUE,             -- secret API key (used as tracking ID)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
);

-- ===============================
-- 3. Requests
-- ===============================
CREATE TABLE IF NOT EXISTS requests (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  request_id VARCHAR(128) NOT NULL UNIQUE, -- public request id (UUID)
  requester_hospital_id BIGINT NOT NULL,   -- hospital making the request
  medicine VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 1,
  notes TEXT,
  status ENUM('open','assigned','in-transit','delivered','cancelled')
    NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_by_hospital_id BIGINT NULL,     -- hospital that accepted
  accepted_at TIMESTAMP NULL,
  assigned_drone_id BIGINT NULL,           -- drone assigned
  assigned_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (requester_hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
  FOREIGN KEY (accepted_by_hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_drone_id) REFERENCES drones(id) ON DELETE SET NULL
);

-- ===============================
-- 4. Locations (drone GPS history)
-- ===============================
CREATE TABLE IF NOT EXISTS locations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  drone_id VARCHAR(128) NOT NULL,          -- external drone id
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  accuracy DOUBLE DEFAULT NULL,            -- GPS accuracy
  speed DOUBLE DEFAULT NULL,               -- speed (km/h)
  heading DOUBLE DEFAULT NULL,             -- heading (degrees)
  ts DATETIME NOT NULL,                    -- timestamp from drone
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_drone_ts (drone_id, ts)
);

-- ===============================
-- 5. Latest Locations (fast lookup)
-- ===============================
CREATE TABLE IF NOT EXISTS latest_locations (
  drone_id VARCHAR(128) NOT NULL PRIMARY KEY,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  accuracy DOUBLE,
  speed DOUBLE,
  heading DOUBLE,
  ts DATETIME NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

-- ===============================
-- 6. Routes (optional, delivery paths)
-- ===============================
CREATE TABLE IF NOT EXISTS routes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  route_id VARCHAR(128) NOT NULL UNIQUE,
  drone_id VARCHAR(128) NOT NULL,
  src_lat DOUBLE NOT NULL,
  src_lng DOUBLE NOT NULL,
  dst_lat DOUBLE NOT NULL,
  dst_lng DOUBLE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- Done
-- ===============================
