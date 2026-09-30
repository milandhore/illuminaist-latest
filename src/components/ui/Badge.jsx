const COLORS = {
  cyan:   'bg-cyan-500/10 text-cyan border border-cyan-500/30',
  amber:  'bg-amber-500/10 text-amber border border-amber-500/30',
  slate:  'bg-slate-700/50 text-slate-300 border border-slate-600/50',
  red:    'bg-red-500/10 text-red-400 border border-red-500/30',
  green:  'bg-green-500/10 text-green-400 border border-green-500/30',
}

export default function Badge({ children, color = 'cyan', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase ${COLORS[color] || COLORS.slate} ${className}`}>
      {children}
    </span>
  )
}
