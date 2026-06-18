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
  Loader2,
  Users,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Auth redirection guard
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  // Fetch orders and users
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') return;

    const fetchData = async () => {
      setLoadingOrders(true);
      setLoadingUsers(true);

      try {
        // Fetch orders
        const ordersRes = await fetch('/api/orders/admin/all', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }

        // Fetch users
        const usersRes = await fetch('/api/users', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoadingOrders(false);
        setLoadingUsers(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  // Simulate shifting stats
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setOrders(orders.map(o => 
          o._id === orderId ? { ...o, status: newStatus } : o
        ));
        emitMockNotification('system', 'Order Updated', `Order ${orderId.slice(-6)} status changed to ${newStatus}`);
      }
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  // Admin only
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full glassmorphism rounded-xl border border-red-500/20 p-8 text-center flex flex-col items-center gap-4">
          <Lock className="w-10 h-10 text-red-400" />
          <h3 className="text-lg font-bold font-mono text-white uppercase">Admin Access Required</h3>
          <p className="text-sm text-gray-400 leading-relaxed font-mono">
            You do not have administrator privileges to access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-cyber-cyan animate-spin" />
          <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase animate-pulse">
            Loading Dashboard...
          </span>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      {/* Glow node */}
      <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-cyber-purple/5 filter blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase font-mono tracking-wider text-white">
            Admin <span className="text-cyber-cyan font-sans font-light">Dashboard</span>
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Admin Node: <span className="text-cyber-cyan">{user?.email}</span> 
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncLink}
            disabled={loadingSync}
            className="flex items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-mono text-white bg-cyber-cyan/10 hover:bg-cyber-cyan/25 border border-cyber-cyan/35 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingSync ? 'animate-spin' : ''}`} />
            Sync Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
        {[
          { icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, label: 'Total Revenue', val: `$${totalRevenue.toFixed(2)}`, color: 'from-emerald-500/20 to-emerald-500/5' },
          { icon: <ShoppingBag className="w-4 h-4 text-cyber-cyan" />, label: 'Total Orders', val: orders.length.toString(), color: 'from-cyber-cyan/20 to-cyber-cyan/5' },
          { icon: <Clock className="w-4 h-4 text-amber-400" />, label: 'Pending', val: pendingOrders.toString(), color: 'from-amber-500/20 to-amber-500/5' },
          { icon: <CheckCircle className="w-4 h-4 text-cyber-purple" />, label: 'Delivered', val: completedOrders.toString(), color: 'from-cyber-purple/20 to-cyber-purple/5' },
        ].map((card, idx) => (
          <div key={idx} className={`glassmorphism rounded-xl p-5 border border-white/5 bg-gradient-to-br ${card.color}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400">{card.label}</span>
              {card.icon}
            </div>
            <h3 className="text-2xl font-bold font-mono text-white mt-2">{card.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders Management */}
        <div className="lg:col-span-2 glassmorphism rounded-xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-md font-bold font-mono text-white uppercase">Orders Management</h3>
              <p className="text-xs text-gray-500 font-mono">View and manage all orders</p>
            </div>
            <span className="text-xs font-mono text-cyber-cyan">{orders.length} orders</span>
          </div>

          {loadingOrders ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-white/5 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-xs font-mono text-gray-500">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {orders.map((order) => (
                <div key={order._id} className="border border-white/5 rounded-lg p-4 bg-white/[0.02]">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                    <div>
                      <p className="text-xs font-mono text-white">#{order._id?.slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] font-mono text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[9px] font-mono tracking-widest px-2 py-1 border rounded ${
                        order.status === 'delivered' ? 'text-green-400 border-green-400/30' :
                        order.status === 'cancelled' ? 'text-red-400 border-red-400/30' :
                        order.status === 'shipped' ? 'text-cyan-400 border-cyan-400/30' :
                        'text-amber-400 border-amber-400/30'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                      <span className="text-sm font-light text-white">${order.total?.toFixed(2)}</span>
                      {expandedOrder === order._id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-4 pt-4 border-t border-white/5"
                      >
                        {/* Order Items */}
                        <div className="space-y-2 mb-4">
                          {(order.items || []).map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="text-gray-300">{item.name} × {item.quantity}</span>
                              <span className="text-gray-400">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Shipping Info */}
                        {order.shippingAddress && (
                          <div className="text-[10px] text-gray-500 font-mono mb-4">
                            Ship to: {order.shippingAddress.fullName}, {order.shippingAddress.city}
                          </div>
                        )}

                        {/* Status Update */}
                        <div className="flex flex-wrap gap-2">
                          {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <button
                              key={status}
                              onClick={() => updateOrderStatus(order._id, status)}
                              className={`text-[9px] font-mono px-2 py-1 border rounded transition-all ${
                                order.status === status
                                  ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                                  : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                              }`}
                            >
                              {status.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Metrics + Notifications */}
        <div className="space-y-8">
          {/* System Metrics Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Cpu className="w-4 h-4 text-cyber-cyan" />, label: 'CPU', val: `${systemStats.cpu}%`, desc: 'Active shaders' },
              { icon: <HardDrive className="w-4 h-4 text-cyber-purple" />, label: 'Memory', val: `${systemStats.memory}%`, desc: 'Buffered states' },
              { icon: <Activity className="w-4 h-4 text-cyber-pink" />, label: 'Traffic', val: `${systemStats.neuralTraffic} p/s`, desc: 'API streams' },
              { icon: <Network className="w-4 h-4 text-amber-500" />, label: 'Swarms', val: `${systemStats.swarms} Nodes`, desc: 'Multi-agents' }
            ].map((card, idx) => (
              <div key={idx} className="glassmorphism rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2">
                  {card.icon}
                  <span className="text-[9px] font-mono text-gray-500">{card.label}</span>
                </div>
                <h4 className="text-lg font-bold font-mono text-white mt-1">{card.val}</h4>
                <p className="text-[8px] text-gray-600">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Notifications */}
          <div className="glassmorphism rounded-xl border border-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono text-white uppercase tracking-wider">Signals</h3>
              <Bell className="w-3.5 h-3.5 text-cyber-purple" />
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {notifications.length === 0 ? (
                <p className="text-[10px] font-mono text-gray-500 text-center py-8">Awaiting signals...</p>
              ) : (
                notifications.slice().reverse().map((notif) => (
                  <div key={notif._id} className="border border-white/5 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono uppercase text-cyber-cyan bg-cyber-cyan/5 px-1.5 py-0.5 rounded">
                        {notif.type}
                      </span>
                      <span className="text-[8px] font-mono text-gray-500">
                        {new Date(notif.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-300 mt-1">{notif.title}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}