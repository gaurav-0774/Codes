import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, ShieldCheck, User as UserIcon, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        if (res.data.data.user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/products');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const autofillAdmin = () => {
    setEmail('admin@pricepilot.com');
    setPassword('Admin@123');
  };

  const autofillUser = () => {
    setEmail('user@pricepilot.com');
    setPassword('User@123');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-12 px-4">
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6">
        {/* Brand Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              PRICE<span className="text-brand-500">PILOT</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Log in to manage wishlists, submit reviews, or open Admin panel.</p>
        </div>

        {/* Demo Quick Autofill Buttons */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
          <div className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider text-center">Quick Demo Autofill</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={autofillAdmin}
              className="py-1.5 px-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[11px] font-semibold hover:bg-purple-500/20 transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Account</span>
            </button>
            <button
              type="button"
              onClick={autofillUser}
              className="py-1.5 px-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/30 text-[11px] font-semibold hover:bg-brand-500/20 transition-colors flex items-center justify-center gap-1"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Demo User</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20"
          >
            <span>{loading ? 'Logging in...' : 'Log In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
