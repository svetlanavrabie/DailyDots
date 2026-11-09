import { z } from 'zod'
import { dateSchema, journalEntrySchema, journalInputSchema } from '@/features/journal/types/journal'
import type { JournalEntry, JournalInput, JournalRepository } from '@/features/journal/types/journal'
import { logger } from '@/shared/services/logger'

export const JOURNAL_STORAGE_KEY = 'daily-dots:journals:v1'

const storedSchema = z.object({
  version: z.literal(1),
  entries: z.array(journalEntrySchema),
}).superRefine(({ entries }, context) => {
  const dates = new Set(entries.map((entry) => entry.date))
  if (dates.size !== entries.length) {
    context.addIssue({ code: 'custom', message: 'Duplicate journal dates.' })
  }
})

interface StorageAccess {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function createJournalRepository(getStorage: () => StorageAccess): JournalRepository {
  function read(): JournalEntry[] {
    let raw: string | null
    try {
      raw = getStorage().getItem(JOURNAL_STORAGE_KEY)
    } catch {
      logger.error('Reading journal storage')
      throw new Error('Your browser blocked journal storage. Enable site storage, then retry.')
    }
    if (raw === null) return []
    try {
      const parsed: unknown = JSON.parse(raw)
      return storedSchema.parse(parsed).entries.sort((a, b) => b.date.localeCompare(a.date))
    } catch {
      logger.error('Validating journal storage')
      throw new Error('Your saved journals could not be read. They have not been changed. Back up this site’s browser storage before attempting recovery.')
    }
  }

  function write(entries: JournalEntry[]): void {
    try {
      getStorage().setItem(JOURNAL_STORAGE_KEY, JSON.stringify({ version: 1, entries }))
    } catch {
      logger.error('Saving journal storage')
      throw new Error('Your journal could not be saved. Browser storage may be full or blocked. Keep your text and try again.')
    }
  }

  return {
    async list() {
      return read()
    },
    async save(input: JournalInput) {
      const valid = journalInputSchema.parse(input)
      // Re-read immediately before writing so other-tab updates are not replaced by stale UI state.
      const entries = read()
      const existing = entries.find((entry) => entry.date === valid.date)
      const now = new Date().toISOString()
      const entry: JournalEntry = { ...valid, createdAt: existing?.createdAt ?? now, updatedAt: now }
      write([...entries.filter((item) => item.date !== valid.date), entry])
      return entry
    },
    async remove(date: string) {
      dateSchema.parse(date)
      write(read().filter((entry) => entry.date !== date))
    },
  }
}

export const journalRepository = createJournalRepository(() => localStorage)
