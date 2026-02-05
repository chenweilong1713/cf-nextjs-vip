'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Todo {
  id: string;
  title: string;
  category: string;
  deadline: string;
  status: 'pending' | 'completed';
  createdAt: number;
}

export default function TodoWidget() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const router = useRouter();

  // Load from localStorage
  useEffect(() => {
    const loadTodos = () => {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        try {
          setTodos(JSON.parse(savedTodos));
        } catch (e) {
          console.error('Failed to parse todos', e);
        }
      }
    };
    
    loadTodos();
    window.addEventListener('storage', loadTodos);
    return () => window.removeEventListener('storage', loadTodos);
  }, []);

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) return;

    const today = new Date().toISOString().split('T')[0];
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: newTodoTitle,
      category: 'work', // Default category
      deadline: today, // Default deadline is today
      status: 'pending',
      createdAt: Date.now(),
    };

    const newTodos = [newTodo, ...todos];
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    setNewTodoTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const toggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTodos = todos.map(todo => 
      todo.id === id 
        ? { ...todo, status: todo.status === 'pending' ? 'completed' : 'pending' } as Todo
        : todo
    );
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  // Filter pending tasks, sort by deadline
  const pendingTodos = todos
    .filter(t => t.status === 'pending')
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 4);

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-bold text-slate-800">今日待办</h3>
        <Link href="/plans" className="text-[10px] text-indigo-600 font-medium hover:underline flex items-center gap-1">
          管理计划 <ArrowRight size={10} />
        </Link>
      </div>

      {/* Quick Add */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="添加新任务... (Enter)"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
        />
        <button
          onClick={handleAddTodo}
          disabled={!newTodoTitle.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Todo List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 min-h-[100px]">
        {pendingTodos.length > 0 ? (
          pendingTodos.map(todo => {
             const isOverdue = todo.deadline < new Date().toISOString().split('T')[0];
             
             return (
              <div key={todo.id} className="flex items-start gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-colors group">
                <button 
                  onClick={(e) => toggleStatus(todo.id, e)}
                  className="mt-0.5 text-slate-300 hover:text-indigo-500 transition-colors shrink-0"
                >
                  <Circle size={14} />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-700 font-medium truncate">{todo.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[9px] ${isOverdue ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                      {isOverdue ? '已逾期' : todo.deadline === new Date().toISOString().split('T')[0] ? '今天截止' : todo.deadline}
                    </span>
                    <span className="text-[9px] text-slate-400 bg-slate-100 px-1 rounded">
                      {todo.category === 'work' ? '工作' : todo.category === 'personal' ? '个人' : todo.category === 'study' ? '学习' : '紧急'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs py-4">
             <Calendar size={20} className="mb-2 opacity-50" />
             <p>暂无待办事项</p>
          </div>
        )}
      </div>
    </div>
  );
}
