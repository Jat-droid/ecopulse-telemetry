const Telemetry = require('../models/Telemetry');
const Vehicle = require('../models/Vehicle');

// Core Operational Coordinates Matrix (Delhi/NCR Regional Hub Midpoints)
const fleetCoordinates = {
  'EV-TRUCK-01': { lat: 28.6139, lng: 77.2090 }, // Midpoint New Delhi
  'EV-TRUCK-02': { lat: 28.6500, lng: 77.2300 }, // Will rapidly drift out to trigger Geofence
  'EV-TRUCK-03': { lat: 28.5700, lng: 77.3200 }
};

// Virtual Circular Safe Perimeter centered around Connaught Place Hub
const SAFE_ZONE_CENTER = { lat: 28.6139, lng: 77.2090 };
const MAX_RADIUS_KMS = 6.0; // Vehicles drifting further than 6.0 km trigger an instant breach alert

// Haversine formula to calculate exact physical distance between coordinates over Earth's curvature
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

const seedStaticVehicles = async () => {
  const defaults = [
    { vehicleId: 'EV-TRUCK-01', model: 'Aether Hauler v1', maxBatteryCapacityKwh: 120, status: 'Transit' },
    { vehicleId: 'EV-TRUCK-02', model: 'Volt Delivery Pro', maxBatteryCapacityKwh: 85, status: 'Transit' },
    { vehicleId: 'EV-TRUCK-03', model: 'EcoTransit Giant', maxBatteryCapacityKwh: 200, status: 'Charging' }
  ];
  
  for (const v of defaults) {
    await Vehicle.findOneAndUpdate({ vehicleId: v.vehicleId }, v, { upsert: true });
  }
};

const startSimulation = (io) => {
  seedStaticVehicles();
  console.log("🎮 IoT Digital Twin Grid Simulator Active.");

  setInterval(async () => {
    try {
      const ids = Object.keys(fleetCoordinates);
      
      for (const id of ids) {
        // EV-TRUCK-02 drifts outward 10x faster to explicitly demo the live geofence breach alert
        const driftFactor = id === 'EV-TRUCK-02' ? 0.012 : 0.0012;
        fleetCoordinates[id].lat += (Math.random() - 0.4) * driftFactor;
        fleetCoordinates[id].lng += (Math.random() - 0.5) * driftFactor;

        const currentData = await Vehicle.findOne({ vehicleId: id });
        const batteryDelta = Math.random() > 0.7 ? 1 : 0;
        
        let newBattery = 75;
        if (currentData) {
          newBattery = currentData.status === 'Charging' 
            ? Math.min(100, (currentData.batteryPercentage || 50) + 1)
            : Math.max(5, (currentData.batteryPercentage || 75) - batteryDelta);
        }

        // Randomly spike battery temperature for EV-TRUCK-03 to demonstrate thermal warnings
        const baseMaxTemp = id === 'EV-TRUCK-03' ? 49 : 42;
        const mockPacket = {
          timestamp: new Date(),
          vehicleId: id,
          metrics: {
            batteryPercentage: newBattery,
            batteryTempCelsius: Math.floor(Math.random() * (baseMaxTemp - 30) + 30),
            gps: { lat: fleetCoordinates[id].lat, lng: fleetCoordinates[id].lng },
            currentSpeedKmh: currentData?.status === 'Charging' ? 0 : Math.floor(Math.random() * (70 - 35) + 35),
            energyConsumptionKw: currentData?.status === 'Charging' ? -40.0 : +(Math.random() * 14).toFixed(2)
          }
        };

        // Cache the live battery calculation state back onto the vehicle model
        await Vehicle.updateOne({ vehicleId: id }, { $set: { batteryPercentage: newBattery } });

        // 1. Emit live packets down WebSocket pipeline straight to React
        io.emit('telemetry-data', mockPacket);

        // 2. Intelligence Filter A: Real-Time Critical Thermal Safety Checking
        if (mockPacket.metrics.batteryTempCelsius >= 46) {
          io.emit('incident-alert', {
            vehicleId: id,
            type: 'CRITICAL_THERMAL',
            message: `Thermal Emergency! Core array tracking dangerously high at ${mockPacket.metrics.batteryTempCelsius}°C.`,
            timestamp: new Date()
          });
        }

        // 3. Intelligence Filter B: Dynamic Spatial Geofencing Verification
        const distanceFromHub = calculateDistance(
          mockPacket.metrics.gps.lat, 
          mockPacket.metrics.gps.lng,
          SAFE_ZONE_CENTER.lat,
          SAFE_ZONE_CENTER.lng
        );

        if (distanceFromHub > MAX_RADIUS_KMS) {
          io.emit('incident-alert', {
            vehicleId: id,
            type: 'GEOCLUSTER_BREACH',
            message: `Route Discrepancy! Node drifted ${distanceFromHub.toFixed(2)} km outside authorized transit boundary region.`,
            timestamp: new Date()
          });
        }

        // 4. Batch commit packet efficiently to MongoDB Time-Series collection
        await Telemetry.create(mockPacket);
      }
    } catch (err) {
      console.error('Simulation loop anomaly dropped packet:', err);
    }
  }, 3000);
};

module.exports = { startSimulation };