import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

export default function FleetManager() {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({ vehicleId: '', model: '', maxBatteryCapacityKwh: 100 });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/vehicles`);
      setVehicles(res.data);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/vehicles`, newVehicle);
      fetchVehicles();
      setNewVehicle({ vehicleId: '', model: '', maxBatteryCapacityKwh: 100 });
    } catch (err) {
      console.error("Failed to add vehicle:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
 await axios.delete(`${import.meta.env.VITE_API_URL}/api/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      console.error("Failed to delete vehicle:", err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-200 mb-6 font-mono uppercase tracking-widest">Fleet Asset Registry</h1>
      
      {/* Add New Truck Form */}
      <form onSubmit={handleAdd} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 flex flex-wrap gap-4 mb-8 items-end shadow-xl">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Asset ID</label>
          <input 
            placeholder="e.g., EV-TRUCK-04" 
            value={newVehicle.vehicleId} 
            onChange={e => setNewVehicle({...newVehicle, vehicleId: e.target.value})}
            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 font-mono" required
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Hardware Model</label>
          <input 
            placeholder="e.g., CyberTruck Freight" 
            value={newVehicle.model} 
            onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 font-mono" required
          />
        </div>
        <button type="submit" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-emerald-500/20 transition-all font-mono text-sm font-bold h-[46px]">
          <Plus size={16} /> Provision Node
        </button>
      </form>

      {/* Database Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-950/50 text-xs uppercase font-mono text-slate-500 border-b border-slate-800 tracking-widest">
            <tr>
              <th className="p-5 font-bold">Asset ID</th>
              <th className="p-5 font-bold">Hardware Model</th>
              <th className="p-5 font-bold">Capacity</th>
              <th className="p-5 font-bold">Status</th>
              <th className="p-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {vehicles.map(v => (
              <tr key={v._id} className="hover:bg-slate-800/20 transition-colors">
                <td className="p-5 font-bold text-slate-200">{v.vehicleId}</td>
                <td className="p-5 font-mono text-slate-300">{v.model}</td>
                <td className="p-5 font-mono text-slate-300">{v.maxBatteryCapacityKwh} kWh</td>
                <td className="p-5">
                  <span className={`px-2.5 py-1 rounded text-[11px] font-mono border font-semibold ${
                    v.status === 'Charging' 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {v.status}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <button onClick={() => handleDelete(v._id)} className="text-slate-500 hover:text-rose-400 transition-colors p-2 hover:bg-rose-500/10 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}