import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { faBookOpen, faHouse, faPlus, faMoon, faSun, faLock, faDownload, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Icon } from '@/shared/components/Icon'
import { useJournals } from '@/features/journal/hooks/journalContext'
import { readTheme, saveTheme } from '@/infrastructure/storage/preferencesService'
import { errorMessage } from '@/shared/services/logger'
import { displayDate, todayKey } from '@/shared/utils/dates'

const navigation = [
  { to: '/', label: 'Overview', icon: faHouse },
  { to: '/journals', label: 'Journal archive', icon: faBookOpen },
  { to: '/new', label: 'New reflection', icon: faPlus },
]

export function AppLayout() {
  const { entries, error, loading, notice, reload, dismissNotice } = useJournals()
  const [theme, setTheme] = useState(readTheme)
  const [themeError, setThemeError] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.getElementById('main-content')?.focus()
  }, [location.pathname])

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    try {
      saveTheme(next)
      setTheme(next)
      setThemeError(null)
    } catch (caught) {
      setThemeError(errorMessage(caught))
    }
  }

  function exportBackup() {
    const backup = { format: 'daily-dots', version: 1, exportedAt: new Date().toISOString(), entries }
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `daily-dots-${todayKey()}.json`
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
      <a href="#main-content" className="sr-only z-50 rounded-lg bg-surface p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-5 px-5 py-5 sm:px-8 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:px-12">
        <NavLink to="/" className="flex items-center gap-3 justify-self-start rounded-lg">
          <span className="grid h-10 w-10 shrink-0 grid-cols-2 gap-1.5 rounded-xl bg-primary p-2.5" aria-hidden="true"><i className="rounded-full bg-white dark:bg-canvas" /><i className="rounded-full bg-white dark:bg-canvas" /><i className="rounded-full bg-white dark:bg-canvas" /><i className="rounded-full bg-white/40 dark:bg-canvas/40" /></span>
          <span><span className="block text-xl font-bold tracking-tight">Daily Dots</span><span className="block text-[10px] tracking-wide text-muted">NOTICE. WRITE. REVISIT.</span></span>
        </NavLink>
        <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-30 flex gap-1 border-t border-line bg-surface px-3 pb-[env(safe-area-inset-bottom)] pt-2 shadow-soft md:static md:col-span-2 md:row-start-2 md:justify-center md:gap-2 md:rounded-2xl md:border md:bg-canvas md:p-1.5 md:shadow-none lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:justify-self-center">
          {navigation.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `flex min-h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-[11px] font-medium md:min-h-11 md:flex-none md:flex-row md:gap-2 md:whitespace-nowrap md:px-4 md:text-sm ${isActive ? 'bg-accent-soft text-primary' : 'text-muted hover:bg-accent-soft hover:text-ink'}`}>
              <Icon icon={icon} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
          <div className="col-start-2 row-start-1 flex items-center gap-4 lg:col-start-3">
            <span className="hidden text-xs text-muted sm:block">{displayDate(todayKey(), 'EEEE, MMMM d')}</span>
            <button onClick={toggleTheme} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-accent-soft text-primary hover:bg-accent-alt" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}><Icon icon={theme === 'light' ? faMoon : faSun} /></button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-6 sm:px-8 lg:px-12">
          <div><p className="eyebrow mb-1">Your notebook</p><p className="text-xs text-muted sm:text-sm">A fresh perspective, one page at a time.</p></div>
          <button onClick={exportBackup} disabled={loading || !!error} className="button-secondary text-xs"><Icon icon={faDownload} />Download JSON backup</button>
        </div>
        <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-5 py-8 outline-none sm:px-8 lg:px-12 lg:py-10">
          {themeError && <p role="alert" className="mb-5 rounded-xl border border-line bg-rose p-4 text-sm">{themeError}</p>}
          {loading ? <p role="status" className="py-16 text-center text-muted">Opening your journal…</p> : error ? (
            <div role="alert" className="card mx-auto max-w-xl p-8">
              <h1 className="text-xl font-semibold">Let’s keep your journals safe</h1>
              <p className="my-4 text-sm leading-6 text-muted">{error}</p>
              <button onClick={() => void reload()} className="button-primary">Try again</button>
            </div>
          ) : <Outlet />}
        </main>
        <footer className="px-5 pb-8 sm:px-8 lg:px-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-line bg-accent-soft p-5 sm:p-6">
            <div className="flex items-center gap-4"><span className="text-2xl text-primary" aria-hidden="true">✦</span><div><p className="text-sm font-semibold">Collect a thought.<br />Leave room for more.</p><p className="mt-2 max-w-md text-xs leading-5 text-muted">An observation, a feeling, a new idea. Give it a page of its own.</p></div></div>
            <span className="flex items-center gap-2 text-xs text-muted"><Icon icon={faLock} />Local & personal</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-[11px] leading-5 text-muted">
            <p>© 2026 Svetlana Vrabie</p><p><Icon icon={faLock} /> Saved only in this browser. Not a cloud backup.</p>
          </div>
        </footer>
      </div>
      <div role="status" aria-live="polite">
        {notice && <div className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] left-5 right-5 z-40 mx-auto flex max-w-md items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 text-sm shadow-lg md:bottom-6"><span>{notice}</span><button aria-label="Dismiss notification" onClick={dismissNotice} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-accent-soft"><Icon icon={faXmark} /></button></div>}
      </div>
    </div>
  )
}
