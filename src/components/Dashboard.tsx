'use client';

import { MoreHorizontal, ArrowUpRight } from 'lucide-react';
import MemoWidget from './MemoWidget';
import TodoWidget from './TodoWidget';
import BookmarkWidget from './BookmarkWidget';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 w-full max-w-[1400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Section: Todo + Memo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 h-[450px]">
            <TodoWidget />
         </div>
         <div className="lg:col-span-1 h-[450px]">
           <MemoWidget />
        </div>
      </div>

      {/* Bookmarks Section */}
      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-4 px-2">快捷网站</h3>
        <BookmarkWidget />
      </div>

    </div>
  );
}
