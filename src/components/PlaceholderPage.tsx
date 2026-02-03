export default function PlaceholderPage({ title, moduleName }: { title: string; moduleName: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-slate-400 animate-in fade-in zoom-in duration-300">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-soft">
        <span className="text-4xl">🚧</span>
      </div>
      <h2 className="text-xl font-bold text-slate-600 mb-2">{title}</h2>
      <p>当前模块: <span className="font-mono text-indigo-500">{moduleName}</span></p>
    </div>
  );
}
