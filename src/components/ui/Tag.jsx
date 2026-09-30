export default function Tag({ children, active = false, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
        active
          ? 'bg-cyan text-obsidian shadow-[0_0_12px_rgba(0,240,255,0.4)]'
          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-cyan/40 hover:text-cyan'
      } ${className}`}
    >
      {children}
    </button>
  )
}
