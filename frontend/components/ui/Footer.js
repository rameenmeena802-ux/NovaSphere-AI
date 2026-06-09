'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#030014] border-t border-cyber-cyan/15 relative z-10 pt-16 pb-8 overflow-hidden">
      {/* Background glow node */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-cyber-cyan/5 filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyber-cyan to-cyber-purple flex items-center justify-center shadow-[0_0_10px_rgba(0,242,254,0.2)]">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-wider uppercase font-mono text-white">
                Novasphere<span className="text-cyber-cyan font-sans font-light">.AI</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed font-sans pr-4">
              Orchestrating multi-agent cognitive networks and distributed sub-systems. Redefining sub-atomic visual simulation and autonomous neural models.
            </p>
          </div>

          {/* Core Paths */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-cyber-cyan mb-4 font-semibold">
              Matrix Sectors
            </h4>
            <ul className="flex flex-col gap-2.5">
              {['About Core', 'Services', 'Technologies', 'Projects Grid', 'Our Team'].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={`/#${item.toLowerCase().split(' ')[0]}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors font-sans"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers & Docs */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-cyber-purple mb-4 font-semibold">
              Developer Grid
            </h4>
            <ul className="flex flex-col gap-2.5">
              {['API Docs', 'Simulation Models', 'System Architecture', 'Status Network', 'Security Schema'].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href="/dashboard"
                    className="text-sm text-gray-400 hover:text-white transition-colors font-sans"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Live State */}
          <div className="flex flex-col gap-5">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-cyber-pink mb-4 font-semibold">
                Core Broadcasts
              </h4>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg glassmorphism hover:border-cyber-cyan/60 flex items-center justify-center text-gray-400 hover:text-cyber-cyan transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg glassmorphism hover:border-cyber-cyan/60 flex items-center justify-center text-gray-400 hover:text-cyber-cyan transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg glassmorphism hover:border-cyber-cyan/60 flex items-center justify-center text-gray-400 hover:text-cyber-cyan transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Simulated Live System Counter */}
            <div className="border border-white/5 bg-white/[0.02] rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono text-gray-400">Nodes Synchronized</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">14,289/14,289</span>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-gray-500">
            &copy; {currentYear} Novasphere AI Universe. All simulations active.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs font-mono text-gray-500 hover:text-gray-400 flex items-center gap-1 cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5" /> Security Protocol
            </span>
            <span className="text-xs font-mono text-gray-500 hover:text-gray-400 flex items-center gap-1 cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5" /> Support Grid
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
