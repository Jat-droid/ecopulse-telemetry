const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Telemetry = require('../models/Telemetry');

// Initialize Groq Client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.get('/generate-report', async (req, res) => {
  try {
    // 1. Gather context from the database
    const recentData = await Telemetry.find()
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();

    // 2. Format data for the AI to understand
    const fleetSummary = recentData.map(d => 
      `Vehicle: ${d.vehicleId} | Battery: ${d.metrics.batteryPercentage}% | Temp: ${d.metrics.batteryTempCelsius}C | Load: ${d.metrics.energyConsumptionKw}kW`
    ).join('\n');

    const prompt = `
      You are the Chief Fleet Operations AI for EcoPulse Logistics. 
      Analyze the following raw telemetry data from our EV fleet.
      
      Look for:
      1. Vehicles that are draining too fast or running too hot (Over 44C is a warning, 46C is critical).
      2. General fleet efficiency.
      
      Respond with a short, professional, 3-bullet-point executive summary and actionable recommendations. Keep it concise.
      
      Raw Data:
      ${fleetSummary}
    `;

    // 3. Send to Groq (Using Llama 3.3 70B for high-speed logic)
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 500,
    });

    // 4. Extract and send the response
    const aiResponseText = chatCompletion.choices[0]?.message?.content || "No insights generated.";
    
    res.json({ report: aiResponseText });

  } catch (error) {
    console.error("Groq Engine Error:", error);
    res.status(500).json({ error: "Groq Inference Engine Offline" });
  }
});

module.exports = router;