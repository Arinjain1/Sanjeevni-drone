# Hospital Medicine Request System

A real-time system for hospitals to request medicines and track drone deliveries.

## Features

- **Hospital Registration & Login**: Hospitals can register and log in to the system
- **Medicine Requests**: Hospitals can create requests for specific medicines
- **Real-time Broadcasting**: Requests are broadcasted to all hospitals in real-time
- **Request Acceptance**: Hospitals can accept requests using their drone API keys
- **Drone Tracking**: Real-time tracking of drone deliveries using API keys
- **Interactive Map**: Visual tracking of drone locations on a map

## System Flow

1. **Hospital A** registers and logs in
2. **Hospital A** creates a medicine request
3. Request is broadcasted to all hospitals (A, B, C, D, E)
4. **Hospital B** (having the required medicine) accepts the request
5. **Hospital B** provides their drone API key
6. **Hospital A** receives a tracking ID and can track the delivery
7. **Hospital B** sends location updates using the drone API key
8. **Hospital A** can see real-time drone location on the map

## Setup Instructions

### Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up MySQL database:
```bash
mysql -u root -p < schema.mysql.sql
```

3. Create a `.env` file in the backend directory:
```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=realtime_tracker
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=8h
PORT=3000
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Usage

### 1. Hospital Registration

1. Go to `/register`
2. Fill in hospital details:
   - Hospital Code (e.g., HOSP_A)
   - Hospital Name
   - Email and Password
   - Latitude and Longitude
   - Contact Phone and Address

### 2. Hospital Login

1. Go to `/login`
2. Enter email and password
3. You'll be redirected to the dashboard

### 3. Register a Drone

1. Go to "Register Drone" in the sidebar
2. Enter Drone ID (e.g., DRONE_001)
3. Enter Model (optional)
4. Copy the generated API Key

### 4. Create a Medicine Request

1. Click "New Request" on the homepage
2. Fill in:
   - Medicine name
   - Quantity (kg)
   - Deadline
3. Submit the request

### 5. Accept a Request

1. View available requests on the homepage
2. Click "Accept Request" on a request you can fulfill
3. Enter your drone's API key
4. Confirm acceptance

### 6. Track Delivery

1. If you created a request that was accepted, click "Track Delivery"
2. Or go to the "Track Device" page and enter a drone API key
3. Click "Start Tracking" to begin monitoring the drone
4. View real-time drone location on the map

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new hospital
- `POST /api/auth/login` - Login a hospital

### Drones
- `POST /api/drones` - Register a new drone
- `GET /api/drones` - Get all drones for a hospital

### Requests
- `POST /api/requests` - Create a new medicine request
- `GET /api/requests` - Get all requests
- `POST /api/requests/:requestId/accept` - Accept a request with drone API key

### Tracking
- `GET /api/track/resolve/:trackingId` - Resolve tracking ID to drone ID
- `POST /api/locations` - Send drone location update

## WebSocket Events

- `request-created` - New medicine request created
- `request-accepted` - Request accepted with tracking ID
- `receive-location` - Real-time drone location update

## Demo

Run the demo script to see real-time events:

```bash
node demo.js
```

### Test Drone Tracking

1. Register a drone and get its API key
2. Update the API key in `test-drone.js`
3. Run the drone simulator:

```bash
node test-drone.js
```

4. Open the Track Device page and enter the API key
5. Click "Start Tracking" to see real-time location updates

## Database Schema

The system uses MySQL with the following main tables:
- `hospitals` - Hospital information
- `drones` - Drone information with API keys
- `requests` - Medicine requests
- `locations` - Drone location history
- `latest_locations` - Current drone locations

## Technology Stack

- **Backend**: Node.js, Express, Socket.io, MySQL
- **Frontend**: React, Vite, Tailwind CSS, Leaflet Maps
- **Real-time**: WebSocket connections for live updates
- **Authentication**: JWT tokens
- **Database**: MySQL with connection pooling
