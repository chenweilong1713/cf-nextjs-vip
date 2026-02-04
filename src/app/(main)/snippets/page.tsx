'use client';

import { useState } from 'react';
import { Search, Code, ChevronDown, ChevronUp, Copy, Check, Hash, Calendar, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
  createdAt: string;
}

const MOCK_SNIPPETS: Snippet[] = [
  {
    id: '1',
    title: 'React UseDebounce Hook',
    description: 'A custom hook to debounce value changes.',
    language: 'markdown',
    tags: ['react', 'hooks', 'typescript'],
    createdAt: '2024-03-20',
    code: `\`\`\`typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
\`\`\``
  },
  {
    id: '2',
    title: 'Tailwind CSS Glassmorphism',
    description: 'Utility classes for glassmorphism effect.',
    language: 'markdown',
    tags: ['tailwind', 'css', 'ui'],
    createdAt: '2024-03-19',
    code: `\`\`\`css
.glass-panel {
  @apply bg-white/30 backdrop-blur-md border border-white/20 shadow-xl;
}
\`\`\`

<!-- Or directly in HTML -->
\`\`\`html
<div class="bg-white/30 backdrop-blur-md border border-white/20 shadow-xl">...</div>
\`\`\``
  },
  {
    id: '3',
    title: 'Next.js API Route Handler',
    description: 'Basic structure for a Next.js App Router API route.',
    language: 'markdown',
    tags: ['nextjs', 'api', 'backend'],
    createdAt: '2024-03-18',
    code: `\`\`\`typescript
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  return NextResponse.json({ 
    data: { id, message: 'Success' } 
  });
}
\`\`\``
  },
  {
    id: '4',
    title: 'Python List Comprehension',
    description: 'Examples of efficient list processing in Python.',
    language: 'markdown',
    tags: ['python', 'basics'],
    createdAt: '2024-03-15',
    code: `\`\`\`python
# Basic list comprehension
squares = [x**2 for x in range(10)]

# With condition
evens = [x for x in range(20) if x % 2 == 0]

# Nested
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
\`\`\``
  },
  {
    id: '5',
    title: 'JavaScript Deep Clone',
    description: 'Deep clone an object using structuredClone.',
    language: 'markdown',
    tags: ['javascript', 'utils'],
    createdAt: '2024-03-10',
    code: `\`\`\`javascript
const original = {
  name: 'John',
  date: new Date(),
  nested: { items: [1, 2] }
};

// Modern way (supported in most modern browsers and Node.js)
const clone = structuredClone(original);

console.log(clone !== original); // true
console.log(clone.nested !== original.nested); // true
\`\`\``
  }
];

const ITEMS_PER_PAGE = 9;

function SnippetCard({ snippet }: { snippet: Snippet }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <Code size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-800 text-lg truncate" title={snippet.title}>{snippet.title}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1 shrink-0">
                  <Calendar size={12} />
                  {snippet.createdAt}
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded-full font-medium uppercase text-[10px] tracking-wider shrink-0">
                  {snippet.language}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-indigo-600 p-1 rounded-md hover:bg-slate-50 transition-colors shrink-0"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2" title={snippet.description}>{snippet.description}</p>

        <div className="flex flex-wrap gap-2 mb-2">
          {snippet.tags.map(tag => (
            <span key={tag} className="flex items-center text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              <Hash size={10} className="mr-1 opacity-50" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50 relative group">
          <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={handleCopy}
              className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-indigo-600 shadow-sm transition-all"
              title="复制代码"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
          </div>
          <div className="p-5 prose prose-sm max-w-none prose-slate">
            <ReactMarkdown
              components={{
                code(props) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                     <code {...rest} className={className}>
                       {children}
                     </code>
                  ) : (
                    <code {...rest} className={`${className} bg-white/50 px-1 py-0.5 rounded text-indigo-600`}>
                      {children}
                    </code>
                  )
                },
                pre(props) {
                    const { children, ...rest } = props;
                    return (
                    <pre {...rest} className="bg-slate-900 text-slate-50 rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                      {children}
                    </pre>
                  )
                }
              }}
            >
              {snippet.code}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SnippetsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [snippets, setSnippets] = useState<Snippet[]>(MOCK_SNIPPETS);
  
  // New Snippet State
  const [newSnippetContent, setNewSnippetContent] = useState('');

  const handleSave = () => {
    if (!newSnippetContent.trim()) {
      alert('请输入代码内容');
      return;
    }

    // Parse tags from content (#tag)
    const tagRegex = /#(\S+)/g;
    const tags: string[] = [];
    let match;
    while ((match = tagRegex.exec(newSnippetContent)) !== null) {
      tags.push(match[1]);
    }

    // Remove tags from content for cleaner display if needed, 
    // but user might want to keep them in the text. 
    // Let's keep the original content as the 'code' (markdown content).
    
    // Generate title from first line
    const lines = newSnippetContent.split('\n');
    let title = lines[0].replace(/#\S+/g, '').trim();
    if (!title) title = '无标题片段';
    if (title.length > 50) title = title.substring(0, 50) + '...';

    // Generate description from first few lines (excluding title line potentially)
    // Or just use the content itself as description source
    const description = lines.slice(0, 3).join(' ').replace(/#\S+/g, '').trim().substring(0, 150) + (newSnippetContent.length > 150 ? '...' : '');

    const snippet: Snippet = {
      id: Date.now().toString(),
      title: title,
      description: description || '无描述',
      language: 'markdown', // Default to markdown as it contains mixed content
      code: newSnippetContent,
      tags: tags.length > 0 ? tags : ['uncategorized'],
      createdAt: new Date().toLocaleDateString('zh-CN'),
    };

    setSnippets([snippet, ...snippets]);
    setNewSnippetContent('');
  };

  const filteredSnippets = snippets.filter(snippet => 
    snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredSnippets.length / ITEMS_PER_PAGE);
  const paginatedSnippets = filteredSnippets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">代码片段</h1>
          <p className="text-slate-500 mt-1">管理和收藏你的常用代码块</p>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">新建片段</h2>
        <div className="space-y-4">
          <textarea
            placeholder="在此输入内容... 使用 #标签 来添加分类 (e.g. #javascript #tips)"
            value={newSnippetContent}
            onChange={e => setNewSnippetContent(e.target.value)}
            className="w-full h-40 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm resize-y"
          />

          <div className="flex items-center justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-all shadow-sm shadow-indigo-200"
            >
              <Save size={18} />
              <span className="font-medium">保存</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="搜索片段名称、描述或标签..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
        />
      </div>

      {/* Snippets Grid */}
      <div className="flex flex-wrap -mx-3">
        {paginatedSnippets.length > 0 ? (
          paginatedSnippets.map(snippet => (
            <div key={snippet.id} className="w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
              <SnippetCard snippet={snippet} />
            </div>
          ))
        ) : (
          <div className="w-full px-3">
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
              <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
                <Search className="text-slate-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-700">未找到相关片段</h3>
              <p className="text-slate-500 mt-1">尝试更换关键词搜索</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            上一页
          </button>
          <span className="text-sm text-slate-600 font-medium px-2">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
