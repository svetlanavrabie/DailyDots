import { eachDayOfInterval, endOfWeek, startOfWeek, subDays } from 'date-fns'
import type { JournalEntry } from '../types/journal'
import { todayKey } from '@/shared/utils/dates'
import { format } from 'date-fns'

export function getJournalSummary(entries: JournalEntry[], today = todayKey()) {
  const dates = new Set(entries.map((entry) => entry.date))
  let cursor = new Date(`${today}T12:00:00`)
  if (!dates.has(today)) cursor = subDays(cursor, 1)
  let streak = 0
  while (dates.has(format(cursor, 'yyyy-MM-dd'))) {
    streak++
    cursor = subDays(cursor, 1)
  }
  const week = eachDayOfInterval({
    start: startOfWeek(new Date(`${today}T12:00:00`), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(`${today}T12:00:00`), { weekStartsOn: 1 }),
  }).map((date) => {
    const key = format(date, 'yyyy-MM-dd')
    return { date: key, label: format(date, 'EEEEE'), entry: entries.find((entry) => entry.date === key) }
  })
  return {
    total: entries.length,
    streak,
    week,
    weekCount: week.filter((day) => day.entry).length,
    todayEntry: entries.find((entry) => entry.date === today),
  }
}

export function filterJournals(entries: JournalEntry[], search: string, mood: string): JournalEntry[] {
  const query = search.trim().toLocaleLowerCase()
  return entries.filter((entry) =>
    (!mood || entry.mood === mood) &&
    (!query || entry.text.toLocaleLowerCase().includes(query) || entry.date.includes(query)),
  )
}
