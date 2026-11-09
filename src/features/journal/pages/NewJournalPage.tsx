import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useJournals } from '../hooks/journalContext'
import { dateSchema, moodSchema } from '../types/journal'
import { JournalForm } from '../components/JournalForm'
import { todayKey, displayDate } from '@/shared/utils/dates'

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

  return (
    <div className="mx-auto max-w-3xl">
      <p className="eyebrow mb-2">An open page, an open mind</p>
      <h1 className="text-3xl font-semibold tracking-tight">{existing ? 'Return to this reflection' : 'New reflection'}<span className="text-primary">.</span></h1>
      <p className="mb-8 mt-3 text-sm text-muted">Set down an idea, describe a change, or see where a sentence takes you.</p>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5">
        <div><label htmlFor="entry-date" className="text-sm font-semibold">Your day</label><p className="mt-1 text-xs text-muted">{valid ? displayDate(date, 'EEEE, MMMM d, yyyy') : 'Choose a valid calendar date to start.'}</p></div>
        <input id="entry-date" type="date" value={valid ? date : ''} className="field max-w-48" aria-describedby="date-switch-hint" onChange={(event) => {
          const next = event.target.value
          if (!dateSchema.safeParse(next).success) {
            setDateError('Choose a valid date.')
            return
          }
          if (next !== date && window.confirm('Switch journal dates? Any unsaved changes on this form will be lost.')) {
            setDateError(null)
            setParams({ date: next })
          }
        }} />
      </div>
      <p id="date-switch-hint" className="mb-5 text-xs text-muted">One entry per calendar day. Choose a date to create or update it. Switching dates starts a different draft.</p>
      {dateError && <p role="alert" className="mb-4 text-sm text-red-700 dark:text-red-300">{dateError}</p>}
      {requestedMood !== null && !parsedMood.success && <p role="alert" className="mb-4 rounded-xl bg-rose p-4 text-sm">That mood isn’t recognized. Choose one of the feelings below.</p>}
      {valid ? <JournalForm key={`${date}:${initialMood ?? ''}`} date={date} existing={existing} initialMood={initialMood} /> : <div role="alert" className="card p-6 text-sm">This date isn’t valid. Choose a calendar date above.</div>}
    </div>
  )
}
