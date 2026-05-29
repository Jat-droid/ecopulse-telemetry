const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. IMPORT ROUTES
const analyticsRoutes = require('./routes/analytics');
const aiRoutes = require('./routes/aiAnalyst');
const authRoutes = require('./routes/auth');           // <--- Added Auth Route
const vehicleRoutes = require('./routes/vehicles');    // <--- Added Vehicle Route
const { startSimulation } = require('./services/iotSimulator');

// 2. INITIALIZE EXPRESS & SERVER
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// 3. MIDDLEWARE CONFIGURATION
app.use(cors());
app.use(express.json());

// 4. ATTACH ROUTERS
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);                      // <--- Wired up Auth
app.use('/api/vehicles', vehicleRoutes);               // <--- Wired up Vehicles

// 5. DATABASE CONNECTIVITY & SIMULATOR BOOTSTRAP
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('⚡ MongoDB Local Server Connection Secured.');
    // Start background IoT loops once database handshake completes
    startSimulation(io);
  })
  .catch(err => console.error('Database connection breakdown:', err));

// 6. SOCKET LIFECYCLE INTERCEPTOR
io.on('connection', (socket) => {
  console.log(`📡 New Enterprise Monitor Terminal Linked: ${socket.id}`);
  socket.on('disconnect', () => console.log('🔌 Terminal Link Dropped'));
});

// 7. LISTEN ON BINDING PORT
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 EcoPulse Core Matrix active on operational port ${PORT}`));