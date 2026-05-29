import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
  Zap, ShieldAlert, Cpu, Radio, TrendingUp, Bot, 
  Battery, Thermometer, Activity, Navigation 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [vehicles, setVehicles] = useState({
    'EV-TRUCK-01': { model: 'Aether Hauler v1', battery: 85, temp: 36, load: 4.5, status: 'Transit' },
    'EV-TRUCK-02': { model: 'Volt Delivery Pro', battery: 62, temp: 38, load: 3.2, status: 'Transit' },
    'EV-TRUCK-03': { model: 'EcoTransit Giant', battery: 19, temp: 42, load: -40, status: 'Charging' },
  });

  const [incidents, setIncidents] = useState([]);
  const [analyticsData] = useState([
    { time: '00:00', price: 4.2 }, { time: '04:00', price: 3.8 },
    { time: '08:00', price: 5.1 }, { time: '12:00', price: 6.8 },
    { time: '16:00', price: 6.2 }, { time: '20:00', price: 4.9 },
  ]);

  const [aiReport, setAiReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    
    socket.on('telemetry-data', (data) => {
      setVehicles((prev) => ({
        ...prev,
        [data.vehicleId]: {
          ...prev[data.vehicleId],
          battery: data.metrics.batteryPercentage,
          temp: data.metrics.batteryTempCelsius,
          load: data.metrics.energyConsumptionKw,
        }
      }));
    });

    socket.on('incident-alert', (alert) => {
      setIncidents((prev) => {
        const duplicateExists = prev.some(inc => inc.type === alert.type && inc.vehicleId === alert.vehicleId);
        if (duplicateExists) return prev;
        return [
          {
            id: Date.now(), vehicleId: alert.vehicleId, type: alert.type,
            message: alert.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          },
          ...prev
        ].slice(0, 8); 
      });
    });

    return () => socket.disconnect();
  }, []);

  const generateAiInsights = async () => {
    setIsGenerating(true);
    try {
      const res = await axios.get(`${SOCKET_SERVER_URL}/api/ai/generate-report`);
      setAiReport(res.data.report);
    } catch (err) {
      setAiReport("Inference engine link fault. Verify backend connection state.");
    }
    setIsGenerating(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto text-slate-50 selection:bg-indigo-500 selection:text-white">
      
      {/* Responsive Header: Stacks on mobile, side-by-side on desktop */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="text-indigo-400 animate-pulse" size={22} />
            <h1 className="text-lg md:text-xl font-black tracking-wider uppercase font-mono bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
              EcoPulse // Telemetry Matrix
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono tracking-widest hidden sm:block">REAL-TIME TIME-SERIES LOAD COEFFICIENT DISPATCHER</p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900/40 border border-slate-900 px-4 py-2 rounded-xl w-full md:w-auto">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[10px] md:text-xs font-mono font-bold tracking-wide text-emerald-400 uppercase">IoT Core: Sync Active</span>
        </div>
      </header>

      {/* Main Grid: 1 column mobile, 3 columns desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Side: Trucks & Chart (Takes 2 columns on desktop) */}
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Radio size={14} className="text-slate-500" /> Managed Transportation Nodes
          </h2>
          
          {/* Truck Cards: 1 col mobile, 2 cols tablet+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {Object.entries(vehicles).map(([id, data]) => (
              <div key={id} className="bg-slate-900/40 rounded-2xl border border-slate-900 p-4 lg:p-5 hover:border-slate-800 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-mono font-bold text-slate-200 group-hover:text-indigo-400 transition-colors text-sm lg:text-base tracking-wide">{id}</h3>
                    <p className="text-[10px] lg:text-xs text-slate-500 font-mono">{data.model}</p>
                  </div>
                  <span className={`text-[10px] lg:text-[11px] font-mono px-2 py-0.5 rounded border font-semibold ${
                    data.status === 'Charging' 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {data.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] lg:text-xs font-mono mb-1.5 text-slate-400">
                      <span className="flex items-center gap-1"><Battery size={12} /> Charge State</span>
                      <span className="font-bold text-slate-200">{data.battery}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-900">
                      <div className={`h-full rounded-full transition-all duration-500 ${data.battery < 25 ? 'bg-rose-500' : data.battery < 50 ? 'bg-amber-500' : 'bg-emerald-400'}`} style={{ width: `${data.battery}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 lg:gap-4 pt-3 border-t border-slate-900/60 text-[10px] lg:text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block mb-0.5 flex items-center gap-1"><Thermometer size={12} /> Core</span>
                      <span className={`font-bold ${data.temp >= 45 ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>{data.temp}°C</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5 flex items-center gap-1"><Zap size={12} /> Grid</span>
                      <span className="font-bold text-slate-300">{data.load} kW</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fixed Height Chart Container for Mobile Safety */}
          <div className="pt-2 lg:pt-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-indigo-400" /> Utility Peak-Load Graph
            </h2>
            <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-3 lg:p-5 w-full">
              {/* STRICT HEIGHT WRAPPER */}
              <div className="h-[200px] sm:h-[250px] md:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                    <YAxis stroke="#475569" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Incidents & AI (Stacks below on mobile) */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
              <ShieldAlert size={14} className="text-rose-400" /> Safety Exception Logs
            </h2>
            <div className="bg-slate-900/40 rounded-2xl border border-slate-900 p-4 h-[250px] overflow-y-auto space-y-3">
              {incidents.length === 0 ? (
                <p className="text-slate-600 text-[10px] lg:text-xs font-mono text-center py-6 italic">Zero violations flagged.</p>
              ) : (
                incidents.map((incident) => (
                  <div key={incident.id} className={`border rounded-xl p-3 flex items-start gap-3 animate-fadeIn ${incident.type === 'GEOCLUSTER_BREACH' ? 'bg-amber-500/5 border-amber-500/10' : 'bg-rose-500/5 border-rose-500/10'}`}>
                    {incident.type === 'GEOCLUSTER_BREACH' ? <Navigation size={14} className="text-amber-400 mt-0.5 shrink-0 rotate-45" /> : <ShieldAlert size={14} className="text-rose-400 mt-0.5 shrink-0" />}
                    <div className="font-mono text-[10px] lg:text-[11px] w-full">
                      <div className="flex justify-between font-bold">
                        <span className={incident.type === 'GEOCLUSTER_BREACH' ? "text-amber-400" : "text-rose-400"}>{incident.vehicleId}</span>
                        <span className="text-slate-500 font-normal text-[9px]">{incident.timestamp}</span>
                      </div>
                      <p className="text-slate-400 mt-1">{incident.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Bot size={14} className="text-indigo-400" /> Groq AI Analyst
              </h2>
              <button onClick={generateAiInsights} disabled={isGenerating} className="text-[9px] lg:text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 transition-all disabled:opacity-40">
                {isGenerating ? "Compiling..." : "Run AI Check"}
              </button>
            </div>
            <div className="bg-slate-900/40 rounded-2xl border border-slate-900 p-4 lg:p-5 h-[250px] relative overflow-y-auto">
              {!aiReport && !isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <Activity size={20} className="text-slate-800 mb-1.5" />
                  <p className="text-slate-600 text-[10px] font-mono italic">Awaiting initiation of real-time diagnostic.</p>
                </div>
              )}
              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              {aiReport && !isGenerating && <div className="text-[10px] lg:text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed animate-fadeIn">{aiReport}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}