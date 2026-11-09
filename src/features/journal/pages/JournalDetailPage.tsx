import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { faArrowLeft, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useJournals } from '../hooks/journalContext'
import { getMood } from '../types/journal'
import { DeleteJournalDialog } from '../components/DeleteJournalDialog'
import { MoodEmoji } from '../components/MoodEmoji'
import { displayDate } from '@/shared/utils/dates'
import { Icon } from '@/shared/components/Icon'
import { NotFoundPage } from '@/app/NotFoundPage'

export function JournalDetailPage() {
  const { date } = useParams()
  const { entries } = useJournals()
  const [deleting, setDeleting] = useState(false)
  const entry = entries.find((item) => item.date === date)
  if (!entry) return <NotFoundPage entry />
  const mood = getMood(entry.mood)

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/journals" className="mb-7 inline-flex min-h-11 items-center gap-2 rounded text-xs font-medium text-muted hover:text-primary"><Icon icon={faArrowLeft} />Back to my journals</Link>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-5">
        <div><p className="eyebrow mb-2">{displayDate(entry.date, 'EEEE')}</p><h1 className="text-3xl font-semibold tracking-tight">{displayDate(entry.date)}</h1></div>
        <div className="flex gap-3"><Link to={`/new?date=${entry.date}`} className="button-secondary"><Icon icon={faPen} />Edit entry</Link><button onClick={() => setDeleting(true)} className="button-secondary text-red-700 dark:text-red-300" aria-label="Delete journal entry"><Icon icon={faTrashCan} /></button></div>
      </div>
      <article className="card p-6 sm:p-9">
        <span className="inline-flex items-center gap-4 text-lg font-medium"><MoodEmoji mood={entry.mood} size="large" />Feeling {mood.label.toLowerCase()}</span>
        <p className="mb-8 mt-7 whitespace-pre-wrap break-words text-base leading-8">{entry.text}</p>
        <p className="border-t border-line pt-5 text-xs text-muted">Last saved {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(entry.updatedAt))}</p>
      </article>
      <p className="mt-6 text-center font-display text-lg italic text-muted">A thought saved today can offer a new perspective tomorrow.</p>
      {deleting && <DeleteJournalDialog date={entry.date} onClose={() => setDeleting(false)} />}
    </div>
  )
}
