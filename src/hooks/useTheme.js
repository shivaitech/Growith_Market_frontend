import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'growith-dashboard-theme'

/**
 * Dashboard theme hook.
 * - 'dark' (default) or 'light'
 * - Persists to localStorage
 * - Applies `data-theme` attribute to <body>
 * - Emits window "growith:theme-change" event for other components
 */
export default function useTheme() {
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'light' || stored === 'dark') return stored
    } catch { /* ignore */ }
    return 'dark'
  })

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.setAttribute('data-theme', theme)
    try { localStorage.setItem(STORAGE_KEY, theme) } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent('growith:theme-change', { detail: theme }))
    return () => {
      // Only clear on unmount if dashboard is closing entirely — leave attribute so
      // other visits stay themed.
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    if (next === 'light' || next === 'dark') setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, setTheme, toggleTheme, isLight: theme === 'light', isDark: theme === 'dark' }
}
