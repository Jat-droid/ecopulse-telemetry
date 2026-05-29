const express = require('express');
const Vehicle = require('../models/Vehicle');
const router = express.Router();

// GET all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new vehicle
router.post('/', async (req, res) => {
  try {
    const newVehicle = await Vehicle.create(req.body);
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a vehicle
router.delete('/:id', async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle decommissioned." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;