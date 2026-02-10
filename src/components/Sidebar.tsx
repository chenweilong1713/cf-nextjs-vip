'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Layers, 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  GitGraph, 
  Palette, 
  MoreHorizontal,
  LogOut,
  Shield,
  Zap,
  Crown,
  Bot,
  StickyNote,
  Code,
  Users,
  History
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard', label: '首页', icon: LayoutDashboard, category: 'main', path: '/' },
    { id: 'members', label: '会员管理', icon: Users, category: 'create', path: '/members' },
    { id: 'transactions', label: '余额变动', icon: History, category: 'create', path: '/transactions' },
    // { id: 'ai', label: 'AI 对话', icon: Bot, category: 'main', path: '/ai' },
    // { id: 'memos', label: '备忘录', icon: StickyNote, category: 'create', path: '/memos' },
    // { id: 'docs', label: '文档编写', icon: FileText, category: 'create', path: '/docs' },
    // { id: 'snippets', label: '代码片段', icon: Code, category: 'create', path: '/snippets' },
    // { id: 'plans', label: '计划管理', icon: Calendar, category: 'create', path: '/plans' },
    // { id: 'mindmap', label: '思维导图', icon: GitGraph, category: 'create', path: '/mindmap' },
    // { id: 'inspiration', label: '灵感画板', icon: Palette, category: 'create', path: '/inspiration' },
    { id: 'others', label: '其它应用', icon: MoreHorizontal, category: 'more', path: '/others' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname === path;
  };

  const handleLogout = () => {
    // In a real app, you would clear auth tokens here
    router.push('/login');
  };

  const currentLevel: 'ordinary' | 'pro' | 'max' = 'max';
  
  const levelConfig = {
    ordinary: { 
      label: '普通会员', 
      icon: Shield, 
      desc: '基础功能',
      color: 'text-slate-600', 
      bg: 'bg-slate-100',
      border: 'border-slate-200',
      gradient: 'from-slate-50 to-slate-100'
    },
    pro: { 
      label: 'Pro 会员', 
      icon: Zap, 
      desc: '专业功能',
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      gradient: 'from-indigo-50 to-white'
    },
    max: { 
      label: 'Max 会员', 
      icon: Crown, 
      desc: '尊享权益',
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      gradient: 'from-amber-50 to-white'
    }
  };
  
  const level = levelConfig[currentLevel];

  return (
    <aside className="w-52 flex-shrink-0 border-r border-slate-200 flex flex-col bg-white h-screen sticky top-0 z-20">
      <div className="p-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <level.icon className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight">VIP 管理系统</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">首页</div>
        
        {menuItems.filter(item => item.category === 'main').map((item) => (
           <Link
             key={item.id}
             href={item.path}
             className={`w-full sidebar-item flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
               isActive(item.path)
                 ? 'bg-white text-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.1)]' 
                 : 'text-slate-600 hover:bg-white hover:text-indigo-600'
             }`}
           >
             <item.icon className="w-4 h-4" />
             <span className="font-medium text-sm">{item.label}</span>
           </Link>
        ))}
        
        <div className="mt-6 text-[10px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">功能菜单</div>
        
        {menuItems.filter(item => item.category === 'create').map((item) => (
           <Link
             key={item.id}
             href={item.path}
             className={`w-full sidebar-item flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
               isActive(item.path)
                 ? 'bg-white text-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.1)]' 
                 : 'text-slate-600 hover:bg-white hover:text-indigo-600'
             }`}
           >
             <item.icon className="w-4 h-4" />
             <span className="font-medium text-sm">{item.label}</span>
           </Link>
        ))}

        <div className="mt-6 text-[10px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">更多</div>
        
        {menuItems.filter(item => item.category === 'more').map((item) => (
           <Link
             key={item.id}
             href={item.path}
             className={`w-full sidebar-item flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
               isActive(item.path)
                 ? 'bg-white text-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.1)]' 
                 : 'text-slate-600 hover:bg-white hover:text-indigo-600'
             }`}
           >
             <item.icon className="w-4 h-4" />
             <span className="font-medium text-sm">{item.label}</span>
           </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <div className={`p-3 rounded-xl mb-3 border ${level.border} bg-gradient-to-br ${level.gradient}`}>
           <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-slate-500">当前等级</span>
              <span className={`px-1.5 py-0.5 rounded-full ${level.bg} text-[10px] font-bold ${level.color} uppercase tracking-wider`}>
                {currentLevel}
              </span>
           </div>
           <div className="flex items-center gap-2">
              <div className={`p-1.5 bg-white/80 rounded-md shadow-sm ${level.color}`}>
                 <level.icon className="w-4 h-4" />
              </div>
              <div>
                 <p className="font-bold text-slate-800 text-xs">{level.label}</p>
                 <p className="text-[10px] text-slate-500">{level.desc}</p>
              </div>
           </div>
        </div>
      </div>
    </aside>
  );
}
