
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { UserPlus, Mail, Lock, User as UserIcon, Loader2, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
  logoUrl?: string;
}

const Register: React.FC<Props> = ({ onLogin, logoUrl }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [goodStanding, setGoodStanding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!goodStanding) {
      setError('Access Denied: You must affirm your standing as a member to create an account.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: name || email.split('@')[0],
        role: 'member',
        isOptedInChat: false,
        isEnrolled: false
      };
      
      const allUsers = JSON.parse(localStorage.getItem('jcbc_all_users') || '[]');
      allUsers.push(newUser);
      localStorage.setItem('jcbc_all_users', JSON.stringify(allUsers));
      
      onLogin(newUser);
      navigate('/');
      setLoading(false);
    }, 1200);
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
          <span>Home</span>
        </Link>
      </nav>

      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-2">
          {logoUrl ? (
             <img src={logoUrl} alt="Logo" className="h-20 w-auto mx-auto mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
          ) : null}
          <h2 className="text-4xl font-black text-blue-900 uppercase italic tracking-tighter font-bebas">Join the Remnant</h2>
          <p className="text-slate-400 font-medium text-xs uppercase tracking-widest">Create Your Ecclesiastical Profile</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center space-x-3 text-red-600 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-widest">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Kingdom Name"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ecclesiastical Email"
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
                placeholder="Secure Access Key (min. 8 chars)"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-3">
             <div className="flex items-start space-x-3 cursor-pointer" onClick={() => setGoodStanding(!goodStanding)}>
               <div className={`w-5 h-5 mt-0.5 rounded-md border flex-shrink-0 flex items-center justify-center transition-colors ${goodStanding ? 'bg-blue-900 border-blue-900 text-white' : 'bg-white border-blue-200 text-transparent hover:border-blue-900'}`}>
                 <CheckCircle2 className="w-3.5 h-3.5" />
               </div>
               <div className="space-y-1">
                 <p className="text-xs font-bold text-blue-900 leading-tight">I affirm I am a member in good standing.</p>
                 <p className="text-[9px] font-medium text-blue-900/60 leading-tight">Access requires verification.</p>
               </div>
             </div>
             <p className="text-[8px] font-black uppercase tracking-widest text-red-400 pt-1 border-t border-blue-100">
               Notice: Anonymous accounts will be deleted.
             </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-900 text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-blue-800 transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-70 font-bebas"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UserPlus className="w-6 h-6" />}
            <span>{loading ? 'Initializing Protocol...' : 'Activate Membership'}</span>
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-500 font-black uppercase tracking-widest pt-6 border-t border-slate-100">
          Already a Member? <Link to="/login" className="text-blue-900 font-bold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
