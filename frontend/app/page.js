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
import { useSocket } from '../context/SocketContext';

// Dynamically load R3F Canvas to bypass SSR restrictions
const ThreeScene = dynamic(() => import('../components/three/Scene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#030014] flex items-center justify-center -z-10">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-t-2 border-cyber-cyan animate-spin" />
        <span className="font-mono text-xs text-cyber-cyan uppercase tracking-widest animate-pulse">
          Synchronizing Neural Matrix...
        </span>
      </div>
    </div>
  ),
});

export default function HomePage() {
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
          <div className="inline-flex items-center gap-2 border border-cyber-cyan/30 bg-cyber-cyan/5 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-cyber-cyan uppercase shadow-[0_0_10px_rgba(0,242,254,0.1)]">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
            Simulation Matrix Online
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase font-mono tracking-wider text-white leading-tight">
            Decentralize <br />
            <span className="holographic-text text-glow-cyan">Intelligence</span>
          </h1>

          <p className="text-md sm:text-lg text-gray-400 max-w-2xl leading-relaxed">
            Welcome to the Novasphere AI Universe. An immersive cognitive engine synchronizing multi-agent networks, quantum molecular dynamics, and responsive neural computing templates.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <Link
              href="/auth/signup"
              className="py-3 px-8 rounded-lg text-sm font-mono text-white bg-gradient-to-r from-cyber-cyan to-cyber-purple border border-cyber-cyan/40 hover:border-cyber-cyan shadow-[0_0_20px_rgba(0,242,254,0.25)] hover:shadow-[0_0_30px_rgba(0,242,254,0.45)] transition-all transform hover:-translate-y-0.5"
            >
              Initialize Node
            </Link>
            <Link
              href="/dashboard"
              className="py-3 px-8 rounded-lg text-sm font-mono text-cyber-cyan hover:text-white border border-cyber-cyan/30 hover:border-cyber-cyan bg-cyber-cyan/5 hover:bg-cyber-cyan/15 transition-all"
            >
              Access Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-xs font-mono tracking-widest text-gray-500 uppercase">Scroll Matrix</span>
          <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center p-1.5">
            <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-mono tracking-wider">
              Novasphere <span className="text-cyber-cyan">Core Architecture</span>
            </h2>
            <p className="text-gray-400 leading-relaxed">
              At Novasphere, we are constructing a multi-layered cognitive framework designed to support the next era of computing. By fusing sub-atomic particle physics rendering with responsive vector pipelines, our platform allows developers to interact with large multi-agent nodes inside an immersive 3D landscape.
            </p>
            
            {/* Stats block */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/5 font-mono">
              <div>
                <h3 className="text-3xl font-bold text-cyber-cyan">15ms</h3>
                <p className="text-xs text-gray-500 uppercase mt-1">Matrix Latency</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-cyber-purple">99.9%</h3>
                <p className="text-xs text-gray-500 uppercase mt-1">Uptime Sync</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-cyber-pink">4.2M</h3>
                <p className="text-xs text-gray-500 uppercase mt-1">Sims Broadcasted</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glassmorphism rounded-2xl p-8 border border-cyber-cyan/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-cyan/5 rounded-bl-full pointer-events-none" />
              <Cpu className="w-10 h-10 text-cyber-cyan mb-6" />
              <h4 className="text-lg font-bold font-mono text-white mb-2 uppercase">Quantum Decoupled Memory</h4>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Our proprietary synaptic routing allows concurrent multi-agent clusters to access global states without thread locks. Performance scales linearly with network node size.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-cyber-cyan cursor-pointer group">
                Review Whitepaper <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 relative z-10 bg-cyber-dark/40 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center gap-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-mono tracking-wider">
              Simulation <span className="text-cyber-purple">Capabilities</span>
            </h2>
            <p className="text-gray-400 max-w-xl text-sm">
              We provide distributed infrastructure for running high-frequency autonomous agent grids.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Compass className="w-6 h-6 text-cyber-cyan" />,
                title: 'Cognitive Swarms',
                desc: 'Orchestrating agent entities communicating over decentralized socket lines.',
                border: 'hover:border-cyber-cyan/30'
              },
              {
                icon: <Layers className="w-6 h-6 text-cyber-purple" />,
                title: 'Synaptic Routing',
                desc: 'Automatic payload load balancing mapped to low latency regional server clusters.',
                border: 'hover:border-cyber-purple/30'
              },
              {
                icon: <Zap className="w-6 h-6 text-cyber-pink" />,
                title: 'Quantum Simulation',
                desc: 'Accelerated physics processing loaded directly into WebGL matrix pipelines.',
                border: 'hover:border-cyber-pink/30'
              },
              {
                icon: <ShieldAlert className="w-6 h-6 text-amber-500" />,
                title: 'Neural Sentinels',
                desc: 'AI firewall layers guarding JWT transaction handshakes from spoofing nodes.',
                border: 'hover:border-amber-500/30'
              }
            ].map((srv, idx) => (
              <div
                key={idx}
                className={`glassmorphism rounded-xl p-6 border border-white/5 transition-all duration-300 hover:-translate-y-1 ${srv.border}`}
              >
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 w-fit mb-5">
                  {srv.icon}
                </div>
                <h4 className="text-md font-bold font-mono text-white mb-2 uppercase">{srv.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section id="technologies" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center gap-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-mono tracking-wider">
              Matrix <span className="text-cyber-pink">Node Speeds</span>
            </h2>
            <p className="text-gray-400 max-w-xl text-sm">
              Current operational capacities across our tech adapters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Next.js App Core', value: 98, color: 'text-cyber-cyan', border: 'border-cyber-cyan/25' },
              { label: 'WebGL Shaders', value: 92, color: 'text-cyber-purple', border: 'border-cyber-purple/25' },
              { label: 'Socket Streamer', value: 85, color: 'text-cyber-pink', border: 'border-cyber-pink/25' },
              { label: 'MongoDB Cluster', value: 88, color: 'text-amber-500', border: 'border-amber-500/25' }
            ].map((tech, idx) => (
              <div key={idx} className={`glassmorphism rounded-xl p-6 border ${tech.border} text-center`}>
                <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke={tech.color === 'text-cyber-cyan' ? '#00f2fe' : tech.color === 'text-cyber-purple' ? '#8a2be2' : tech.color === 'text-cyber-pink' ? '#ec4899' : '#f59e0b'}
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * tech.value) / 100}
                    />
                  </svg>
                  <span className={`absolute text-xl font-bold font-mono ${tech.color}`}>{tech.value}%</span>
                </div>
                <h4 className="text-sm font-semibold font-mono text-white uppercase">{tech.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section id="projects" className="py-24 px-6 relative z-10 bg-cyber-dark/40 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-mono tracking-wider">
                Simulated <span className="text-cyber-cyan">Grid Projects</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Operational research units initialized on the Novasphere stack.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs font-mono text-cyber-cyan hover:text-white transition-colors border-b border-cyber-cyan/30 hover:border-white pb-1 w-fit"
            >
              Inspect Dashboard Modules <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj) => (
              <div
                key={proj._id}
                className="group relative rounded-xl border border-white/5 overflow-hidden glassmorphism flex flex-col md:flex-row"
              >
                <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden bg-cyber-dark">
                  <img
                    src={proj.mediaUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#030014] via-transparent to-transparent" />
                </div>
                <div className="p-6 w-full md:w-3/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyber-cyan uppercase tracking-widest bg-cyber-cyan/5 border border-cyber-cyan/25 py-0.5 px-2 rounded-full w-fit">
                      {proj.category}
                    </span>
                    <h4 className="text-lg font-bold font-mono text-white uppercase mt-3 mb-2">{proj.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">{proj.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {proj.techStack?.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-gray-500 bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center gap-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-mono tracking-wider">
              Architect <span className="text-cyber-purple">Nodes</span>
            </h2>
            <p className="text-gray-400 max-w-xl text-sm">
              Core entities directing the simulation paths of the Novasphere system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Dr. Evelyn Moss', role: 'Neural Architect', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
              { name: 'Marcus Sterling', role: 'Matrix engineer', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
              { name: 'Aria Thorne', role: 'Quantum Theorist', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
              { name: 'Tariq Vance', role: 'Core Lead', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' }
            ].map((member, idx) => (
              <div key={idx} className="glassmorphism rounded-xl border border-white/5 overflow-hidden text-center hover:border-cyber-purple/40 transition-colors duration-300">
                <div className="h-48 overflow-hidden relative">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold font-mono text-white uppercase">{member.name}</h4>
                  <p className="text-xs text-cyber-cyan font-mono mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 px-6 relative z-10 bg-cyber-dark/40 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center gap-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-mono tracking-wider">
              Research <span className="text-cyber-pink">Broadcasts</span>
            </h2>
            <p className="text-gray-400 max-w-xl text-sm">
              Latest news updates and technical whitepapers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((b) => (
              <article key={b._id} className="glassmorphism rounded-xl border border-white/5 overflow-hidden flex flex-col justify-between hover:border-cyber-pink/35 transition-colors group">
                <div>
                  <div className="h-44 overflow-hidden bg-cyber-dark">
                    <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500 mb-3">
                      <span>{b.readTime}</span>
                      <span>•</span>
                      <span>{b.tags?.[0]}</span>
                    </div>
                    <h4 className="text-sm font-bold font-mono text-white uppercase leading-snug hover:text-cyber-pink transition-colors cursor-pointer">
                      {b.title}
                    </h4>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <Link href="/dashboard" className="inline-flex items-center gap-1 text-[10px] font-mono text-cyber-pink border-b border-cyber-pink/20 hover:border-cyber-pink transition-colors">
                    Read Whitepaper <BookOpen className="w-3 h-3 ml-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 relative z-10 max-w-4xl mx-auto">
        <div className="glassmorphism rounded-2xl border border-white/5 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyber-pink/5 rounded-br-full pointer-events-none" />
          
          <div className="text-center mb-10 flex flex-col items-center gap-3">
            <Mail className="w-8 h-8 text-cyber-pink mb-2" />
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-mono tracking-wider">
              Establish <span className="text-cyber-pink">Transmission</span>
            </h2>
            <p className="text-xs text-gray-400 max-w-sm font-mono">
              Signal the Novasphere system. Form data is broadcasted in real-time.
            </p>
          </div>

          {formSubmitted ? (
            <div className="text-center py-8 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cyber-pink/20 border border-cyber-pink flex items-center justify-center text-cyber-pink">
                <Send className="w-5 h-5" />
              </div>
              <h4 className="text-md font-bold font-mono uppercase text-white">Transmission Broadcasted</h4>
              <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                Your connection request has been routed to our core coordinates. Expect synchronization updates shortly.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-4 text-xs font-mono text-cyber-pink hover:text-white border-b border-cyber-pink/20 hover:border-white pb-0.5 transition-colors cursor-pointer"
              >
                Send New Signal
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-pink/60 transition-colors font-mono"
                    placeholder="Identity Label"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-pink/60 transition-colors font-mono"
                    placeholder="Node Coordinates"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-pink/60 transition-colors font-mono"
                  placeholder="Transmission Code"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">Message</label>
                <textarea
                  required
                  rows="4"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-pink/60 transition-colors font-mono resize-none"
                  placeholder="Insert transmission stream payload..."
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3 px-6 rounded-lg text-sm font-mono text-white bg-gradient-to-r from-cyber-purple to-cyber-pink border border-cyber-pink/40 hover:border-cyber-pink shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:shadow-[0_0_25px_rgba(236,72,153,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {formLoading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Broadcast Transmission
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
