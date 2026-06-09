'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to WebSocket server
    const socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling']
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('📡 Connected to Novasphere WebSocket Network');
    });

    // Listen for live broadcasts
    socketInstance.on('notification', (newNotif) => {
      console.log('🔔 Live Notification received:', newNotif);
      setNotifications((prev) => [newNotif, ...prev]);

      // Trigger standard browser notification alert or custom sound/console log
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('novasphere-toast', { detail: newNotif });
        window.dispatchEvent(event);
      }
    });

    // Clean up connections on unmount
    return () => {
      socketInstance.off('connect');
      socketInstance.off('notification');
      socketInstance.disconnect();
    };
  }, []);

  // Helper to trigger simulated demo notification (mock)
  const emitMockNotification = (type, title, message) => {
    const mockNotif = {
      _id: 'mock_local_notif_' + Date.now(),
      type: type || 'system',
      title: title || 'Local Core Trigger',
      message: message || 'Neural simulation grid synced successfully.',
      createdAt: new Date(),
      read: false,
    };
    setNotifications((prev) => [mockNotif, ...prev]);
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('novasphere-toast', { detail: mockNotif });
      window.dispatchEvent(event);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications, emitMockNotification }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
