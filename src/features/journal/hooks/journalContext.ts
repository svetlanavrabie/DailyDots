import { createContext, useContext } from 'react'
import type { JournalEntry, JournalInput } from '../types/journal'

export interface JournalContextValue {
  entries: JournalEntry[]
  loading: boolean
  error: string | null
  notice: string | null
  reload(): Promise<void>
  save(input: JournalInput): Promise<void>
  remove(date: string): Promise<void>
  dismissNotice(): void
}

export const JournalContext = createContext<JournalContextValue | null>(null)

export function useJournals(): JournalContextValue {
  const context = useContext(JournalContext)
  if (!context) throw new Error('JournalProvider is required.')
  return context
}
