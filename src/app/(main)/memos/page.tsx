'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Save, Hash, Calendar, Trash2, Clock, Bookmark, Filter, X, ChevronRight, MoreHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ConfirmDialog from '@/components/ConfirmDialog';

export interface Memo {
  id: string;
  content: string;
  tags: string[];
  createdAt: number;
}

export default function MemosPage() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [newMemoContent, setNewMemoContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newMemoContent]);

  // Load memos from localStorage on mount
  useEffect(() => {
    const savedMemos = localStorage.getItem('memos');
    if (savedMemos) {
      try {
        setMemos(JSON.parse(savedMemos));
      } catch (e) {
        console.error('Failed to parse memos', e);
      }
    }
  }, []);

  const handleSave = () => {
    if (!newMemoContent.trim()) return;

    // Parse tags
    const tagRegex = /#(\S+)/g;
    const tags: string[] = [];
    let match;
    while ((match = tagRegex.exec(newMemoContent)) !== null) {
      tags.push(match[1]);
    }

    const newMemo: Memo = {
      id: Date.now().toString(),
      content: newMemoContent,
      tags: tags,
      createdAt: Date.now(),
    };

    const updatedMemos = [newMemo, ...memos];
    setMemos(updatedMemos);
    localStorage.setItem('memos', JSON.stringify(updatedMemos));
    setNewMemoContent('');
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const updatedMemos = memos.filter(m => m.id !== deleteId);
      setMemos(updatedMemos);
      localStorage.setItem('memos', JSON.stringify(updatedMemos));
      setDeleteId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  // Derived state
  const filteredMemos = useMemo(() => {
    return memos.filter(memo => {
      const matchesSearch = memo.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            memo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = selectedTag ? memo.tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [memos, searchQuery, selectedTag]);

  // Statistics
  const stats = useMemo(() => {
    const totalMemos = memos.length;
    const daysActive = new Set(memos.map(m => new Date(m.createdAt).toDateString())).size;
    const totalTags = new Set(memos.flatMap(m => m.tags)).size;
    return { totalMemos, daysActive, totalTags };
  }, [memos]);

  // Tags aggregation
  const allTags = useMemo(() => {
    const counts: Record<string, number> = {};
    memos.forEach(memo => {
      memo.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [memos]);

  // Heatmap data (Last 20 weeks)
  const heatmapData = useMemo(() => {
    const today = new Date();
    const data: { date: string; count: number; level: number }[] = [];
    const map: Record<string, number> = {};

    memos.forEach(m => {
      const dateStr = new Date(m.createdAt).toDateString();
      map[dateStr] = (map[dateStr] || 0) + 1;
    });

    // Generate last 140 days (20 weeks)
    for (let i = 139; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const count = map[dateStr] || 0;
      let level = 0;
      if (count > 0) level = 1;
      if (count > 2) level = 2;
      if (count > 5) level = 3;
      if (count > 8) level = 4;
      
      data.push({ date: dateStr, count, level });
    }
    return data;
  }, [memos]);

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 p-6 w-full min-h-full">
      
      {/* Left Sidebar */}
      <aside className="w-full md:w-72 flex-shrink-0 space-y-6 md:sticky md:top-6">
        {/* Heatmap Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
               <Calendar size={16} />
             </div>
             <h2 className="font-bold text-slate-800">记录统计</h2>
           </div>

           <div className="grid grid-cols-3 gap-2 mb-6">
             <div className="text-center p-2 bg-slate-50 rounded-xl">
               <div className="text-lg font-bold text-slate-800">{stats.totalMemos}</div>
               <div className="text-[10px] text-slate-500">笔记</div>
             </div>
             <div className="text-center p-2 bg-slate-50 rounded-xl">
               <div className="text-lg font-bold text-slate-800">{stats.totalTags}</div>
               <div className="text-[10px] text-slate-500">标签</div>
             </div>
             <div className="text-center p-2 bg-slate-50 rounded-xl">
               <div className="text-lg font-bold text-slate-800">{stats.daysActive}</div>
               <div className="text-[10px] text-slate-500">活跃天</div>
             </div>
           </div>

           {/* Mini Heatmap Grid */}
           <div className="flex flex-wrap gap-1 justify-center">
             {heatmapData.map((day, i) => (
               <div 
                 key={i}
                 title={`${day.date}: ${day.count} memos`}
                 className={`w-2.5 h-2.5 rounded-sm transition-colors ${
                   day.level === 0 ? 'bg-slate-100' :
                   day.level === 1 ? 'bg-indigo-200' :
                   day.level === 2 ? 'bg-indigo-300' :
                   day.level === 3 ? 'bg-indigo-400' :
                   'bg-indigo-600'
                 }`}
               />
             ))}
           </div>
           <div className="flex justify-end items-center gap-1 mt-2 text-[10px] text-slate-400">
             <span>Less</span>
             <div className="w-2 h-2 bg-slate-100 rounded-sm"></div>
             <div className="w-2 h-2 bg-indigo-200 rounded-sm"></div>
             <div className="w-2 h-2 bg-indigo-400 rounded-sm"></div>
             <div className="w-2 h-2 bg-indigo-600 rounded-sm"></div>
             <span>More</span>
           </div>
        </div>

        {/* Tags List */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-3 pb-2 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">全部标签</h3>
            {selectedTag && (
              <button 
                onClick={() => setSelectedTag(null)}
                className="text-[10px] bg-slate-100 px-2 py-1 rounded-full text-slate-500 hover:bg-slate-200 flex items-center gap-1"
              >
                清除筛选 <X size={10} />
              </button>
            )}
          </div>
          
          <div className="space-y-1">
            {/* Special 'code' bookmark */}
            {allTags.find(t => t[0] === 'code') && (
               <button
                 onClick={() => setSelectedTag(selectedTag === 'code' ? null : 'code')}
                 className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-sm group ${
                   selectedTag === 'code' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'
                 }`}
               >
                 <div className="flex items-center gap-2">
                   <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${selectedTag === 'code' ? 'bg-indigo-200 text-indigo-700' : 'bg-orange-100 text-orange-500'}`}>
                     <Bookmark size={12} />
                   </div>
                   <span className="font-medium">书签 (#code)</span>
                 </div>
                 <span className="text-xs text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-slate-100 shadow-sm">
                    {allTags.find(t => t[0] === 'code')?.[1]}
                 </span>
               </button>
            )}

            {allTags.filter(t => t[0] !== 'code').map(([tag, count]) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-sm group ${
                  selectedTag === tag ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Hash size={14} className={selectedTag === tag ? 'text-indigo-400' : 'text-slate-300'} />
                  <span>{tag}</span>
                </div>
                <ChevronRight size={14} className={`text-slate-300 transition-transform ${selectedTag === tag ? 'rotate-90 text-indigo-400' : 'group-hover:translate-x-1'}`} />
              </button>
            ))}

            {allTags.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                暂无标签
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Right Content */}
      <div className="flex-1 min-w-0 space-y-6">
        
        <ConfirmDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title="删除笔记"
          description="确定要删除这条笔记吗？此操作无法撤销。"
          type="danger"
        />

        {/* Input Area */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-50">
             <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
             <span className="text-sm font-bold text-slate-700">Inbox 笔记</span>
             <div className="ml-auto flex gap-2">
                {/* Toolbar placeholders */}
             </div>
          </div>
          <textarea
            ref={textareaRef}
            placeholder="记录你的想法... (支持 Markdown, 使用 #tag 添加标签)"
            value={newMemoContent}
            onChange={e => setNewMemoContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[120px] bg-transparent border-none focus:ring-0 p-2 text-slate-700 placeholder:text-slate-300 text-sm resize-none font-medium leading-relaxed caret-indigo-600"
          />
          <div className="flex justify-between items-center mt-2 pt-2">
            <div className="text-xs text-slate-400 flex gap-2">
               <span className="px-2 py-1 bg-slate-50 rounded text-slate-500 border border-slate-100">Markdown</span>
               <span className="px-2 py-1 bg-slate-50 rounded text-slate-500 border border-slate-100">Cmd + Enter 保存</span>
            </div>
            <button
              onClick={handleSave}
              disabled={!newMemoContent.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-1.5 rounded-lg transition-all text-sm font-medium shadow-sm shadow-indigo-200"
            >
              保存
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="搜索笔记..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
        </div>

        {/* Memo List */}
        <div className="space-y-4">
          {filteredMemos.length > 0 ? (
            filteredMemos.map(memo => (
              <div key={memo.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all group">
                <div className="prose prose-sm prose-slate max-w-none mb-3">
                  <ReactMarkdown>{memo.content}</ReactMarkdown>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                   <div className="flex items-center gap-3">
                     {memo.tags.map(tag => (
                       <span 
                         key={tag} 
                         className={`text-xs px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${
                           tag === 'code' 
                             ? 'bg-orange-50 text-orange-600' 
                             : 'bg-indigo-50 text-indigo-600'
                         }`}
                       >
                         {tag === 'code' && <Bookmark size={10} />}
                         #{tag}
                       </span>
                     ))}
                     <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(memo.createdAt).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                     </span>
                   </div>

                   <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDelete(memo.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreHorizontal size={14} />
                      </button>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <Filter size={20} />
              </div>
              <p className="text-sm">没有找到相关笔记</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
