'use client';

import { X, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = '确认操作',
  description = '您确定要执行此操作吗？此操作无法撤销。',
  confirmText = '确认',
  cancelText = '取消',
  type = 'danger'
}: ConfirmDialogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to allow render before animation starts
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      // Wait for animation to finish before unmounting
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const typeStyles = {
    danger: {
      icon: AlertCircle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-50',
      buttonBg: 'bg-red-600 hover:bg-red-700',
      buttonText: 'text-white'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      buttonBg: 'bg-amber-500 hover:bg-amber-600',
      buttonText: 'text-white'
    },
    info: {
      icon: Info,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
      buttonText: 'text-white'
    }
  };

  const currentStyle = typeStyles[type];
  const Icon = currentStyle.icon;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Dialog */}
      <div 
        className={`bg-white rounded-2xl w-full max-w-sm shadow-xl border border-slate-100 transform transition-all duration-200 relative z-10 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
      >
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${currentStyle.iconBg}`}>
              <Icon className={`w-5 h-5 ${currentStyle.iconColor}`} />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {description}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:bg-slate-50 p-1 rounded-full transition-colors -mr-2 -mt-2"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all shadow-sm ${currentStyle.buttonBg} ${currentStyle.buttonText}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
