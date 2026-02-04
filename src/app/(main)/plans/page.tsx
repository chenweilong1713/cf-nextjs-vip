'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, CheckCircle2, Circle, Clock, Trash2, AlertCircle, Filter, Tag } from 'lucide-react';

export interface Todo {
  id: string;
  title: string;
  category: string;
  deadline: string; // YYYY-MM-DD
  status: 'pending' | 'completed';
  createdAt: number;
}

const CATEGORIES = [
  { id: 'work', label: '工作', color: 'bg-blue-100 text-blue-700' },
  { id: 'personal', label: '个人', color: 'bg-green-100 text-green-700' },
  { id: 'study', label: '学习', color: 'bg-purple-100 text-purple-700' },
  { id: 'urgent', label: '紧急', color: 'bg-red-100 text-red-700' },
];

export default function PlansPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  
  // New Todo State
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('work');
  const [newTodoDeadline, setNewTodoDeadline] = useState('');

  // Load from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error('Failed to parse todos', e);
      }
    }
    // Set default deadline to today
    const today = new Date().toISOString().split('T')[0];
    setNewTodoDeadline(today);
  }, []);

  const saveTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: newTodoTitle,
      category: newTodoCategory,
      deadline: newTodoDeadline,
      status: 'pending',
      createdAt: Date.now(),
    };

    saveTodos([newTodo, ...todos]);
    setNewTodoTitle('');
    // Reset deadline to today
    const today = new Date().toISOString().split('T')[0];
    setNewTodoDeadline(today);
  };

  const toggleStatus = (id: string) => {
    const newTodos = todos.map(todo => 
      todo.id === id 
        ? { ...todo, status: todo.status === 'pending' ? 'completed' : 'pending' } as Todo
        : todo
    );
    saveTodos(newTodos);
  };

  const deleteTodo = (id: string) => {
    if (confirm('确定要删除这个计划吗？')) {
      const newTodos = todos.filter(todo => todo.id !== id);
      saveTodos(newTodos);
    }
  };

  const getCategoryColor = (catId: string) => {
    return CATEGORIES.find(c => c.id === catId)?.color || 'bg-slate-100 text-slate-700';
  };

  const getCategoryLabel = (catId: string) => {
    return CATEGORIES.find(c => c.id === catId)?.label || catId;
  };

  const isOverdue = (deadline: string, status: string) => {
    if (status === 'completed') return false;
    const today = new Date().toISOString().split('T')[0];
    return deadline < today;
  };

  const isDueSoon = (deadline: string, status: string) => {
    if (status === 'completed') return false;
    const today = new Date().toISOString().split('T')[0];
    return deadline === today;
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'pending') return todo.status === 'pending';
    if (filter === 'completed') return todo.status === 'completed';
    return todo.category === filter;
  });

  // Sort: Overdue first, then due soon, then pending, then completed
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.status === b.status) {
       // If both pending, check deadlines
       if (a.status === 'pending') {
         return a.deadline.localeCompare(b.deadline);
       }
       // If both completed, check created time (newest first)
       return b.createdAt - a.createdAt;
    }
    return a.status === 'pending' ? -1 : 1;
  });

  const stats = {
    total: todos.length,
    pending: todos.filter(t => t.status === 'pending').length,
    completed: todos.filter(t => t.status === 'completed').length,
    overdue: todos.filter(t => isOverdue(t.deadline, t.status)).length
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">计划管理</h1>
          <p className="text-slate-500 mt-1">制定目标，追踪进度，高效完成任务</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
              <span className="text-xs text-slate-500 font-medium">待办</span>
              <span className="text-xl font-bold text-indigo-600">{stats.pending}</span>
           </div>
           <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
              <span className="text-xs text-slate-500 font-medium">已完成</span>
              <span className="text-xl font-bold text-emerald-600">{stats.completed}</span>
           </div>
           <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
              <span className="text-xs text-slate-500 font-medium">逾期</span>
              <span className="text-xl font-bold text-red-600">{stats.overdue}</span>
           </div>
        </div>
      </div>

      {/* Add New Todo */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-indigo-600" />
          新建计划
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="准备做什么？"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="w-full md:w-40">
            <select
              value={newTodoCategory}
              onChange={e => setNewTodoCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-48">
            <input
              type="date"
              value={newTodoDeadline}
              onChange={e => setNewTodoDeadline(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            />
          </div>
          <button
            onClick={handleAddTodo}
            disabled={!newTodoTitle.trim()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-sm font-medium whitespace-nowrap"
          >
            添加任务
          </button>
        </div>
      </div>

      {/* Filters & List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-4 flex overflow-x-auto gap-2 scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'pending' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            待办
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'completed' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            已完成
          </button>
          <div className="w-px h-6 bg-slate-200 mx-2 self-center shrink-0"></div>
          {CATEGORIES.map(cat => (
             <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filter === cat.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="divide-y divide-slate-100">
          {sortedTodos.length > 0 ? (
            sortedTodos.map(todo => {
              const overdue = isOverdue(todo.deadline, todo.status);
              const dueSoon = isDueSoon(todo.deadline, todo.status);
              
              return (
                <div key={todo.id} className={`p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group ${todo.status === 'completed' ? 'opacity-60' : ''}`}>
                  <button 
                    onClick={() => toggleStatus(todo.id)}
                    className={`shrink-0 transition-colors ${
                      todo.status === 'completed' ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'
                    }`}
                  >
                    {todo.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium text-slate-800 truncate ${todo.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                        {todo.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium shrink-0 ${getCategoryColor(todo.category)}`}>
                        {getCategoryLabel(todo.category)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`flex items-center gap-1 ${
                        overdue ? 'text-red-600 font-bold' : dueSoon ? 'text-amber-600 font-bold' : 'text-slate-400'
                      }`}>
                        {overdue && <AlertCircle size={12} />}
                        {dueSoon && <Clock size={12} />}
                        <Calendar size={12} className={!overdue && !dueSoon ? 'opacity-70' : ''} />
                        {todo.deadline}
                        {overdue && ' (已逾期)'}
                        {dueSoon && ' (今天截止)'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4 text-slate-300">
                <Filter size={24} />
              </div>
              <p className="text-slate-500">没有找到相关计划</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
