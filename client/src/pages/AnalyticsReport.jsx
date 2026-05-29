import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, Calendar } from 'lucide-react';

export default function AnalyticsReports() {
  const weeklyEfficiency = [
    { day: 'Mon', consumption: 420, avgTemp: 38 },
    { day: 'Tue', consumption: 380, avgTemp: 39 },
    { day: 'Wed', consumption: 510, avgTemp: 42 },
    { day: 'Thu', consumption: 450, avgTemp: 40 },
    { day: 'Fri', consumption: 490, avgTemp: 41 },
    { day: 'Sat', consumption: 310, avgTemp: 37 },
    { day: 'Sun', consumption: 290, avgTemp: 36 },
  ];

  const exportToCSV = () => {
    const headers = ['Day', 'Energy Consumption (kW)', 'Average Temp (C)'];
    const csvRows = weeklyEfficiency.map(row => `${row.day},${row.consumption},${row.avgTemp}`);
    const csvString = [headers.join(','), ...csvRows].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'EcoPulse_Weekly_Report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto font-sans text-slate-50">
      
      {/* Responsive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-200 font-mono uppercase tracking-widest">Historical Analytics</h1>
          <p className="text-slate-500 text-[10px] md:text-xs mt-1 font-mono">7-DAY FLEET PERFORMANCE AGGREGATION</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none justify-center items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-700 text-slate-300 px-4 py-2.5 md:py-2 rounded-lg hover:bg-slate-800 transition-colors flex">
            <Calendar size={14} /> Last 7 Days
          </button>
          <button onClick={exportToCSV} className="flex-1 md:flex-none justify-center items-center gap-2 text-xs font-mono bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-2.5 md:py-2 rounded-lg hover:bg-indigo-500/20 transition-colors cursor-pointer flex">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Main Grid: Stacks on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1 */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl w-full">
          <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 md:mb-6">Total Energy Draw (kW)</h2>
          {/* STRICT HEIGHT WRAPPER */}
          <div className="h-[250px] md:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyEfficiency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <YAxis stroke="#475569" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                <Bar dataKey="consumption" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl w-full">
          <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 md:mb-6">Average Battery Core Temp (°C)</h2>
          {/* STRICT HEIGHT WRAPPER */}
          <div className="h-[250px] md:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyEfficiency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <YAxis stroke="#475569" domain={[30, 50]} style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="avgTemp" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}