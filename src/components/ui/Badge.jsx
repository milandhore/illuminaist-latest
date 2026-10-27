const COLORS = {
  cyan:   'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 font-bold',
  amber:  'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold',
  slate:  'bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600/50 font-bold',
  red:    'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30 font-bold',
  green:  'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30 font-bold',
}

export default function Badge({ children, color = 'cyan', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase ${COLORS[color] || COLORS.slate} ${className}`}>
      {children}
    </span>
  )
}
