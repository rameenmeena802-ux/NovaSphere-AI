'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import {
  Cpu,
  Activity,
  HardDrive,
  Network,
  Bell,
  RefreshCw,
  Send,
  Lock,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const { notifications, emitMockNotification } = useSocket();
  const router = useRouter();

  const [systemStats, setSystemStats] = useState({
    cpu: 24,
    memory: 45,
    neuralTraffic: 1420,
    swarms: 8,
  });

  const [loadingSync, setLoadingSync] = useState(false);

  // Auth redirection guard
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  // Simulate shifting stats on dashboard
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      setSystemStats((prev) => ({
        cpu: Math.max(10, Math.min(95, prev.cpu + Math.floor(Math.random() * 11) - 5)),
        memory: Math.max(30, Math.min(90, prev.memory + Math.floor(Math.random() * 5) - 2)),
        neuralTraffic: prev.neuralTraffic + Math.floor(Math.random() * 30) - 12,
        swarms: prev.swarms,
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleSyncLink = () => {
    setLoadingSync(true);
    setTimeout(() => {
      setLoadingSync(false);
      emitMockNotification('system', 'Neural Sync Complete', 'Coordinating vector space with master nodes completed.');
    }, 1500);
  };

  const handleTestBroadcast = () => {
    emitMockNotification('signup', 'Simulation Signal', 'Manual signal sequence injected into core console.');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-cyber-cyan animate-spin" />
          <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase animate-pulse">
            Querying Authorization Grids...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full glassmorphism rounded-xl border border-red-500/20 p-8 text-center flex flex-col items-center gap-4">
          <Lock className="w-10 h-10 text-red-400" />
          <h3 className="text-lg font-bold font-mono text-white uppercase">Access Denied</h3>
          <p className="text-sm text-gray-400 leading-relaxed font-mono">
            Your connection does not possess active credentials for the AI Dashboard. Redirecting to core login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      {/* Glow node */}
      <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-cyber-purple/5 filter blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase font-mono tracking-wider text-white">
            AI Dashboard<span className="text-cyber-cyan font-sans font-light">.Console</span>
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Linked Identity Node: <span className="text-cyber-cyan">{user?.email}</span> ({user?.role})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncLink}
            disabled={loadingSync}
            className="flex items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-mono text-white bg-cyber-cyan/10 hover:bg-cyber-cyan/25 border border-cyber-cyan/35 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingSync ? 'animate-spin' : ''}`} />
            Sync Neural Link
          </button>
          <button
            onClick={handleTestBroadcast}
            className="flex items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-mono text-white bg-cyber-purple/10 hover:bg-cyber-purple/25 border border-cyber-purple/35 cursor-pointer transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            Inject Signal
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { icon: <Cpu className="w-5 h-5 text-cyber-cyan" />, label: 'Matrix CPU Load', val: `${systemStats.cpu}%`, desc: 'Active shader calculations' },
          { icon: <HardDrive className="w-5 h-5 text-cyber-purple" />, label: 'Synaptic Memory', val: `${systemStats.memory}%`, desc: 'Global states buffered' },
          { icon: <Activity className="w-5 h-5 text-cyber-pink" />, label: 'Vector Traffic', val: `${systemStats.neuralTraffic} p/s`, desc: 'Inbound API streams' },
          { icon: <Network className="w-5 h-5 text-amber-500" />, label: 'Cognitive Swarms', val: `${systemStats.swarms} Nodes`, desc: 'Active multi-agents' }
        ].map((card, idx) => (
          <div key={idx} className="glassmorphism rounded-xl p-5 border border-white/5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-xs font-mono text-gray-400">{card.label}</span>
              <div className="p-2 rounded bg-white/[0.02] border border-white/5">{card.icon}</div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-mono text-white">{card.val}</h3>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Matrix Activity Chart (Native SVG) */}
        <div className="lg:col-span-2 glassmorphism rounded-xl border border-white/5 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold font-mono text-white uppercase mb-2">Neural Traffic Density</h3>
            <p className="text-xs text-gray-500 font-mono mb-6">Real-time simulation flow mapping.</p>
          </div>
          
          <div className="relative h-60 w-full flex items-end gap-3 font-mono text-[10px] text-gray-600">
            {/* Background grids */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="w-full border-t border-white/[0.02]" />
              ))}
            </div>

            {/* Bars */}
            {[
              { label: '00:00', val: 30, color: 'from-cyber-cyan/20 to-cyber-cyan' },
              { label: '04:00', val: 55, color: 'from-cyber-purple/20 to-cyber-purple' },
              { label: '08:00', val: 85, color: 'from-cyber-pink/20 to-cyber-pink' },
              { label: '12:00', val: 68, color: 'from-cyber-cyan/20 to-cyber-cyan' },
              { label: '16:00', val: 92, color: 'from-cyber-purple/20 to-cyber-purple' },
              { label: '20:00', val: 45, color: 'from-cyber-pink/20 to-cyber-pink' },
              { label: '24:00', val: 38, color: 'from-cyber-cyan/20 to-cyber-cyan' },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-2 relative group z-10">
                <div className="text-[9px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 bg-cyber-dark/80 px-1 py-0.5 rounded border border-white/5">
                  {bar.val}%
                </div>
                <div
                  style={{ height: `${bar.val}%` }}
                  className={`w-full rounded bg-gradient-to-t ${bar.color} transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.02)]`}
                />
                <span>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WebSocket Signal Notifications logger */}
        <div className="glassmorphism rounded-xl border border-white/5 p-6 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold font-mono text-white uppercase">Matrix Signals</h3>
              <span className="p-1 rounded bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple">
                <Bell className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-1">Real-time socket broadcasts.</p>
          </div>

          <div className="flex-1 max-h-60 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <Network className="w-8 h-8 text-gray-600 mb-2 animate-pulse" />
                <p className="text-[10px] font-mono text-gray-600 uppercase">Awaiting signals...</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif._id} className="border border-white/5 bg-white/[0.01] rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase text-cyber-cyan bg-cyber-cyan/5 border border-cyber-cyan/20 px-1.5 py-0.5 rounded">
                      {notif.type}
                    </span>
                    <span className="text-[9px] font-mono text-gray-500">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold font-mono text-white mt-2">{notif.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-1 leading-normal">{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
