import { describe, expect, it } from 'vitest'
import { filterJournals, getJournalSummary } from './journalSummary'
import type { JournalEntry } from '../types/journal'
import { dateSchema } from '../types/journal'

function entry(date: string, text = 'Synthetic reflection'): JournalEntry {
  return { date, text, mood: 'calm', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' }
}

describe('journal summaries', () => {
  it('handles an empty journal', () => {
    const summary = getJournalSummary([], '2026-03-09')
    expect(summary.total).toBe(0)
    expect(summary.streak).toBe(0)
    expect(summary.weekCount).toBe(0)
    expect(summary.week).toHaveLength(7)
  })

  it('counts a streak across month boundaries and DST using calendar dates', () => {
    expect(getJournalSummary([entry('2026-03-01'), entry('2026-02-28')], '2026-03-01').streak).toBe(2)
    expect(getJournalSummary([entry('2026-03-08'), entry('2026-03-07')], '2026-03-09').streak).toBe(2)
  })

  it('does not count an old or future streak as current', () => {
    expect(getJournalSummary([entry('2026-03-06'), entry('2026-03-10')], '2026-03-09').streak).toBe(0)
  })

  it('uses a Monday to Sunday week', () => {
    const summary = getJournalSummary([entry('2026-03-08'), entry('2026-03-09')], '2026-03-09')
    expect(summary.week[0].date).toBe('2026-03-09')
    expect(summary.week[6].date).toBe('2026-03-15')
    expect(summary.weekCount).toBe(1)
  })

  it('combines case-insensitive text/date search and mood filters', () => {
    const entries = [entry('2026-03-08', 'A synthetic SUNNY day'), { ...entry('2026-03-09'), mood: 'sad' as const }]
    expect(filterJournals(entries, ' sunny ', 'calm')).toEqual([entries[0]])
    expect(filterJournals(entries, '2026-03-09', 'calm')).toEqual([])
    expect(filterJournals(entries, '', 'sad')).toEqual([entries[1]])
  })

  it('validates leap years and strict date formats', () => {
    expect(dateSchema.safeParse('2024-02-29').success).toBe(true)
    expect(dateSchema.safeParse('2026-02-29').success).toBe(false)
    expect(dateSchema.safeParse('2026-03-08T00:00:00Z').success).toBe(false)
  })
})
