import { addDays, format, parseISO, startOfWeek, subWeeks } from 'date-fns'

export function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function displayDate(date: string, pattern = 'MMMM d, yyyy'): string {
  return format(parseISO(date), pattern)
}

export function previousWeekDates(today = todayKey()): string[] {
  const monday = startOfWeek(subWeeks(parseISO(today), 1), { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, index) => format(addDays(monday, index), 'yyyy-MM-dd'))
}
