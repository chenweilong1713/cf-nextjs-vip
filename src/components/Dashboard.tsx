'use client';

import { MoreHorizontal, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 w-full max-w-[1400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Section: Chart + Promo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Card */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 relative overflow-hidden bg-white">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-700">工作效率趋势</h3>
              <p className="text-xs text-slate-400">过去7天的产出统计</p>
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          {/* Mock Chart Area */}
          <div className="h-48 w-full px-2">
             {/* Using simple SVG path for line chart simulation */}
             <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d="M0,40 Q15,35 25,20 T50,25 T75,10 T100,30" 
                      fill="url(#gradient)" stroke="none" />
                <path d="M0,40 Q15,35 25,20 T50,25 T75,10 T100,30" 
                      fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
                
                {/* Dots */}
                <circle cx="25" cy="20" r="1.5" fill="white" stroke="#6366f1" strokeWidth="1" />
                <circle cx="50" cy="25" r="1.5" fill="white" stroke="#6366f1" strokeWidth="1" />
                <circle cx="75" cy="10" r="1.5" fill="white" stroke="#6366f1" strokeWidth="1" />
             </svg>
          </div>
          
          <div className="flex justify-between text-xs text-slate-400 mt-4 px-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Promo Card */}
        <div className="lg:col-span-1 bg-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-200">
           {/* Decor */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500/20 rounded-full blur-xl -ml-5 -mb-5"></div>
           
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">升级到 Pro</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                    解锁 AI 写作助手、无限存储空间和高级数据分析功能。
                  </p>
              </div>
              
              <div className="mt-6">
                 <div className="flex items-end gap-1 mb-2">
                    <span className="text-3xl font-bold">¥12</span>
                    <span className="text-sm opacity-80 mb-1">/ 月</span>
                 </div>
                 <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-colors cursor-pointer">
                    立即升级
                 </button>
              </div>
           </div>
        </div>

      </div>

      {/* Bottom Section: Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-card p-6 rounded-3xl memo-yellow hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-yellow-400/20 text-yellow-700 text-[10px] font-bold rounded-full uppercase tracking-wider">进行中</span>
                <span className="text-xs text-slate-400">2h ago</span>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Q4 产品设计规范</h4>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                下周一需要完成所有组件库的整理，并输出 UI Kit。
            </p>
         </div>

         <div className="glass-card p-6 rounded-3xl memo-blue hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-blue-400/20 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider">待审核</span>
                <span className="text-xs text-slate-400">5h ago</span>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">前端架构技术选型</h4>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                对比 Next.js 和 Remix 的优劣势，确定最终方案。
            </p>
         </div>

         <div className="glass-card p-6 rounded-3xl memo-green flex flex-col items-center justify-center border-dashed border-2 border-green-200 bg-green-50/50 hover:bg-green-50 transition-colors cursor-pointer group">
             <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-light">+</span>
             </div>
             <span className="text-sm font-semibold text-green-700">新建项目</span>
         </div>
      </div>

    </div>
  );
}
