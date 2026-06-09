'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('novasphere_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem('novasphere_token');
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        // If server is offline, see if there is cached user info
        const cachedUser = localStorage.getItem('novasphere_user');
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
          } catch (_) {}
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('novasphere_token', data.token);
        const userProfile = {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${data.name}`,
        };
        localStorage.setItem('novasphere_user', JSON.stringify(userProfile));
        setUser(userProfile);
        setLoading(false);
        return { success: true };
      } else {
        setError(data.message || 'Login failed');
        setLoading(false);
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error(err);
      // Fallback for offline sandbox mode
      if (email === 'admin@novasphere.ai' && password === 'adminpassword') {
        const mockAdmin = {
          _id: 'mock_admin_id',
          name: 'Novasphere Admin (Local)',
          email: 'admin@novasphere.ai',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'
        };
        localStorage.setItem('novasphere_token', 'mock_token_admin');
        localStorage.setItem('novasphere_user', JSON.stringify(mockAdmin));
        setUser(mockAdmin);
        setLoading(false);
        return { success: true };
      } else if (email === 'user@novasphere.ai' && password === 'userpassword') {
        const mockUser = {
          _id: 'mock_user_id',
          name: 'Jane Explorer (Local)',
          email: 'user@novasphere.ai',
          role: 'user',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80'
        };
        localStorage.setItem('novasphere_token', 'mock_token_user');
        localStorage.setItem('novasphere_user', JSON.stringify(mockUser));
        setUser(mockUser);
        setLoading(false);
        return { success: true };
      }

      setError('Connection to backend failed. Use admin@novasphere.ai / adminpassword.');
      setLoading(false);
      return { success: false, message: 'Connection to backend failed' };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('novasphere_token', data.token);
        const userProfile = {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${data.name}`,
        };
        localStorage.setItem('novasphere_user', JSON.stringify(userProfile));
        setUser(userProfile);
        setLoading(false);
        return { success: true };
      } else {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Could not register user.');
      setLoading(false);
      return { success: false, message: 'Connection to backend failed' };
    }
  };

  const googleLoginSimulated = async (profile) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          googleId: profile.googleId || 'g_' + Date.now(),
          avatar: profile.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.name}`,
        }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('novasphere_token', data.token);
        const userProfile = {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: data.avatar,
        };
        localStorage.setItem('novasphere_user', JSON.stringify(userProfile));
        setUser(userProfile);
        setLoading(false);
        return { success: true };
      } else {
        setError(data.message || 'Google Auth failed');
        setLoading(false);
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error(err);
      // Simulated OAuth bypass
      const mockOAuth = {
        _id: 'mock_oauth_' + Date.now(),
        name: profile.name || 'Google Sync Node',
        email: profile.email || 'sync@gmail.com',
        role: 'user',
        avatar: profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80',
      };
      localStorage.setItem('novasphere_token', 'mock_token_oauth');
      localStorage.setItem('novasphere_user', JSON.stringify(mockOAuth));
      setUser(mockOAuth);
      setLoading(false);
      return { success: true };
    }
  };

  const logout = () => {
    localStorage.removeItem('novasphere_token');
    localStorage.removeItem('novasphere_user');
    setUser(null);
  };

  const forgotPassword = async (email) => {
    // Simulating sending recovery payload
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Quantum recovery link broadcasted to email.' });
      }, 1000);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        googleLogin: googleLoginSimulated,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
