import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Lock, Mail, ArrowLeft, RefreshCw } from 'lucide-react';

export default function Login() {
  // Mode switcher: 'login' or 'forgot' or 'resetSuccess'
  const [mode, setMode] = useState('login');
  
  // Form input states (initialized clean and empty)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password
      });

      // Securely store credentials across page reloads
      localStorage.setItem('ecopulse_token', res.data.token);
      localStorage.setItem('ecopulse_user', JSON.stringify(res.data.user));
      
      // Force immediate redirect to the authenticated frame
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication link broken. Check backend services.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      // Connects to your backend authorization routes
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        newPassword
      });
      
      setSuccess('Cipher successfully modified. Proceed to login.');
      setMode('resetSuccess');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update system password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-emerald-500 selection:text-white font-sans">
      
      {/* Brand Header */}
      <div className="mb-10 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
          <Zap className="text-emerald-400" size={32} />
        </div>
        <h1 className="text-2xl font-black tracking-widest text-slate-200 uppercase font-mono">EcoPulse Systems</h1>
        <p className="text-xs text-slate-500 font-mono mt-2 tracking-widest uppercase">Authorized Personnel Only</p>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
        
        {/* VIEW 1: STANDARD LOGIN PORTAL */}
        {mode === 'login' && (
          <>
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
              <Shield className="text-indigo-400" size={20} />
              <h2 className="text-sm font-bold text-slate-300 font-mono uppercase tracking-widest">Secure Gateway</h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-mono text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 ml-1">Operator Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors font-mono"
                    placeholder="Enter assigned email"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">Access Cipher</label>
                  <button 
                    type="button" 
                    onClick={() => { setMode('forgot'); setError(''); }}
                    className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 uppercase tracking-widest cursor-pointer transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors font-mono"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 py-3.5 rounded-xl font-mono text-sm font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 raw-button cursor-pointer"
              >
                {isLoading ? "Authenticating..." : "Initialize Link"}
              </button>
            </form>
          </>
        )}

        {/* VIEW 2: PASSWORD RECOVERY ALTERATION */}
        {mode === 'forgot' && (
          <>
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
              <RefreshCw className="text-amber-400" size={20} />
              <h2 className="text-sm font-bold text-slate-300 font-mono uppercase tracking-widest">Reset Cipher Matrix</h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-mono text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 ml-1">Account Target Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors font-mono"
                    placeholder="Verify account email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 ml-1">New Secure Cipher</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors font-mono"
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 ml-1">Confirm New Cipher</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors font-mono"
                    placeholder="Re-enter new password"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-amber-500/10 text-amber-400 border border-amber-500/30 py-3.5 rounded-xl font-mono text-sm font-bold uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "Rewriting Cipher..." : "Commit New Cipher"}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => { setMode('login'); setError(''); }}
                  className="w-full bg-transparent text-slate-500 hover:text-slate-400 py-2 rounded-xl font-mono text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={12} /> Return to Gateway
                </button>
              </div>
            </form>
          </>
        )}

        {/* VIEW 3: SUCCESS BLOCK */}
        {mode === 'resetSuccess' && (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              ✓
            </div>
            <h3 className="text-slate-200 font-mono font-bold uppercase text-sm tracking-widest mb-2">Matrix Updated</h3>
            <p className="text-slate-400 text-xs mb-6 font-mono">{success}</p>
            <button 
              onClick={() => setMode('login')}
              className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-widest hover:bg-indigo-500/20 transition-all cursor-pointer"
            >
              Access Gateway Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
}