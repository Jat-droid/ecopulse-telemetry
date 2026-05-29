import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Truck, BarChart2, Map, LogOut, Menu, X, Zap } from 'lucide-react';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('ecopulse_token');
    localStorage.removeItem('ecopulse_user');
    navigate('/login', { replace: true });
  };

  const navLinks = [
    { path: '/', icon: Activity, label: 'Matrix Dashboard' },
    { path: '/fleet', icon: Truck, label: 'Fleet Management' },
    { path: '/reports', icon: BarChart2, label: 'Analytics Reports' },
    { path: '/geofence', icon: Map, label: 'Spatial Geofencing' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 font-sans overflow-hidden">
      
      {/* Mobile Top Header (Only visible on screens smaller than 'md') */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-slate-950/90 border-b border-slate-900 flex items-center justify-between px-4 z-50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Zap className="text-emerald-400" size={20} />
          <h2 className="text-lg font-black text-slate-200 font-mono tracking-widest">ECOPULSE</h2>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-400 hover:text-emerald-400 transition-colors p-2"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      {/* On mobile: fixed overlay. On desktop: static left column. */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 border-r border-slate-900 bg-slate-950 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 pt-16' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:block p-6 border-b border-slate-900">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="text-emerald-400" size={24} />
            <h2 className="text-xl font-black text-slate-200 font-mono tracking-widest">ECOPULSE</h2>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link 
                key={link.path}
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click for mobile
                className={`flex items-center gap-3 p-3 rounded-xl transition-all font-mono text-sm tracking-wide ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon size={18} className={isActive ? "text-emerald-400" : "text-slate-500"} /> 
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-900">
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-400/80 hover:text-rose-400 border border-rose-500/10 hover:border-rose-500/30 transition-all font-mono text-xs uppercase tracking-widest"
          >
            <LogOut size={16} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Page Content Area */}
      {/* Add top padding on mobile to account for the new header */}
      <main className="flex-1 overflow-y-auto bg-slate-950 pt-16 md:pt-0 relative">
        <Outlet />
      </main>

      {/* Mobile Overlay Background (Darkens the main content when menu is open) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}