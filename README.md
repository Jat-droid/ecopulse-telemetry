# ⚡ EcoPulse // Telemetry Matrix

> **Enterprise-Grade IoT Digital Twin & Autonomous Fleet Logistics SaaS**

EcoPulse is a full-stack, real-time IoT dashboard built on the MERN stack. It simulates an active electric vehicle (EV) fleet network, utilizing WebSockets for high-frequency data streaming, Geospatial indexing for dynamic geofencing, and Ultra-Low Latency Generative AI for real-time fleet diagnostics.

---

## 🚀 Core Features

* **📡 Real-Time IoT Digital Twin Simulator:** A Node.js background engine mathematically generates and streams live GPS, thermal, and battery load data to the React client via Socket.io every 3 seconds.
* **🧠 AI Fleet Analyst (Groq Llama 3.3):** Integrates the Groq API to run ultra-fast contextual analysis on time-series MongoDB data, generating executive action reports on thermal warnings and efficiency drops.
* **🗺️ Dynamic Spatial Geofencing:** Utilizes the Haversine formula and React-Leaflet to draw a 6.0km operational perimeter around a central hub. Vehicles drifting outside the bounds trigger instant WebSocket security alerts.
* **🔐 Role-Based Access Control (RBAC):** Secure entry gateway utilizing JSON Web Tokens (JWT) and Bcrypt password hashing, featuring persistent sessions and cipher resets.
* **📊 Time-Series Analytics & Export:** Visualizes simulated historical energy draw using Recharts, with a custom JavaScript blob-generator to export data to CSV for boardroom reporting.
* **🗄️ Full CRUD Fleet Asset Registry:** Direct MongoDB integration to provision (add) and decommission (delete) active fleet nodes directly from the UI.

---

## 🛠️ Technology Stack

**Frontend Framework:**
* React.js (Vite)
* Tailwind CSS (Custom Dark Mode UI)
* React Router v6 (Protected Routes)
* Recharts (Data Visualization)
* React-Leaflet (Spatial Mapping)
* Lucide React (Iconography)

**Backend Architecture:**
* Node.js & Express.js
* MongoDB & Mongoose (Time-Series Data & Asset Registry)
* Socket.io (Bi-directional Event Pipeline)
* JSON Web Tokens (JWT) & Bcryptjs (Security)
* Groq SDK (AI Inference Engine)

---

## 💻 Installation & Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16+)
* [MongoDB Compass](https://www.mongodb.com/products/compass) (or an active Atlas Cluster)
* A free API key from [Groq Cloud](https://console.groq.com/)

### 2. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/ecopulse-telemetry.git](https://github.com/YOUR_USERNAME/ecopulse-telemetry.git)
cd ecopulse-telemetry

### 3. Environment Configuration
Create a .env file in the /server directory and add the following variables:

Code snippet
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecopulse
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=your_super_secret_jwt_signature_key

### 4. Install Dependencies
Open two terminals.

Terminal 1 (Backend):

Bash
cd server
npm install
npm run dev

Terminal 2 (Frontend):

Bash
cd client
npm install
npm run dev

### 🎮 Usage Guide
Access the Portal: Navigate to http://localhost:5173.

System Boot: The backend will automatically seed a default admin user if the database is empty.

Email: admin@ecopulse.com

Password: admin123

Monitor the Stream: Watch the dashboard as simulated nodes push live thermal and battery data. Wait ~20 seconds to see EV-TRUCK-02 breach the Geofence.

Run AI Diagnostics: Click "Run AI Check" in the bottom right panel to send the last 100 MongoDB records to the Llama 3.3 model for contextual analysis.

Manage Fleet: Navigate to "Fleet Management" to dynamically provision new nodes into the live database.

Designed & Engineered by VIRAT SIROHI