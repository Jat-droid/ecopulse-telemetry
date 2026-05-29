const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  vehicleId: { type: String, required: true },
  metrics: {
    batteryPercentage: { type: Number, required: true },
    batteryTempCelsius: { type: Number, required: true },
    gps: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    currentSpeedKmh: { type: Number, required: true },
    energyConsumptionKw: { type: Number, required: true }
  }
}, {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'vehicleId',
    granularity: 'seconds'
  }
});

module.exports = mongoose.model('Telemetry', telemetrySchema);