'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Layers, 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  GitGraph, 
  Palette, 
  MoreHorizontal 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: '工作台首页', icon: LayoutDashboard, category: 'main', path: '/' },
    { id: 'docs', label: '文档编写', icon: FileText, category: 'create', path: '/docs' },
    { id: 'plans', label: '计划管理', icon: Calendar, category: 'create', path: '/plans' },
    { id: 'mindmap', label: '思维导图', icon: GitGraph, category: 'create', path: '/mindmap' },
    { id: 'inspiration', label: '灵感画板', icon: Palette, category: 'create', path: '/inspiration' },
    { id: 'others', label: '其它应用', icon: MoreHorizontal, category: 'more', path: '/others' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname === path;
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-100 flex flex-col bg-slate-50/50 h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Layers className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Nebula.</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 px-4 py-2 uppercase tracking-wider">主页</div>
        
        {menuItems.filter(item => item.category === 'main').map((item) => (
           <Link
             key={item.id}
             href={item.path}
             className={`w-full sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
               isActive(item.path)
                 ? 'bg-white text-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.1)]' 
                 : 'text-slate-600 hover:bg-white hover:text-indigo-600'
             }`}
           >
             <item.icon className="w-5 h-5" />
             <span className="font-medium">{item.label}</span>
           </Link>
        ))}
        
        <div className="mt-8 text-xs font-semibold text-slate-400 px-4 py-2 uppercase tracking-wider">创作工具</div>
        
        {menuItems.filter(item => item.category === 'create').map((item) => (
           <Link
             key={item.id}
             href={item.path}
             className={`w-full sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
               isActive(item.path)
                 ? 'bg-white text-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.1)]' 
                 : 'text-slate-600 hover:bg-white hover:text-indigo-600'
             }`}
           >
             <item.icon className="w-5 h-5" />
             <span className="font-medium">{item.label}</span>
           </Link>
        ))}

        <div className="mt-8 text-xs font-semibold text-slate-400 px-4 py-2 uppercase tracking-wider">更多</div>
        
        {menuItems.filter(item => item.category === 'more').map((item) => (
           <Link
             key={item.id}
             href={item.path}
             className={`w-full sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
               isActive(item.path)
                 ? 'bg-white text-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.1)]' 
                 : 'text-slate-600 hover:bg-white hover:text-indigo-600'
             }`}
           >
             <item.icon className="w-5 h-5" />
             <span className="font-medium">{item.label}</span>
           </Link>
        ))}
      </nav>

      <div className="p-6">
        <div className="p-4 bg-indigo-50 rounded-2xl">
          <p className="text-xs text-indigo-600 font-semibold mb-1">存储空间</p>
          <div className="w-full bg-indigo-200 h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-[65%]"></div>
          </div>
          <p className="text-[10px] text-indigo-400 mt-2">已使用 12.4 GB / 20 GB</p>
        </div>
      </div>
    </aside>
  );
}
