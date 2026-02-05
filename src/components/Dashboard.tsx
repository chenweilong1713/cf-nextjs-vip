'use client';

import { MoreHorizontal, ArrowUpRight } from 'lucide-react';
import MemoWidget from './MemoWidget';
import TodoWidget from './TodoWidget';
import BookmarkWidget from './BookmarkWidget';

export default function Dashboard() {
  return (
    <div className="p-4 space-y-4 w-full max-w-[1400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Section: Todo + Memo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         <div className="lg:col-span-2 h-[360px]">
            <TodoWidget />
         </div>
         <div className="lg:col-span-1 h-[360px]">
           <MemoWidget />
        </div>
      </div>

      {/* Bookmarks Section */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 px-1">常用书签</h3>
        <BookmarkWidget />
      </div>

    </div>
  );
}
