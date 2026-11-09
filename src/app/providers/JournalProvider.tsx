import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { JournalContext } from '@/features/journal/hooks/journalContext'
import type { JournalEntry, JournalInput, JournalRepository } from '@/features/journal/types/journal'
import { JOURNAL_STORAGE_KEY } from '@/infrastructure/storage/journalRepository'
import { errorMessage } from '@/shared/services/logger'

interface JournalProviderProps {
  repository: JournalRepository
  children: ReactNode
}

export function JournalProvider({ repository, children }: JournalProviderProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      setEntries(await repository.list())
      setError(null)
    } catch (caught) {
      setError(errorMessage(caught))
    } finally {
      setLoading(false)
    }
  }, [repository])

  useEffect(() => {
    void reload()
    const onStorage = (event: StorageEvent) => {
      if (event.key === JOURNAL_STORAGE_KEY || event.key === null) void reload()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [reload])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 5000)
    return () => window.clearTimeout(timer)
  }, [notice])

  async function save(input: JournalInput): Promise<void> {
    await repository.save(input)
    setEntries(await repository.list())
    setNotice('A little piece of your day, saved.')
  }

  async function remove(date: string): Promise<void> {
    await repository.remove(date)
    setEntries(await repository.list())
    setNotice('Journal entry deleted.')
  }

  return (
    <JournalContext.Provider value={{ entries, loading, error, notice, reload, save, remove, dismissNotice: () => setNotice(null) }}>
      {children}
    </JournalContext.Provider>
  )
}
