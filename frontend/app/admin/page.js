'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import {
  Users,
  FolderOpen,
  Image,
  Bell,
  BarChart3,
  Trash2,
  UserCheck,
  Plus,
  Copy,
  Check,
  Upload,
  AlertTriangle,
  Lock,
  Loader2
} from 'lucide-react';

export default function AdminPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const { emitMockNotification } = useSocket();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '', category: 'AI Agents', description: '', techStack: '', mediaUrl: '', clientLink: '', githubLink: '', featured: false
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Redirection guard
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (user?.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Fetch initial data
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') return;

    const token = localStorage.getItem('novasphere_token');
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch Analytics
    fetch(`${API_URL}/api/admin/analytics`, { headers })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setAnalytics(res.data);
      })
      .catch(() => handleFallbackAnalytics());

    // Fetch Users
    fetch(`${API_URL}/api/admin/users`, { headers })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setUsersList(res.data);
      })
      .catch(() => setUsersList([
        { _id: 'm_u1', name: 'Novasphere Admin', email: 'admin@novasphere.ai', role: 'admin', createdAt: new Date() },
        { _id: 'm_u2', name: 'Jane Explorer', email: 'user@novasphere.ai', role: 'user', createdAt: new Date() }
      ]));

    // Fetch Projects
    fetch(`${API_URL}/api/projects`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setProjectsList(res.data);
      })
      .catch(() => setProjectsList([
        { _id: 'm_p1', title: 'Aetheris AI Core', category: 'AI Agents', description: 'Autonomous agent core.', techStack: ['React'], mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' }
      ]));

    // Fetch Notifications
    fetch(`${API_URL}/api/admin/notifications`, { headers })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setNotificationsList(res.data);
      })
      .catch(() => setNotificationsList([
        { _id: 'm_n1', type: 'system', title: 'System Running', message: 'Matrix operational.', read: false, createdAt: new Date() }
      ]));
  }, [isAuthenticated, user]);

  const handleFallbackAnalytics = () => {
    setAnalytics({
      counts: { users: 2, projects: 1, blogs: 2, contacts: 0, unreadNotifications: 1 },
      systemPerformance: [
        { label: '00:00', cpu: 15, memory: 40 },
        { label: '04:00', cpu: 22, memory: 45 },
        { label: '08:00', cpu: 75, memory: 60 },
        { label: '12:00', cpu: 90, memory: 80 },
        { label: '16:00', cpu: 50, memory: 70 },
        { label: '20:00', cpu: 45, memory: 55 },
        { label: '24:00', cpu: 20, memory: 42 }
      ],
      weeklySignups: [
        { day: 'Mon', count: 2 },
        { day: 'Tue', count: 5 },
        { day: 'Wed', count: 12 },
        { day: 'Thu', count: 8 },
        { day: 'Fri', count: 15 },
        { day: 'Sat', count: 22 },
        { day: 'Sun', count: 10 }
      ]
    });
  };

  // User role modifications
  const toggleUserRole = async (userId, currentRole) => {
    const token = localStorage.getItem('novasphere_token');
    const newRole = currentRole === 'admin' ? 'user' : 'admin';

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(usersList.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (_) {
      // Mock update
      setUsersList(usersList.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      emitMockNotification('system', 'User Role Modified', `Role of user ${userId} updated to ${newRole} (offline simulated).`);
    }
  };

  // User deletion
  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to terminate this user node?')) return;
    const token = localStorage.getItem('novasphere_token');

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(usersList.filter((u) => u._id !== userId));
      } else {
        alert(data.message || 'Failed to delete user.');
      }
    } catch (_) {
      setUsersList(usersList.filter((u) => u._id !== userId));
      emitMockNotification('system', 'User Terminated', `Node connection ${userId} removed.`);
    }
  };

  // Project creation
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('novasphere_token');

    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projectForm)
      });
      const data = await res.json();
      if (data.success) {
        setProjectsList([data.data, ...projectsList]);
        setProjectForm({
          title: '', category: 'AI Agents', description: '', techStack: '', mediaUrl: '', clientLink: '', githubLink: '', featured: false
        });
        alert('Project registered in portfolio.');
      }
    } catch (_) {
      // Mock insert
      const newProj = {
        _id: 'm_p_' + Date.now(),
        ...projectForm,
        techStack: projectForm.techStack.split(',').map((s) => s.trim()),
        mediaUrl: projectForm.mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
      };
      setProjectsList([newProj, ...projectsList]);
      emitMockNotification('system', 'Project Created', `Simulation file ${projectForm.title} initialized (Offline).`);
      setProjectForm({
        title: '', category: 'AI Agents', description: '', techStack: '', mediaUrl: '', clientLink: '', githubLink: '', featured: false
      });
      alert('Project registered (Mock).');
    }
  };

  // Upload handler
  const handleFileUpload = async () => {
    if (!uploadFile) return;
    setUploadProgress(true);
    setUploadError('');
    setUploadedUrl('');

    const token = localStorage.getItem('novasphere_token');
    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setUploadedUrl(data.url);
        // Autofill project form media url
        setProjectForm((prev) => ({ ...prev, mediaUrl: data.url }));
      } else {
        setUploadError(data.message || 'File upload rejected.');
      }
    } catch (err) {
      setUploadError('Local node failed to transmit file to upload API.');
    } finally {
      setUploadProgress(false);
    }
  };

  // Copy helper
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mark notification read
  const markNotificationRead = async (notifId) => {
    const token = localStorage.getItem('novasphere_token');

    try {
      const res = await fetch(`${API_URL}/api/admin/notifications/${notifId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotificationsList(notificationsList.map((n) => (n._id === notifId ? { ...n, read: true } : n)));
      }
    } catch (_) {
      setNotificationsList(notificationsList.map((n) => (n._id === notifId ? { ...n, read: true } : n)));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-cyber-cyan animate-spin" />
          <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase animate-pulse">
            Querying Administrative Clearance...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full glassmorphism rounded-xl border border-red-500/20 p-8 text-center flex flex-col items-center gap-4">
          <Lock className="w-10 h-10 text-red-400 animate-pulse" />
          <h3 className="text-lg font-bold font-mono text-white uppercase">Restricted Area</h3>
          <p className="text-sm text-gray-400 leading-relaxed font-mono">
            Credentials do not hold administrator role authorization. Retracting node connections...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Page Title */}
      <div className="border-b border-white/5 pb-6 mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase font-mono tracking-wider text-white">
          Admin Panel<span className="text-cyber-purple font-sans font-light">.Core</span>
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-1">
          Authorized Master Admin: <span className="text-cyber-purple">{user?.name}</span>
        </p>
      </div>

      {/* Grid Layout (Left Navigation tabs, Right tab panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          {[
            { id: 'analytics', label: 'Matrix Stats', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'users', label: 'User Nodes', icon: <Users className="w-4 h-4" /> },
            { id: 'projects', label: 'Project Portfolio', icon: <FolderOpen className="w-4 h-4" /> },
            { id: 'media', label: 'Media Transmit', icon: <Image className="w-4 h-4" /> },
            { id: 'notifications', label: 'Matrix Alert Logs', icon: <Bell className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono tracking-wide text-left cursor-pointer transition-all border ${
                activeTab === tab.id
                  ? 'bg-cyber-purple/10 text-white border-cyber-purple/50 shadow-[0_0_15px_rgba(138,43,226,0.1)]'
                  : 'text-gray-400 border-transparent hover:bg-white/[0.02] hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel View Area */}
        <div className="lg:col-span-3 min-h-[50vh]">
          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Counts metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Active Users', val: analytics?.counts?.users || 0 },
                  { label: 'AI Projects', val: analytics?.counts?.projects || 0 },
                  { label: 'Blogs Live', val: analytics?.counts?.blogs || 0 },
                  { label: 'User Inquiries', val: analytics?.counts?.contacts || 0 }
                ].map((stat, idx) => (
                  <div key={idx} className="glassmorphism rounded-xl p-4 border border-white/5 text-center">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{stat.label}</span>
                    <h3 className="text-2xl font-bold font-mono text-white mt-1">{stat.val}</h3>
                  </div>
                ))}
              </div>

              {/* Weekly Signups Native Chart */}
              <div className="glassmorphism rounded-xl border border-white/5 p-6">
                <h3 className="text-sm font-bold font-mono text-white uppercase mb-4">Matrix User Registrations</h3>
                <div className="h-44 w-full flex items-end gap-4 font-mono text-[9px] text-gray-600">
                  {analytics?.weeklySignups?.map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                      <span className="text-white font-bold">{bar.count}</span>
                      <div
                        style={{ height: `${Math.min(100, (bar.count / 25) * 100)}%` }}
                        className="w-full rounded bg-gradient-to-t from-cyber-purple/20 to-cyber-purple"
                      />
                      <span>{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS LIST */}
          {activeTab === 'users' && (
            <div className="glassmorphism rounded-xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h3 className="text-sm font-bold font-mono text-white uppercase">User Nodes Registry</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-white/[0.01] border-b border-white/5 text-gray-500">
                    <tr>
                      <th className="p-4 uppercase font-semibold">User Node</th>
                      <th className="p-4 uppercase font-semibold">Email</th>
                      <th className="p-4 uppercase font-semibold">Role Auth</th>
                      <th className="p-4 uppercase font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usersList.map((usr) => (
                      <tr key={usr._id} className="hover:bg-white/[0.01]">
                        <td className="p-4 text-white font-semibold">{usr.name}</td>
                        <td className="p-4 text-gray-400">{usr.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${usr.role === 'admin' ? 'bg-cyber-purple/10 border border-cyber-purple/35 text-cyber-purple' : 'bg-gray-500/10 border border-gray-500/25 text-gray-400'}`}>
                            {usr.role}
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => toggleUserRole(usr._id, usr.role)}
                            className="p-1.5 rounded border border-white/5 hover:border-cyber-purple/40 text-gray-400 hover:text-cyber-purple cursor-pointer transition-colors"
                            title="Toggle Auth Role"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteUser(usr._id)}
                            className="p-1.5 rounded border border-white/5 hover:border-red-500/40 text-gray-400 hover:text-red-400 cursor-pointer transition-colors"
                            title="Terminate Node"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS CREATOR */}
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Creator Form */}
              <div className="glassmorphism rounded-xl border border-white/5 p-6">
                <h3 className="text-sm font-bold font-mono text-white uppercase mb-6 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-cyber-cyan" /> Initialize Project Node
                </h3>

                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1.5">Project Title</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full bg-white/[0.01] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyber-cyan/60 font-mono"
                      placeholder="e.g. Aetheris Agent Core"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1.5">Category</label>
                      <select
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full bg-cyber-dark border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan/60 font-mono"
                      >
                        {['AI Agents', 'Neural Networks', 'Quantum Computing', 'Data Intelligence', 'Cyber Security'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1.5">Featured</label>
                      <div className="flex items-center h-8">
                        <input
                          type="checkbox"
                          checked={projectForm.featured}
                          onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                          className="w-4 h-4 rounded border-white/10 accent-cyber-cyan focus:outline-none"
                        />
                        <span className="text-[10px] font-mono text-gray-500 ml-2">Show in hero section</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1.5">Description</label>
                    <textarea
                      required
                      rows="3"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full bg-white/[0.01] border border-white/10 rounded p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyber-cyan/60 font-mono resize-none"
                      placeholder="Insert description summary..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1.5">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      value={projectForm.techStack}
                      onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                      className="w-full bg-white/[0.01] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyber-cyan/60 font-mono"
                      placeholder="React, PyTorch, MongoDB"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1.5">Media Image URL (Cloudinary)</label>
                    <input
                      type="text"
                      value={projectForm.mediaUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, mediaUrl: e.target.value })}
                      className="w-full bg-white/[0.01] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyber-cyan/60 font-mono"
                      placeholder="https://cloudinary.com/..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded text-xs font-mono text-white bg-gradient-to-r from-cyber-cyan to-cyber-purple border border-cyber-cyan/40 hover:border-cyber-cyan cursor-pointer transition-colors"
                  >
                    Broadcast Project Node
                  </button>
                </form>
              </div>

              {/* Projects List Preview */}
              <div className="glassmorphism rounded-xl border border-white/5 p-6 max-h-[75vh] overflow-y-auto space-y-4">
                <h3 className="text-sm font-bold font-mono text-white uppercase mb-4">Live Portfolios</h3>
                {projectsList.map((p) => (
                  <div key={p._id} className="border border-white/5 bg-white/[0.01] rounded-lg p-3 flex gap-3">
                    <img src={p.mediaUrl} alt={p.title} className="w-16 h-16 object-cover rounded border border-white/10 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase">{p.title}</h4>
                      <p className="text-[10px] text-gray-500 uppercase mt-0.5">{p.category}</p>
                      <p className="text-[10px] text-gray-400 line-clamp-2 mt-2 leading-relaxed">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA UPLOADER */}
          {activeTab === 'media' && (
            <div className="max-w-xl mx-auto glassmorphism rounded-xl border border-white/5 p-8 relative overflow-hidden">
              <h3 className="text-sm font-bold font-mono text-white uppercase mb-6 flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyber-cyan" /> Cloudinary Media Transmit
              </h3>

              <div className="space-y-6">
                {/* Upload drag-box */}
                <div className="border border-dashed border-white/10 hover:border-cyber-cyan/40 bg-white/[0.01] rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3 transition-colors">
                  <Image className="w-8 h-8 text-gray-600" />
                  <div className="text-xs text-gray-400 font-mono">
                    {uploadFile ? (
                      <span className="text-cyber-cyan font-bold">{uploadFile.name}</span>
                    ) : (
                      'Select file to transmit to Cloud'
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="hidden"
                    id="admin-file-picker"
                  />
                  <label
                    htmlFor="admin-file-picker"
                    className="py-1.5 px-4 border border-white/10 rounded text-[10px] font-mono text-gray-300 hover:text-white bg-white/[0.02] cursor-pointer hover:border-white/20 transition-all mt-2"
                  >
                    Select File
                  </label>
                </div>

                {uploadError && (
                  <div className="p-3 border border-red-500/25 bg-red-500/5 text-[10px] font-mono text-red-400 rounded flex gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {uploadedUrl && (
                  <div className="p-4 border border-cyber-cyan/35 bg-cyber-cyan/5 rounded space-y-3">
                    <div className="text-[10px] font-mono text-cyber-cyan uppercase font-bold">Cloud Stream Linked:</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={uploadedUrl}
                        className="w-full bg-[#030014] border border-white/5 rounded px-2 py-1.5 text-[9px] font-mono text-gray-400 focus:outline-none"
                      />
                      <button
                        onClick={() => copyToClipboard(uploadedUrl)}
                        className="p-2 border border-white/10 hover:border-cyber-cyan/50 rounded text-gray-400 hover:text-cyber-cyan bg-white/[0.01] cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-cyber-cyan" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="w-full h-32 relative rounded border border-white/10 overflow-hidden bg-black/30">
                      <img src={uploadedUrl} alt="Thumbnail preview" className="w-full h-full object-contain" />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleFileUpload}
                  disabled={!uploadFile || uploadProgress}
                  className="w-full py-2.5 rounded text-xs font-mono text-white bg-gradient-to-r from-cyber-cyan to-cyber-purple border border-cyber-cyan/40 hover:border-cyber-cyan disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {uploadProgress ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Transmit to Cloudinary
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: ALERTS LOGS */}
          {activeTab === 'notifications' && (
            <div className="glassmorphism rounded-xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h3 className="text-sm font-bold font-mono text-white uppercase">Matrix Alerts Registry</h3>
              </div>
              <div className="divide-y divide-white/5">
                {notificationsList.map((notif) => (
                  <div key={notif._id} className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${notif.read ? 'bg-gray-500/10 text-gray-500 border border-transparent' : 'bg-cyber-cyan/15 border border-cyber-cyan/35 text-cyber-cyan'}`}>
                          {notif.type}
                        </span>
                        <span className="text-[9px] font-mono text-gray-500">
                          {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white font-mono mt-2">{notif.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                    
                    {!notif.read && (
                      <button
                        onClick={() => markNotificationRead(notif._id)}
                        className="py-1 px-3 border border-cyber-cyan/35 hover:border-cyber-cyan rounded text-[9px] font-mono text-cyber-cyan hover:text-white bg-cyber-cyan/5 transition-all cursor-pointer"
                      >
                        Clear Alert
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
