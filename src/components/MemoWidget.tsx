'use client';

import { useState, useEffect } from 'react';
import { Save, ArrowRight, Hash, Clock, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Memo {
  id: string;
  content: string;
  tags: string[];
  createdAt: number;
}

export default function MemoWidget() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [newMemoContent, setNewMemoContent] = useState('');
  const router = useRouter();

  // Load memos on mount and listen to storage changes
  useEffect(() => {
    const loadMemos = () => {
      const savedMemos = localStorage.getItem('memos');
      if (savedMemos) {
        try {
          setMemos(JSON.parse(savedMemos));
        } catch (e) {
          console.error('Failed to parse memos', e);
        }
      }
    };

    loadMemos();

    // Listen for storage events (if updated in another tab/window)
    window.addEventListener('storage', loadMemos);
    return () => window.removeEventListener('storage', loadMemos);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">快速备忘</h3>
        <Link href="/memos" className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
          全部记录 <ArrowRight size={12} />
        </Link>
      </div>

      {/* Input */}
      <div className="relative mb-6">
        <textarea
          placeholder="记下你的想法... (Cmd+Enter 保存)"
          value={newMemoContent}
          onChange={e => setNewMemoContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm resize-none"
        />
        <button
          onClick={handleSave}
          disabled={!newMemoContent.trim()}
          className="absolute bottom-3 right-3 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          title="保存"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Recent List */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-[100px]">
        {memos.length > 0 ? (
          memos.slice(0, 3).map(memo => (
            <div key={memo.id} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group" onClick={() => router.push('/memos')}>
              <p className="text-sm text-slate-700 line-clamp-2 mb-2 font-medium">
                {memo.content}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {new Date(memo.createdAt).toLocaleDateString('zh-CN')}
                </span>
                {memo.tags.length > 0 && (
                  <div className="flex gap-1">
                    {memo.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm py-4">
            <p>暂无备忘</p>
          </div>
        )}
      </div>
    </div>
  );
}
