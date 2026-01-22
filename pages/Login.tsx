
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_VERSION } from '../utils/version';
import { LogIn, Lock, Mail, Loader2, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  logoUrl?: string;
}

const Login: React.FC<Props> = ({ logoUrl }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password, rememberMe);

      if (success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 800);
      } else {
        setError('Connection failed. Credentials not recognized in the Book of Records.');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-900 px-4 relative">
      <nav className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center space-x-2 text-white group">
          {logoUrl ? (
            <img src={logoUrl} alt="JCBC" className="h-10 w-auto group-hover:scale-110 transition-transform" />
          ) : (
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform">
              JCBC
            </div>
          )}
          <span className="font-bold text-lg tracking-tight hidden sm:block font-bebas">Jesus Culture Bible Church</span>
        </Link>
        <Link to="/" className="text-white hover:text-blue-200 transition-colors flex items-center space-x-2 font-bold uppercase tracking-widest text-xs font-bebas">
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </nav>

      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl space-y-8 animate-in fade-in zoom-in duration-300 relative overflow-hidden">
        {success && (
          <div className="absolute inset-0 bg-blue-900 z-50 flex flex-col items-center justify-center text-white space-y-4 animate-in fade-in duration-300">
            <CheckCircle2 className="w-16 h-16 text-blue-400 animate-bounce" />
            <h3 className="text-2xl font-bebas tracking-widest">Authority Established</h3>
            <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Redirecting to Command Center...</p>
          </div>
        )}

        <div className="text-center space-y-2">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-20 w-auto mx-auto mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
          ) : (
            <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
          )}
          <h2 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter font-bebas">Command Center Access</h2>
          <p className="text-slate-400 font-medium text-xs uppercase tracking-widest italic">Authorization Required</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 animate-pulse text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Authorized Email"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access Frequency Code"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${rememberMe ? 'bg-blue-900 border-blue-900 text-white' : 'border-slate-300 text-transparent hover:border-blue-900'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 select-none">Remember Credentials</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-900 text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-blue-800 transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-70 font-bebas"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Shield className="w-6 h-6" />}
            <span>{loading ? 'Validating Key...' : 'Establish Secure Connection'}</span>
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-500 font-black uppercase tracking-widest border-t border-slate-100 pt-6">
          New to the Remnant? <Link to="/register" className="text-blue-900 font-bold hover:underline">Create New Account</Link>
        </div>
      </div>

      <p className="mt-8 text-white/40 text-[8px] font-black uppercase tracking-[0.4em] italic">Prophetic Portal v{APP_VERSION} Secure</p>
    </div>
  );
};

export default Login;
