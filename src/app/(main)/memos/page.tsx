'use client';

import { useState, useEffect } from 'react';
import { Search, Save, Hash, Calendar, Trash2, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
    if (confirm('确定要删除这条备忘录吗？')) {
      const updatedMemos = memos.filter(m => m.id !== id);
      setMemos(updatedMemos);
      localStorage.setItem('memos', JSON.stringify(updatedMemos));
    }
  };

  const filteredMemos = memos.filter(memo => 
    memo.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">备忘录</h1>
          <p className="text-slate-500 mt-1">随时记录你的想法和待办事项</p>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <textarea
          placeholder="在此输入内容... 使用 #标签 来添加分类 (e.g. #todo #idea)"
          value={newMemoContent}
          onChange={e => setNewMemoContent(e.target.value)}
          className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm resize-y mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={!newMemoContent.trim()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-all shadow-sm shadow-indigo-200"
          >
            <Save size={18} />
            <span className="font-medium">保存记录</span>
          </button>
        </div>
      </div>

      {/* Search & List */}
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="搜索备忘录内容或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredMemos.length > 0 ? (
            filteredMemos.map(memo => (
              <div key={memo.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow group relative">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => handleDelete(memo.id)}
                     className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
                
                <div className="prose prose-sm max-w-none prose-slate mb-4">
                  <ReactMarkdown>{memo.content}</ReactMarkdown>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(memo.createdAt).toLocaleString('zh-CN')}
                  </span>
                  
                  {memo.tags.length > 0 && (
                    <div className="flex gap-2">
                      {memo.tags.map(tag => (
                        <span key={tag} className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
                          <Hash size={10} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
              <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
                <Calendar className="text-slate-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-700">暂无备忘录</h3>
              <p className="text-slate-500 mt-1">开始记录你的第一条备忘吧</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
