'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Cpu, Mail, Lock, ShieldCheck, Globe } from 'lucide-react';

export default function LoginPage() {
  const { login, googleLogin, isAuthenticated, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message || 'Authentication failed. Please verify credentials.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    // Simulate a Google profile payload
    const mockGoogleProfile = {
      name: 'Google Sync Node',
      email: 'node.sync@gmail.com',
      googleId: 'g_' + Math.random().toString(36).substr(2, 9),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80'
    };

    const result = await googleLogin(mockGoogleProfile);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message || 'Google Auth simulation failed.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-cyber-cyan/5 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyber-purple/5 filter blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glassmorphism rounded-2xl border border-cyber-cyan/15 p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-20 h-20 bg-cyber-cyan/5 rounded-bl-full pointer-events-none" />
        
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyber-cyan to-cyber-purple flex items-center justify-center shadow-[0_0_10px_rgba(0,242,254,0.2)] mb-2">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold font-mono tracking-wider uppercase text-white">Access Core Grid</h2>
          <p className="text-xs text-gray-500 font-mono">Synchronize credentials to authenticate credentials.</p>
        </div>

        {/* Errors */}
        {(error || authError) && (
          <div className="mb-6 p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-xs font-mono text-red-400 leading-normal flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>{error || authError}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">
              Grid Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-600">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-cyan/60 transition-colors font-mono"
                placeholder="coordinates@email.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400">
                Synaptic Key
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[10px] font-mono text-cyber-cyan hover:text-white transition-colors"
              >
                Restore Key?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-600">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-cyan/60 transition-colors font-mono"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-mono text-white bg-gradient-to-r from-cyber-cyan to-cyber-purple border border-cyber-cyan/40 hover:border-cyber-cyan shadow-[0_0_15px_rgba(0,242,254,0.15)] hover:shadow-[0_0_25px_rgba(0,242,254,0.3)] transition-all cursor-pointer flex items-center justify-center"
          >
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
            ) : (
              'Link Core Node'
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <span className="relative bg-[#08041c] px-3 text-[10px] font-mono text-gray-600 uppercase">
            OR SYNAPSE
          </span>
        </div>

        {/* Google OAuth Simulation Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-lg text-sm font-mono text-gray-300 hover:text-white border border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Globe className="w-4 h-4 text-cyber-cyan" />
          Sync Google Matrix
        </button>

        {/* Redirect Link */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Unregistered node?{' '}
          <Link href="/auth/signup" className="text-cyber-cyan hover:text-white transition-colors font-mono">
            Register Synapse
          </Link>
        </p>

        {/* Developer Sandbox Instructions */}
        <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-gray-500 leading-relaxed text-center">
          🔑 Sandbox Access Credentials:<br />
          Admin Role: <span className="text-cyber-cyan">admin@novasphere.ai</span> / <span className="text-cyber-cyan">adminpassword</span><br />
          User Role: <span className="text-cyber-purple">user@novasphere.ai</span> / <span className="text-cyber-purple">userpassword</span>
        </div>
      </div>
    </div>
  );
}
