'use client';

import { useState } from 'react';
import { Camera, Save, X, Edit2, User, Lock, Mail } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '设计师',
    email: 'designer@nebula.com',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix',
    password: '',
    confirmPassword: ''
  });

  const [savedData, setSavedData] = useState({ ...formData });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, you would validate and send data to API here
    setSavedData({ ...formData, password: '', confirmPassword: '' });
    setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...savedData, password: '', confirmPassword: '' });
    setIsEditing(false);
  };

  return (
    <div className="p-6 w-full max-w-[1000px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">个人信息</h2>
            <p className="text-slate-500 text-sm mt-1">管理您的个人资料和账户安全设置</p>
        </div>
        {!isEditing ? (
            <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
                <Edit2 className="w-4 h-4" />
                <span>编辑资料</span>
            </button>
        ) : (
            <div className="flex gap-3">
                <button 
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    <X className="w-4 h-4" />
                    <span>取消</span>
                </button>
                <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                    <Save className="w-4 h-4" />
                    <span>保存更改</span>
                </button>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Avatar */}
        <div className="md:col-span-1">
            <div className="glass-card bg-white p-8 rounded-3xl flex flex-col items-center text-center">
                <div className="relative group w-32 h-32 mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-50 shadow-inner">
                        <img 
                            src={formData.avatar} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {isEditing && (
                        <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                            <Camera className="w-8 h-8" />
                        </button>
                    )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-1">{savedData.nickname}</h3>
                <p className="text-slate-500 text-sm mb-6">{savedData.email}</p>
                
                <div className="w-full pt-6 border-t border-slate-100 flex justify-between text-sm">
                    <div className="text-center flex-1 border-r border-slate-100">
                        <div className="font-bold text-slate-800">12</div>
                        <div className="text-slate-400 text-xs">项目</div>
                    </div>
                    <div className="text-center flex-1">
                        <div className="font-bold text-slate-800">85%</div>
                        <div className="text-slate-400 text-xs">效率</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column - Form */}
        <div className="md:col-span-2">
            <div className="glass-card bg-white p-8 rounded-3xl space-y-8">
                {/* Basic Info */}
                <section>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">基本信息</h4>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                昵称
                            </label>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    name="nickname"
                                    value={formData.nickname}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            ) : (
                                <div className="text-slate-800 px-4 py-2 bg-slate-50/50 rounded-xl border border-transparent">
                                    {savedData.nickname}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-400" />
                                邮箱地址
                            </label>
                            <div className="text-slate-800 px-4 py-2 bg-slate-50/50 rounded-xl border border-transparent flex justify-between items-center opacity-70">
                                <span>{savedData.email}</span>
                                {isEditing && <span className="text-xs text-slate-400 bg-slate-200 px-2 py-1 rounded">不可修改</span>}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-slate-100"></div>

                {/* Security */}
                <section>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">安全设置</h4>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-slate-400" />
                                密码
                            </label>
                            {isEditing ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        type="password" 
                                        name="password"
                                        placeholder="新密码"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                    <input 
                                        type="password" 
                                        name="confirmPassword"
                                        placeholder="确认新密码"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            ) : (
                                <div className="text-slate-800 px-4 py-2 bg-slate-50/50 rounded-xl border border-transparent tracking-widest">
                                    ••••••••••••
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
      </div>
    </div>
  );
}
