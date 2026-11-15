import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

function getInitialTheme() {
  // 1. Check localStorage
  const saved = localStorage.getItem('illuminaist_theme')
  if (saved === 'light' || saved === 'dark') return saved
  // Default to dark for first-time visitors, regardless of OS preference.
  return 'dark'
}

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.setAttribute('data-theme', 'dark')
  } else {
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
  }
  localStorage.setItem('illuminaist_theme', theme)
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const t = getInitialTheme()
    applyTheme(t)
    return t
  })

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200
        text-slate-400 hover:text-amber bg-transparent hover:bg-slate-800/60 dark:hover:bg-slate-800/60"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`${theme === 'dark' ? 'Light' : 'Dark'} mode`}
    >
      {theme === 'dark'
        ? <Sun size={18} />
        : <Moon size={18} />
      }
    </button>
  )
}
