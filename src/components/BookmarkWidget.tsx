'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Globe, ExternalLink, Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export default function BookmarkWidget() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Failed to parse bookmarks', e);
      }
    } else {
      // Default bookmarks
      const defaults: Bookmark[] = [
        { id: '1', title: 'Google', url: 'https://google.com' },
        { id: '2', title: 'GitHub', url: 'https://github.com' },
        { id: '3', title: 'ChatGPT', url: 'https://chat.openai.com' },
      ];
      setBookmarks(defaults);
      localStorage.setItem('bookmarks', JSON.stringify(defaults));
    }
  }, []);

  const handleAddBookmark = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      url: formattedUrl,
    };

    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    
    // Reset and close
    setNewTitle('');
    setNewUrl('');
    setIsModalOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent link click
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const updated = bookmarks.filter(b => b.id !== deleteId);
      setBookmarks(updated);
      localStorage.setItem('bookmarks', JSON.stringify(updated));
      setDeleteId(null);
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full">
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="删除书签"
        description="确定要删除这个书签吗？"
        type="danger"
      />
      
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {bookmarks.map((bookmark) => (
          <a
            key={bookmark.id}
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center justify-center p-1.5 bg-white border border-slate-200 rounded-xl hover:shadow-sm hover:border-indigo-200 transition-all cursor-pointer aspect-square"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden mb-1">
              <img 
                src={getFaviconUrl(bookmark.url)} 
                alt={bookmark.title}
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
              <span className="hidden font-bold text-slate-400 text-xs">
                {bookmark.title.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <h4 className="font-medium text-slate-700 truncate text-[10px] text-center w-full px-0.5">{bookmark.title}</h4>

            <button
              onClick={(e) => handleDelete(e, bookmark.id)}
              className="absolute top-0.5 right-0.5 p-0.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={10} />
            </button>
          </a>
        ))}

        {/* Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center gap-1 p-1.5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl hover:bg-white hover:border-indigo-300 hover:shadow-sm transition-all aspect-square group"
        >
          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
            <Plus size={12} />
          </div>
          <span className="text-[10px] font-medium text-slate-500 group-hover:text-indigo-600">添加</span>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-slate-100 scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">添加新书签</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">网站名称</label>
                <input
                  type="text"
                  placeholder="例如：GitHub"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">网址 URL</label>
                <input
                  type="text"
                  placeholder="例如：github.com"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleAddBookmark}
                  disabled={!newTitle.trim() || !newUrl.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-200 text-xs"
                >
                  确认添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
