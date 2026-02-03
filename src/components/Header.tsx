'use client';

import { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import Link from 'next/link';
import NotificationDropdown from './NotificationDropdown';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-20 flex items-center justify-between px-6 border-b border-slate-200 bg-white sticky top-0 z-10 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">早上好, 设计师 👋</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索文档、计划..." 
            className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64 transition-all"
          />
        </div>
        
        <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 transition-colors rounded-full cursor-pointer ${showNotifications ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600'}`}
            >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            {showNotifications && (
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
            )}
        </div>
        
        <Link href="/profile">
          <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500/20 transition-all">
               <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
          </div>
        </Link>
      </div>
    </header>
  );
}
