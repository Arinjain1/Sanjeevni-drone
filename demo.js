// Demo script to test the hospital medicine request system
const io = require('socket.io-client');

// Connect to the server
const socket = io('http://localhost:3000');

console.log('🚁 Hospital Medicine Request System Demo');
console.log('=====================================');

// Listen for new requests
socket.on('request-created', (request) => {
  console.log('\n📦 New Medicine Request Received:');
  console.log(`   Medicine: ${request.medicine}`);
  console.log(`   Quantity: ${request.quantity} kg`);
  console.log(`   Requested by: ${request.requester_hospital_name}`);
  console.log(`   Request ID: ${request.request_id}`);
  console.log(`   Status: ${request.status}`);
});

// Listen for request acceptance
socket.on('request-accepted', (data) => {
  console.log('\n✅ Request Accepted:');
  console.log(`   Request ID: ${data.request_id}`);
  console.log(`   Tracking ID: ${data.tracking_id}`);
  console.log(`   Assigned Drone: ${data.assigned_drone_id}`);
});

// Listen for location updates
socket.on('receive-location', (location) => {
  console.log('\n📍 Drone Location Update:');
  console.log(`   Drone ID: ${location.drone_id}`);
  console.log(`   Location: ${location.latitude}, ${location.longitude}`);
  console.log(`   Speed: ${location.speed || 'N/A'} km/h`);
  console.log(`   Accuracy: ${location.accuracy || 'N/A'} meters`);
  console.log(`   Timestamp: ${new Date(location.ts).toLocaleString()}`);
});

socket.on('connect', () => {
  console.log('✅ Connected to server');
  console.log('Waiting for requests and location updates...\n');
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

// Keep the script running
process.on('SIGINT', () => {
  console.log('\n👋 Demo ended');
  socket.disconnect();
  process.exit(0);
});
