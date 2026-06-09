'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Cpu, Mail, Lock, User, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const { register, isAuthenticated, error: authError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(name, email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message || 'Registration failed. Check network link.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-cyber-cyan/5 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyber-purple/5 filter blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glassmorphism rounded-2xl border border-cyber-cyan/15 p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-20 h-20 bg-cyber-cyan/5 rounded-bl-full pointer-events-none" />
        
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyber-cyan to-cyber-purple flex items-center justify-center shadow-[0_0_10px_rgba(0,242,254,0.2)] mb-2">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold font-mono tracking-wider uppercase text-white">Register Node</h2>
          <p className="text-xs text-gray-500 font-mono">Create new credentials to plug into the matrix.</p>
        </div>

        {/* Errors */}
        {(error || authError) && (
          <div className="mb-6 p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-xs font-mono text-red-400 leading-normal flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>{error || authError}</div>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">
              Identity Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-600">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-cyan/60 transition-colors font-mono"
                placeholder="Identity Label"
              />
            </div>
          </div>

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
            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">
              Synaptic Key (Min 6 Characters)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-600">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                minLength={6}
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
              'Initialize Synapse'
            )}
          </button>
        </form>

        {/* Redirect Link */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Already synced?{' '}
          <Link href="/auth/login" className="text-cyber-cyan hover:text-white transition-colors font-mono">
            Access Core
          </Link>
        </p>
      </div>
    </div>
  );
}
