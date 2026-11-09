import { format, parseISO } from 'date-fns'

export function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function displayDate(date: string, pattern = 'MMMM d, yyyy'): string {
  return format(parseISO(date), pattern)
}
