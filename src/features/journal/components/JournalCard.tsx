import { faArrowUpRightFromSquare, faPen } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { getMood } from '../types/journal'
import type { JournalEntry } from '../types/journal'
import { MoodEmoji } from './MoodEmoji'
import { Icon } from '@/shared/components/Icon'
import { displayDate } from '@/shared/utils/dates'

interface JournalCardProps {
  entry: JournalEntry
}

export function JournalCard({ entry }: JournalCardProps) {
  const mood = getMood(entry.mood)
  return (
    <article className="card group flex flex-col p-5 transition-colors hover:border-primary/40 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-3 text-sm font-semibold"><MoodEmoji mood={entry.mood} />{mood.label}</span>
        <Icon icon={faPen} className="text-xs text-muted" />
      </div>
      <p className="text-xs text-muted">{displayDate(entry.date, 'EEEE')}</p>
      <h3 className="mt-1 text-lg font-semibold"><Link to={`/journals/${entry.date}`} className="rounded hover:text-primary">{displayDate(entry.date, 'MMMM d, yyyy')}</Link></h3>
      <p className="mb-6 mt-3 line-clamp-3 whitespace-pre-wrap break-words text-sm leading-6 text-muted">{entry.text}</p>
      <Link to={`/journals/${entry.date}`} className="mt-auto inline-flex items-center gap-2 self-start text-xs font-semibold text-primary">Read entry <Icon icon={faArrowUpRightFromSquare} className="text-[10px]" /><span className="sr-only"> for {displayDate(entry.date)}</span></Link>
    </article>
  )
}
