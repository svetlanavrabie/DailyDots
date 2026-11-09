import { Link } from 'react-router-dom'
import { useJournals } from '@/features/journal/hooks/journalContext'
import { MOODS, getMood } from '@/features/journal/types/journal'
import { MoodEmoji } from '@/features/journal/components/MoodEmoji'
import { todayKey } from '@/shared/utils/dates'

export function MoodCheckIn() {
  const { entries } = useJournals()
  const today = todayKey()
  const entry = entries.find((item) => item.date === today)

  return (
    <section aria-labelledby="check-in-heading" className="card mb-7 p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="check-in-heading" className="text-lg font-semibold">What is your mood right now?</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Choose the closest match, then explore it on the page.</p>
        </div>
        {entry && <Link to={`/journals/${today}`} className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-2 text-xs font-medium text-primary"><MoodEmoji mood={entry.mood} size="small" />Saved today: {getMood(entry.mood).label}</Link>}
      </div>
      <div className="grid grid-cols-2 gap-3 min-[360px]:grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
        {MOODS.map((mood) => (
          <Link key={mood.value} to={`/new?date=${today}&mood=${mood.value}`} aria-label={`Write about feeling ${mood.label.toLowerCase()}`} className="group flex min-w-0 flex-col items-center gap-3 rounded-2xl border border-line bg-canvas px-1 py-4 text-xs font-medium text-ink transition-colors hover:border-primary hover:bg-accent-soft">
            <span className="motion-safe:transition-transform motion-safe:group-hover:-translate-y-1"><MoodEmoji mood={mood.value} size="large" /></span>
            <span>{mood.label}</span>
          </Link>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted">{entry ? 'Your reflection stays intact. A new feeling is only applied when you save your update.' : 'This opens your journal with the mood selected. Nothing is saved until you save your entry.'}</p>
    </section>
  )
}
