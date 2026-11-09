import { describe, expect, it } from 'vitest'
import { previousWeekDates } from './dates'

describe('previousWeekDates', () => {
  it.each(['2026-11-02', '2026-11-05', '2026-11-08'])('returns the previous Monday through Sunday for %s', (today) => {
    expect(previousWeekDates(today)).toEqual([
      '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29',
      '2026-10-30', '2026-10-31', '2026-11-01',
    ])
  })

  it('handles year boundaries', () => {
    expect(previousWeekDates('2027-01-04')).toEqual([
      '2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31',
      '2027-01-01', '2027-01-02', '2027-01-03',
    ])
  })

  it('handles leap days', () => {
    expect(previousWeekDates('2024-03-04')).toEqual([
      '2024-02-26', '2024-02-27', '2024-02-28', '2024-02-29',
      '2024-03-01', '2024-03-02', '2024-03-03',
    ])
  })
})
