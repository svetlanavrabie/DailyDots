import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { faArrowLeft, faCheck, faLock } from '@fortawesome/free-solid-svg-icons'
import { MOODS, journalInputSchema } from '../types/journal'
import type { JournalEntry, JournalInput, Mood } from '../types/journal'
import { MoodEmoji } from './MoodEmoji'
import { useJournals } from '../hooks/journalContext'
import { Icon } from '@/shared/components/Icon'
import { errorMessage } from '@/shared/services/logger'

interface JournalFormProps {
  date: string
  existing?: JournalEntry
  initialMood?: Mood
}

export function JournalForm({ date, existing, initialMood }: JournalFormProps) {
  const { save } = useJournals()
  const navigate = useNavigate()
  const [saveError, setSaveError] = useState<string | null>(null)
  const { register, handleSubmit, watch, formState: { errors, isSubmitting, isDirty } } = useForm<JournalInput>({
    resolver: zodResolver(journalInputSchema),
    defaultValues: { date, text: existing?.text ?? '', mood: initialMood ?? existing?.mood },
  })
  const text = watch('text')

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [isDirty])

  async function onSubmit(input: JournalInput) {
    setSaveError(null)
    try {
      await save(input)
      navigate(`/journals/${date}`)
    } catch (caught) {
      setSaveError(errorMessage(caught))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card p-5 sm:p-8">
      <input type="hidden" {...register('date')} />
      {existing && <p className="mb-7 rounded-xl bg-accent-soft px-4 py-3 text-sm leading-6 text-primary">This date already has a reflection. Saving will update that entry, not create another.</p>}
      <fieldset disabled={isSubmitting}>
        <legend className="text-sm font-semibold">How did this day feel?</legend>
        <p id="mood-hint" className="mb-4 mt-2 text-xs text-muted">Choose the feeling that best describes this date for you.</p>
        <div className="grid grid-cols-2 gap-3 min-[360px]:grid-cols-3 sm:grid-cols-6" role="group" aria-describedby={errors.mood ? 'mood-hint mood-error' : 'mood-hint'}>
          {MOODS.map((mood) => <label key={mood.value} className="relative cursor-pointer"><input type="radio" value={mood.value} {...register('mood')} className="peer sr-only" aria-invalid={!!errors.mood} aria-describedby={errors.mood ? 'mood-error' : undefined} /><span className="flex flex-col items-center gap-2 rounded-xl border border-line bg-canvas px-1 py-4 text-xs text-muted transition-colors hover:bg-accent-soft peer-checked:border-primary peer-checked:bg-accent-soft peer-checked:font-semibold peer-checked:text-primary peer-checked:ring-1 peer-checked:ring-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-primary"><MoodEmoji mood={mood.value} />{mood.label}</span></label>)}
        </div>
        {errors.mood && <p id="mood-error" role="alert" className="mt-3 text-sm text-red-700 dark:text-red-300">{errors.mood.message}</p>}
        <div className="mt-8">
          <label htmlFor="journal-text" className="text-sm font-semibold">What’s on your mind?</label>
          <p id="text-hint" className="mb-4 mt-2 text-xs text-muted">What stood out? What changed? What would you like to come back to?</p>
          <textarea id="journal-text" {...register('text')} rows={12} maxLength={20000} placeholder="One thing I noticed…" aria-invalid={!!errors.text} aria-describedby={`text-hint text-count${errors.text ? ' text-error' : ''}`} className="field min-h-72 resize-y text-base leading-8" />
          <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
            {errors.text ? <p id="text-error" role="alert" className="text-sm text-red-700 dark:text-red-300">{errors.text.message}</p> : <span className="text-xs italic text-muted">A single sentence is a place to start.</span>}
            <span id="text-count" className="ml-auto text-[11px] text-muted">{text.length.toLocaleString()} / 20,000 characters</span>
          </div>
        </div>
      </fieldset>
      {errors.date && <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-300">{errors.date.message}</p>}
      {saveError && <p role="alert" className="mt-5 rounded-xl bg-rose p-4 text-sm">{saveError}</p>}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <p className="flex items-center gap-2 text-[11px] text-muted"><Icon icon={faLock} />Only saved when you press the button.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={isSubmitting} onClick={() => {
            if (!isDirty || window.confirm('Leave without saving? Your changes will be lost.')) navigate(existing ? `/journals/${date}` : '/journals')
          }} className="button-secondary"><Icon icon={faArrowLeft} />Cancel</button>
          <button type="submit" disabled={isSubmitting} className="button-primary"><Icon icon={faCheck} />{isSubmitting ? 'Saving…' : existing ? 'Update entry' : 'Save my day'}</button>
        </div>
      </div>
    </form>
  )
}
