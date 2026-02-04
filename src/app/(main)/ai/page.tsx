'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Plus, MessageSquare, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

interface Session {
  id: string;
  title: string;
  date: string;
}

// Mock initial sessions
const MOCK_SESSIONS: Session[] = [
  { id: '1', title: 'React 组件优化', date: '今天' },
  { id: '2', title: 'Next.js 路由问题', date: '昨天' },
  { id: '3', title: 'Tailwind CSS 配置', date: '前天' },
];

// Mock initial messages for the current session
const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'ai',
    content: '你好！我是你的 AI 助手。有什么我可以帮你的吗？',
    timestamp: Date.now(),
  },
];

export default function AIPage() {
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [currentSessionId, setCurrentSessionId] = useState<string>('1');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle textarea auto-resize
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsStreaming(true);

    // Simulate AI response
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'ai',
      content: '',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMessage]);

    // Simulated streaming content
    const responseText = `这是一个模拟的流式回复。\n\n针对你的问题 "**${userMessage.content}**"，我有以下建议：\n\n1. **React Markdown**: 我们正在使用 \`react-markdown\` 来渲染这个回复。\n2. **Streaming**: 这里的文字是逐字显示的，模拟了真实的大模型输出效果。\n3. **Code Block**:\n\n\`\`\`javascript\nconsole.log("Hello AI!");\nconst sum = (a, b) => a + b;\n\`\`\`\n\n希望这对你有帮助！如果有其他问题，请随时提问。`;
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < responseText.length) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: responseText.slice(0, i + 1) }
              : msg
          )
        );
        i++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 30); // Adjust speed here
  };

  const handleNewSession = () => {
    const newSessionId = Date.now().toString();
    const newSession: Session = {
      id: newSessionId,
      title: '新对话',
      date: '刚刚',
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSessionId);
    setMessages([
      {
        id: Date.now().toString(),
        role: 'ai',
        content: '你好！我是你的 AI 助手。有什么我可以帮你的吗？',
        timestamp: Date.now(),
      },
    ]);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(sessions.filter((s) => s.id !== id));
    if (currentSessionId === id && sessions.length > 0) {
      setCurrentSessionId(sessions[0].id);
    }
  };

  return (
    <div className="flex h-full bg-white">
      {/* Left Sidebar - History Sessions */}
      <div className="w-64 border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-4">
          <button
            onClick={handleNewSession}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span className="font-medium">新对话</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setCurrentSessionId(session.id)}
              className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                currentSessionId === session.id
                  ? 'bg-white shadow-sm ring-1 ring-slate-200 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare size={18} className={currentSessionId === session.id ? 'text-indigo-600' : 'text-slate-400'} />
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-sm font-medium">{session.title}</span>
                  <span className="text-xs text-slate-400">{session.date}</span>
                </div>
              </div>
              <button
                onClick={(e) => handleDeleteSession(e, session.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content - Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              
              <div
                className={`flex flex-col max-w-[80%] ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-2xl px-5 py-3.5 shadow-sm text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-50 border border-slate-100 text-slate-800'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="prose prose-sm max-w-none prose-slate">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="max-w-4xl mx-auto relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题..."
              rows={1}
              className="w-full resize-none pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all max-h-40"
              disabled={isStreaming}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isStreaming}
              className={`absolute right-2 bottom-2 p-2 rounded-lg transition-all ${
                inputValue.trim() && !isStreaming
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isStreaming ? (
                <div className="animate-spin w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">
            AI 可能生成不准确的信息，请核对重要事实。
          </p>
        </div>
      </div>
    </div>
  );
}
