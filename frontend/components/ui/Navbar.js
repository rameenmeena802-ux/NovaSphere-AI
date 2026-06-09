'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Cpu, LogOut, LayoutDashboard, User, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Scroll detection for navbar style change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Technologies', href: '/#technologies' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Team', href: '/#team' },
    { name: 'Blog', href: '/#blog' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (e, href) => {
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(href.replace('/#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-cyber-dark/85 backdrop-blur-md border-b border-cyber-cyan/15 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'py-5 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyber-cyan to-cyber-purple flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-transform duration-300 group-hover:scale-105">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-wider uppercase font-mono text-white group-hover:text-cyber-cyan transition-colors">
            Novasphere<span className="text-cyber-cyan font-sans font-light">.AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm tracking-wide text-gray-400 hover:text-cyber-cyan transition-colors font-mono relative py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-cyber-cyan transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop Auth Control */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-cyber-dark-gray/30 border border-white/5 py-1.5 px-3 rounded-full backdrop-blur-sm">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&h=64&q=80'}
                  alt={user?.name}
                  className="w-6 h-6 rounded-full border border-cyber-cyan/35 object-cover"
                />
                <span className="text-xs font-mono text-gray-300">{user?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 py-1.5 px-4 rounded-md text-xs font-mono text-white bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 hover:from-cyber-cyan/30 hover:to-cyber-purple/30 border border-cyber-cyan/30 hover:border-cyber-cyan/60 transition-all hover:-translate-y-0.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 py-1.5 px-4 rounded-md text-xs font-mono text-white bg-gradient-to-r from-cyber-purple/20 to-cyber-pink/20 hover:from-cyber-purple/30 hover:to-cyber-pink/30 border border-cyber-purple/30 hover:border-cyber-purple/60 transition-all hover:-translate-y-0.5"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="p-1.5 rounded-md border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="py-1.5 px-6 rounded-md text-xs font-mono text-cyber-cyan hover:text-white border border-cyber-cyan/40 hover:border-cyber-cyan bg-cyber-cyan/5 hover:bg-cyber-cyan/20 transition-all"
            >
              Access Core
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden w-full border-t border-cyber-cyan/15 bg-cyber-dark/95 backdrop-blur-lg overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-md text-gray-300 hover:text-cyber-cyan transition-colors font-mono py-1 border-b border-white/5"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>

              <div className="pt-4 flex flex-col gap-4 border-t border-white/5">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&h=64&q=80'}
                        alt={user?.name}
                        className="w-8 h-8 rounded-full border border-cyber-cyan/35 object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-xs font-mono text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-mono text-white bg-cyber-cyan/10 border border-cyber-cyan/30"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>

                      {user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-mono text-white bg-cyber-purple/10 border border-cyber-purple/30"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-mono text-red-400 bg-red-500/5 border border-red-500/20 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-md text-sm font-mono text-cyber-cyan border border-cyber-cyan/40 bg-cyber-cyan/5"
                  >
                    Access Core Matrix
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
