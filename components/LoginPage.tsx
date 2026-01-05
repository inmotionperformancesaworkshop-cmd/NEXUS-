import React, { useState } from 'react';
import { ArcovelLogoIcon, LoadingSpinner } from './CpuIcon';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate auth verification delay
    setTimeout(() => {
      setLoading(false);
      // For demo purposes, we accept any non-empty key
      if (accessKey.trim().length > 0) {
        onLogin();
      } else {
        setError('ACCESS CREDENTIALS REQUIRED');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-arcovel-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-arcovel-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-arcovel-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(11,18,33,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(11,18,33,0.5)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>

      <div className="w-full max-w-md bg-arcovel-900/80 backdrop-blur-xl border border-arcovel-700 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 animate-[fadeIn_0.5s_ease-out]">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
           <div className="relative w-24 h-24 flex items-center justify-center mb-6 group">
              <div className="absolute inset-0 bg-arcovel-500/20 blur-xl rounded-full group-hover:bg-arcovel-500/30 transition-all duration-500"></div>
              <ArcovelLogoIcon className="w-full h-full text-arcovel-500 animate-[spin_10s_linear_infinite]" />
            </div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tight mb-2">
              arcovel <span className="text-arcovel-500">nexus</span>
            </h1>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-arcovel-accent text-xs tracking-[0.3em] uppercase opacity-80 font-mono">
                System Online
              </p>
            </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-arcovel-400 uppercase tracking-widest ml-1">
              Identity Verification
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-arcovel-500/50 to-arcovel-accent/50 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="relative w-full bg-arcovel-950 border border-arcovel-700 rounded-lg px-4 py-4 text-white placeholder-gray-700 font-mono focus:ring-1 focus:ring-arcovel-500 focus:border-arcovel-500 transition-all outline-none text-center tracking-[0.5em] text-lg"
                placeholder="••••••••"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-xs font-mono text-center bg-red-500/5 border border-red-500/20 p-3 rounded animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-arcovel-500 hover:bg-arcovel-400 text-black font-bold font-display tracking-wider py-4 rounded-lg transition-all transform active:scale-[0.98] shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <LoadingSpinner className="w-5 h-5 text-black" />
                <span>VERIFYING CREDENTIALS...</span>
              </>
            ) : (
              <>
                <span>ESTABLISH UPLINK</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-arcovel-800 text-center">
          <p className="text-[10px] text-gray-600 font-mono leading-relaxed">
            SECURE CONNECTION // ENCRYPTED: AES-256
            <br />
            AUTHORIZED PERSONNEL ONLY
          </p>
        </div>
      </div>
    </div>
  );
};
