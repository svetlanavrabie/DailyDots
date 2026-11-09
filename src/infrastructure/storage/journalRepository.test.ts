import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createJournalRepository, JOURNAL_STORAGE_KEY } from './journalRepository'
import type { JournalInput } from '@/features/journal/types/journal'
import { MOODS } from '@/features/journal/types/journal'

const input: JournalInput = { date: '2026-03-08', mood: 'calm', text: 'A synthetic test entry.' }
const repository = createJournalRepository(() => localStorage)

beforeEach(() => {
  localStorage.clear()
})

describe('journal persistence', () => {
  it.each(MOODS)('persists and reloads the $value emotion', async (mood) => {
    await repository.save({ ...input, mood: mood.value })
    const reloaded = createJournalRepository(() => localStorage)
    expect((await reloaded.list())[0].mood).toBe(mood.value)
  })

  it('starts empty without generating sample entries', async () => {
    expect(await repository.list()).toEqual([])
  })

  it('keeps exactly one entry per calendar day and preserves its creation time', async () => {
    vi.useFakeTimers()
    try {
      vi.setSystemTime(new Date('2026-03-08T10:00:00Z'))
      const created = await repository.save(input)
      vi.setSystemTime(new Date('2026-03-09T12:00:00Z'))
      const updated = await repository.save({ ...input, mood: 'happy', text: 'Updated synthetic text.' })
      expect(await repository.list()).toEqual([updated])
      expect(updated.createdAt).toBe(created.createdAt)
      expect(updated.updatedAt).not.toBe(created.updatedAt)
      expect(updated.mood).toBe('happy')
    } finally {
      vi.useRealTimers()
    }
  })

  it('persists across repository instances and lists newest dates first', async () => {
    await repository.save(input)
    await repository.save({ ...input, date: '2026-03-09' })
    const reloaded = createJournalRepository(() => localStorage)
    expect((await reloaded.list()).map((entry) => entry.date)).toEqual(['2026-03-09', '2026-03-08'])
  })

  it('reads current storage before mutations rather than overwriting stale state', async () => {
    await repository.list()
    await createJournalRepository(() => localStorage).save({ ...input, date: '2026-03-07' })
    await repository.save(input)
    expect(await repository.list()).toHaveLength(2)
  })

  it('deletes only the chosen date', async () => {
    await repository.save(input)
    await repository.save({ ...input, date: '2026-03-09' })
    await repository.remove(input.date)
    expect((await repository.list()).map((entry) => entry.date)).toEqual(['2026-03-09'])
  })

  it.each(['{broken', '{"version":2,"entries":[]}', '{"version":1,"entries":[{}]}'])('preserves unreadable stored data: %s', async (raw) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    localStorage.setItem(JOURNAL_STORAGE_KEY, raw)
    await expect(repository.list()).rejects.toThrow('have not been changed')
    await expect(repository.save(input)).rejects.toThrow()
    await expect(repository.remove(input.date)).rejects.toThrow()
    expect(localStorage.getItem(JOURNAL_STORAGE_KEY)).toBe(raw)
  })

  it('rejects duplicate dates in persisted data without changing it', async () => {
    const entry = await repository.save(input)
    const raw = JSON.stringify({ version: 1, entries: [entry, entry] })
    localStorage.setItem(JOURNAL_STORAGE_KEY, raw)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    await expect(repository.list()).rejects.toThrow()
    expect(localStorage.getItem(JOURNAL_STORAGE_KEY)).toBe(raw)
  })

  it('reports blocked storage without accessing or logging journal contents', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const blocked = createJournalRepository(() => { throw new Error('Blocked') })
    await expect(blocked.list()).rejects.toThrow('blocked')
    expect(log).not.toHaveBeenCalledWith(expect.stringContaining(input.text))
  })

  it('reports quota failures and leaves previous data intact', async () => {
    await repository.save(input)
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY)
    const full = createJournalRepository(() => ({
      getItem: (key) => localStorage.getItem(key),
      setItem: () => { throw new DOMException('Full', 'QuotaExceededError') },
    }))
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    await expect(full.save({ ...input, text: 'Cannot be saved.' })).rejects.toThrow('full or blocked')
    expect(localStorage.getItem(JOURNAL_STORAGE_KEY)).toBe(raw)
  })

  it.each([
    { ...input, date: '2026-02-30' },
    { ...input, date: '2026-3-8' },
    { ...input, text: '   ' },
    { ...input, text: 'x'.repeat(20001) },
  ])('rejects invalid input without writing', async (invalid) => {
    await expect(repository.save(invalid)).rejects.toThrow()
    expect(localStorage.getItem(JOURNAL_STORAGE_KEY)).toBeNull()
  })
})
