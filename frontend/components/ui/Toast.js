'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info, Mail, Sparkles, X } from 'lucide-react';

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToastEvent = (e) => {
      const notification = e.detail;
      setToast(notification);

      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('novasphere-toast', handleToastEvent);
    return () => window.removeEventListener('novasphere-toast', handleToastEvent);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'signup':
        return <Sparkles className="w-5 h-5 text-cyber-cyan" />;
      case 'contact':
        return <Mail className="w-5 h-5 text-cyber-pink" />;
      default:
        return <Bell className="w-5 h-5 text-cyber-purple" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'signup':
        return 'border-cyber-cyan/40 shadow-[0_0_15px_rgba(0,242,254,0.15)]';
      case 'contact':
        return 'border-cyber-pink/40 shadow-[0_0_15px_rgba(236,72,153,0.15)]';
      default:
        return 'border-cyber-purple/40 shadow-[0_0_15px_rgba(138,43,226,0.15)]';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`w-full glassmorphism rounded-xl border p-4 flex gap-4 ${getBorderColor(toast.type)}`}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(toast.type)}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h5 className="text-sm font-semibold text-white font-mono">{toast.title}</h5>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{toast.message}</p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setToast(null)}
              className="flex-shrink-0 text-gray-500 hover:text-white transition-colors cursor-pointer self-start"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
