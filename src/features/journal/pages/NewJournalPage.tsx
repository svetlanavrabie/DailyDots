import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useJournals } from '../hooks/journalContext'
import { dateSchema, moodSchema } from '../types/journal'
import { JournalForm } from '../components/JournalForm'
import { todayKey, displayDate, previousWeekDates } from '@/shared/utils/dates'

export function NewJournalPage() {
  const { entries } = useJournals()
  const [params, setParams] = useSearchParams()
  const date = params.get('date') ?? todayKey()
  const valid = dateSchema.safeParse(date).success
  const existing = entries.find((entry) => entry.date === date)
  const requestedMood = params.get('mood')
  const parsedMood = moodSchema.safeParse(requestedMood)
  const initialMood = parsedMood.success ? parsedMood.data : undefined
  const [dateError, setDateError] = useState<string | null>(null)
  const [showLastWeek, setShowLastWeek] = useState(false)
  const lastWeek = previousWeekDates()

  function switchDate(next: string) {
    if (!dateSchema.safeParse(next).success) {
      setDateError('Choose a valid date.')
      return
    }
    if (next !== date && window.confirm('Switch journal dates? Any unsaved changes on this form will be lost.')) {
      setDateError(null)
      setParams({ date: next })
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="eyebrow mb-2">An open page, an open mind</p>
      <h1 className="text-3xl font-semibold tracking-tight">{existing ? 'Return to this reflection' : 'New reflection'}<span className="text-primary">.</span></h1>
      <p className="mb-8 mt-3 text-sm text-muted">Set down an idea, describe a change, or see where a sentence takes you.</p>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5">
        <div><label htmlFor="entry-date" className="text-sm font-semibold">Your day</label><p className="mt-1 text-xs text-muted">{valid ? displayDate(date, 'EEEE, MMMM d, yyyy') : 'Choose a valid calendar date to start.'}</p></div>
        <div className="flex w-full flex-wrap gap-3 sm:w-auto">
          <button type="button" className="button-secondary cursor-pointer" aria-expanded={showLastWeek} aria-controls="last-week-dates" onClick={() => setShowLastWeek(!showLastWeek)}>Last week</button>
          <input id="entry-date" type="date" value={valid ? date : ''} className="field max-w-48 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer" aria-describedby="date-switch-hint" onChange={(event) => switchDate(event.target.value)} />
        </div>
        {showLastWeek && <section id="last-week-dates" aria-labelledby="last-week-heading" className="w-full min-w-0 border-t border-line pt-4">
          <h2 id="last-week-heading" className="mb-3 text-sm font-semibold">Last week: {displayDate(lastWeek[0], 'MMM d, yyyy')} – {displayDate(lastWeek[6], 'MMM d, yyyy')}</h2>
          <div className="grid grid-cols-2 gap-2 min-[360px]:grid-cols-3 sm:grid-cols-7">
            {lastWeek.map((day) => <button key={day} type="button" aria-label={displayDate(day, 'EEEE, MMMM d, yyyy')} aria-pressed={day === date} onClick={() => switchDate(day)} className={`flex min-h-11 cursor-pointer flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs transition-colors hover:bg-accent-soft ${day === date ? 'border-primary bg-accent-soft font-semibold text-primary' : 'border-line bg-canvas text-ink'}`}>
              <span>{displayDate(day, 'EEE')}</span><span>{displayDate(day, 'MMM d')}</span>
            </button>)}
          </div>
        </section>}
      </div>
      <p id="date-switch-hint" className="mb-5 text-xs text-muted">One entry per calendar day. Choose a date to create or update it. Switching dates starts a different draft.</p>
      {dateError && <p role="alert" className="mb-4 text-sm text-red-700 dark:text-red-300">{dateError}</p>}
      {requestedMood !== null && !parsedMood.success && <p role="alert" className="mb-4 rounded-xl bg-rose p-4 text-sm">That mood isn’t recognized. Choose one of the feelings below.</p>}
      {valid ? <JournalForm key={`${date}:${initialMood ?? ''}`} date={date} existing={existing} initialMood={initialMood} /> : <div role="alert" className="card p-6 text-sm">This date isn’t valid. Choose a calendar date above.</div>}
    </div>
  )
}
