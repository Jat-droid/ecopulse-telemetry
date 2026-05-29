const express = require('express');
const router = express.Router();
const Telemetry = require('../models/Telemetry');
const Vehicle = require('../models/Vehicle');

// Helper function simulating variable utility grid costs (INR/kWh) based on peak hours
const getSimulatedGridTariff = (hour) => {
  if (hour >= 18 && hour <= 22) return 12.50; // Peak Evening Demand
  if (hour >= 0 && hour <= 6) return 4.20;    // Green Energy Surplus Night Window
  return 7.80;                                // Standard Utility Load Rate
};

// 1. GET: Comprehensive Predictive Analytics Optimization Window
router.get('/smart-charge-schedule', async (req, res) => {
  try {
    const currentHour = new Date().getHours();
    const scheduleRecommendations = [];

    for (let i = 0; i < 24; i++) {
      const targetHour = (currentHour + i) % 24;
      const rate = getSimulatedGridTariff(targetHour);
      
      scheduleRecommendations.push({
        hour: `${targetHour}:00`,
        tariffCostPerKwh: rate,
        optimizationStatus: rate <= 5.00 ? 'OPTIMAL_GREEN_WINDOW' : rate >= 11.00 ? 'AVOID_PEAK_SURGE' : 'STANDARD'
      });
    }
    res.json(scheduleRecommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET: High-Performance Aggregation of Historical Telemetry Insights
router.get('/historical-efficiency/:vehicleId', async (req, res) => {
  const { vehicleId } = req.params;
  try {
    const metricsAggregation = await Telemetry.aggregate([
      { $match: { vehicleId: vehicleId } },
      {
        $group: {
          _id: {
            hour: { $hour: "$timestamp" }
          },
          averageEnergyLoad: { $avg: "$metrics.energyConsumptionKw" },
          peakObservedTemp: { $max: "$metrics.batteryTempCelsius" }
        }
      },
      { $sort: { "_id.hour": 1 } },
      { $limit: 12 }
    ]);
    res.json(metricsAggregation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;