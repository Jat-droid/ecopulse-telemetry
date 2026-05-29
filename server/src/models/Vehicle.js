const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true, index: true },
  model: { type: String, required: true },
  maxBatteryCapacityKwh: { type: Number, required: true },
  status: { type: String, enum: ['Transit', 'Charging', 'Idle', 'Maintenance'], default: 'Idle' },
  assignedRoute: { type: String, default: 'Unassigned' }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);