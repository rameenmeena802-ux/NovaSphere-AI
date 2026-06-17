'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout(); // AuthContext se logout
    router.push('/'); // Home page par redirect
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      {/* Header with Logout */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 border-b border-[#333] bg-[#060606]/95 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-light">NovaSphere AI</h1>
          <p className="text-xs text-[#666]">Admin Panel</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user?.name || 'Admin'}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-400 border border-red-400/30 rounded hover:bg-red-500/10 transition-all"
          >
            ⏻ Logout
          </button>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}