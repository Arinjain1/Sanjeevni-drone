// Test script to simulate drone location updates
const fetch = require('node-fetch');

// Replace with an actual API key from your registered drone
const API_KEY = 'your-drone-api-key-here';
const BASE_URL = 'http://localhost:3000';

// Simulate drone movement
let latitude = 22.7196; // Starting latitude (Indore)
let longitude = 75.8577; // Starting longitude (Indore)
let heading = 0;

const sendLocationUpdate = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: API_KEY,
        latitude: latitude,
        longitude: longitude,
        accuracy: 5.0,
        speed: 15.0,
        heading: heading
      })
    });

    const data = await response.json();
    if (data.ok) {
      console.log(`📍 Location sent: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (Heading: ${heading}°)`);
    } else {
      console.error('❌ Error sending location:', data.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

// Simulate drone movement in a circular pattern
const simulateMovement = () => {
  const radius = 0.01; // ~1km radius
  const centerLat = 22.7196;
  const centerLng = 75.8577;
  
  // Move in a circle
  heading += 10; // Rotate 10 degrees each update
  if (heading >= 360) heading = 0;
  
  const radians = (heading * Math.PI) / 180;
  latitude = centerLat + radius * Math.cos(radians);
  longitude = centerLng + radius * Math.sin(radians);
  
  sendLocationUpdate();
};

console.log('🚁 Drone Location Simulator');
console.log('==========================');
console.log(`API Key: ${API_KEY}`);
console.log('Starting location updates every 3 seconds...');
console.log('Press Ctrl+C to stop\n');

// Send initial location
sendLocationUpdate();

// Send location updates every 3 seconds
const interval = setInterval(simulateMovement, 3000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping drone simulator');
  clearInterval(interval);
  process.exit(0);
});
