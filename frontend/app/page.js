'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Cpu,
  Layers,
  Zap,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Mail,
  Send,
  Users,
  Compass,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

// Dynamically load R3F Canvas to bypass SSR restrictions
const ThreeScene = dynamic(() => import('../../components/three/Scene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#030014] flex items-center justify-center -z-10">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-t-2 border-cyan-400 animate-spin" />
        <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest animate-pulse">
          Synchronizing Neural Matrix...
        </span>
      </div>
    </div>
  ),
});

export default function AdminLayout({ children }) {
  const { emitMockNotification } = useSocket();
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch featured projects and blogs on mount
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Fetch Projects
    fetch(`${API_URL}/api/projects?featured=true`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setProjects(res.data);
      })
      .catch(() => {
        // Fallback mock projects if server offline
        setProjects([
          {
            _id: 'mock_p1',
            title: 'Aetheris AI Core',
            category: 'AI Agents',
            description: 'Autonomous neural agent capable of orchestrating complex decentralized micro-services.',
            techStack: ['React', 'Node.js', 'TensorFlow'],
            mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          },
          {
            _id: 'mock_p2',
            title: 'Helios Quantum Grid',
            category: 'Quantum Computing',
            description: 'Quantum simulation layer running complex molecular dynamics calculations via distributed web threads.',
            techStack: ['Three.js', 'WebAssembly', 'Go'],
            mediaUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
          },
        ]);
      });

    // Fetch Blogs
    fetch(`${API_URL}/api/blogs`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setBlogs(res.data.slice(0, 3));
      })
      .catch(() => {
        setBlogs([
          {
            _id: 'mock_b1',
            title: 'The Rise of Symbiotic Intelligence',
            readTime: '4 min read',
            tags: ['AI Agents', 'Collective Logic'],
            coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
          },
          {
            _id: 'mock_b2',
            title: 'Quantum Shaders in Web Graphics',
            readTime: '6 min read',
            tags: ['Web3D', 'WebGL'],
            coverImage: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=800&q=80',
          },
        ]);
      });
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (data.success) {
        setFormSubmitted(true);
        setContactForm({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      console.warn('Backend contact offline, simulating submission local.');
      // Offline fallback
      setFormSubmitted(true);
      emitMockNotification(
        'contact',
        'Inquiry Simulated (Offline)',
        `Transmission from ${contactForm.name} logs simulated.`
      );
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* 3D Immersive background canvas */}
      <ThreeScene />

      {/* Hero Section */}
      <section id="hero" className="min-h-[90vh] flex flex-col justify-center items-center px-6 text-center relative pt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto flex flex-col items-center gap-6"
        >
          {/* Sub-label banner */}
          <div className="inline-flex items-center gap-2 border border-cyan-400/30 bg-cyan-400/5 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-cyan-400 uppercase shadow-[0_0_10px_rgba(0,242,254,0.1)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Simulation Matrix Online
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase font-mono tracking-wider text-white leading-tight">
            Decentralize <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Intelligence</span>
          </h1>

          <p className="text-md sm:text-lg text-gray-400 max-w-2xl leading-relaxed">
            Welcome to the Novasphere AI Universe. An immersive cognitive engine synchronizing multi-agent networks, quantum molecular dynamics, and responsive neural computing templates.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <Link
              href="/auth/signup"
              className="py-3 px-8 rounded-lg text-sm font-mono text-white bg-gradient-to-r from-cyan-400 to-purple-600 border border-cyan-400/40 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.25)] hover:shadow-[0_0_30px_rgba(0,242,254,0.45)] transition-all transform hover:-translate-y-0.5"
            >
              Initialize Node
            </Link>
            <Link
              href="/dashboard"
              className="py-3 px-8 rounded-lg text-sm font-mono text-cyan-400 hover:text-white border border-cyan-400/30 hover:border-cyan-400 bg-cyan-400/5 hover:bg-cyan-400/15 transition-all"
            >
              Access Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-xs font-mono tracking-widest text-gray-500 uppercase">Scroll Matrix</span>
          <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center p-1.5">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Main Content Area (Admin Dashboard Content) */}
      <main className="flex-1 relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Admin Header with Logout */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-light text-white">Admin Dashboard</h2>
              <p className="text-sm text-gray-500">Welcome back, Administrator</p>
            </div>
            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/';
              }}
              className="px-4 py-2 text-sm text-red-400 border border-red-400/30 rounded-lg hover:bg-red-500/10 transition-all"
            >
              ⏻ Logout
            </button>
          </div>

          {/* Admin Content */}
          {children}
        </div>
      </main>

      {/* Rest of sections (About, Services, Technologies, Projects, Team, Blog, Contact) */}
      {/* ... (same as before, but with proper imports and colors) */}
    </div>
  );
}