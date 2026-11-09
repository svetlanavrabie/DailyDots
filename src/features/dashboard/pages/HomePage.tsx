import { Link } from 'react-router-dom'
import { faArrowRight, faBookOpen, faCalendarCheck, faFireFlameCurved, faPlus, faFeatherPointed } from '@fortawesome/free-solid-svg-icons'
import { useJournals } from '@/features/journal/hooks/journalContext'
import { getJournalSummary } from '@/features/journal/services/journalSummary'
import { JournalCard } from '@/features/journal/components/JournalCard'
import { getMood } from '@/features/journal/types/journal'
import { Icon } from '@/shared/components/Icon'
import { EmptyState } from '@/shared/components/EmptyState'
import { todayKey, displayDate } from '@/shared/utils/dates'
import { MoodCheckIn } from '../components/MoodCheckIn'
import { MoodEmoji } from '@/features/journal/components/MoodEmoji'

export function HomePage() {
  const { entries } = useJournals()
  const summary = getJournalSummary(entries)
  const today = todayKey()
  const stats = [
    { label: 'Total entries', value: summary.total, note: 'Pages in your collection', icon: faBookOpen, color: 'bg-accent-soft text-primary' },
    { label: 'Current streak', value: `${summary.streak} ${summary.streak === 1 ? 'day' : 'days'}`, note: 'Your writing rhythm', icon: faFireFlameCurved, color: 'bg-accent-alt text-ink' },
    { label: 'This week', value: `${summary.weekCount} / 7`, note: 'Days with a saved reflection', icon: faCalendarCheck, color: 'bg-accent-soft text-primary' },
  ]

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow mb-2">Room to think</p><h1 className="text-3xl font-semibold tracking-tight">Start with what you notice<span className="text-primary">.</span></h1><p className="mt-3 text-sm text-muted">Gather your thoughts and see your days from a new angle.</p></div>
        <span className="rounded-full border border-line bg-surface px-3 py-2 text-xs text-muted"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary" />One day, one entry</span>
      </div>
      <div className="mb-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <section className="relative isolate flex min-h-80 items-center overflow-hidden rounded-3xl border border-line bg-accent-soft p-6 sm:p-9" aria-labelledby="welcome-heading">
        <div className="relative z-10 max-w-md sm:w-2/3">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 text-[11px] font-medium text-primary"><Icon icon={faFeatherPointed} />Begin wherever you are</span>
          <h2 id="welcome-heading" className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">A blank page.<br /><span className="italic text-primary">A different point of view.</span></h2>
          <p className="mb-5 mt-4 max-w-sm text-sm leading-6 text-muted">Save a detail you might otherwise forget.<br className="hidden sm:block" /> There is no set length, just a place to begin.</p>
          <Link to={`/new?date=${today}`} className="button-primary">{summary.todayEntry ? 'Continue today’s entry' : 'Write today’s entry'}<Icon icon={faArrowRight} /></Link>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute -right-7 top-8 hidden h-64 w-64 sm:block lg:-right-12 xl:right-0">
          <div className="absolute inset-2 rounded-full border border-primary/10" /><div className="absolute inset-7 rounded-full bg-surface/25" />
          <span className="absolute right-2 top-1 text-4xl text-primary/50">✧</span>
          <span className="absolute bottom-8 left-0 text-3xl text-primary/60">✦</span>
          <div className="notebook-art absolute left-16 top-6 flex h-44 w-32 flex-col items-center justify-center rounded-l-lg rounded-r-2xl border border-notebook-border bg-notebook-cover text-notebook-ink shadow-xl">
            <div className="absolute inset-y-0 left-3 border-l border-notebook-border" />
            <span className="text-[9px] uppercase tracking-[0.3em]">Field notes</span><span className="my-3 text-5xl">✳</span><span className="text-[9px] italic">thoughts in progress</span>
          </div>
          <div className="absolute bottom-8 right-7 rotate-12 rounded-full bg-accent-alt px-4 py-2 text-xs text-ink">a new leaf ♡</div>
        </div>
      </section>
      <section aria-label="Journal summary" className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        {stats.map((stat) => <div key={stat.label} className="card flex items-start gap-4 p-5"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color}`}><Icon icon={stat.icon} /></span><div><h2 className="text-xs text-muted">{stat.label}</h2><p className="my-1 text-2xl font-semibold tracking-tight">{stat.value}</p><p className="text-[11px] text-muted">{stat.note}</p></div></div>)}
      </section>
      </div>
      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0">
      <MoodCheckIn />
        <section aria-labelledby="recent-heading" className="min-w-0">
          <div className="mb-5 flex items-center justify-between gap-3"><div><h2 id="recent-heading" className="text-lg font-semibold">Latest pages</h2><p className="mt-1 text-xs text-muted">Pick up a thought you left here.</p></div><Link to="/journals" className="inline-flex min-h-11 items-center gap-2 text-xs font-medium text-primary">Browse archive<Icon icon={faArrowRight} /></Link></div>
          {entries.length ? <div className="grid gap-4 md:grid-cols-2">{entries.slice(0, 2).map((entry) => <JournalCard key={entry.date} entry={entry} />)}</div> : <div className="card"><EmptyState /></div>}
        </section>
      <Link to="/new" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg text-xs font-medium text-primary"><Icon icon={faPlus} />Reflect on a different day</Link>
      </div>
        <div className="flex flex-col gap-5">
          <section aria-labelledby="week-heading" className="card p-5">
            <div className="flex items-center justify-between"><h2 id="week-heading" className="text-sm font-semibold">This week at a glance</h2><span className="text-xs text-primary">✦</span></div>
            <p className="mb-5 mt-1 text-[11px] text-muted">{displayDate(summary.week[0].date, 'MMM d')} – {displayDate(summary.week[6].date, 'MMM d')}</p>
            <div className="grid grid-cols-7 gap-1">
              {summary.week.map((day) => <Link key={day.date} to={day.entry ? `/journals/${day.date}` : `/new?date=${day.date}`} aria-label={`${displayDate(day.date)}: ${day.entry ? getMood(day.entry.mood).label : 'no entry, add journal'}`} className="flex flex-col items-center gap-3 rounded-lg py-1 hover:bg-accent-soft"><span className={`text-[10px] ${day.date === today ? 'font-bold text-primary' : 'text-muted'}`}>{day.label}</span><span className={`flex h-8 w-8 items-center justify-center rounded-full bg-canvas ${day.date === today ? 'ring-1 ring-primary ring-offset-2 ring-offset-surface' : ''}`}>{day.entry ? <MoodEmoji mood={day.entry.mood} size="small" /> : <span className="h-1 w-1 rounded-full bg-line" />}</span></Link>)}
            </div>
            <p className="mt-5 text-[11px] text-muted">{summary.weekCount ? `${summary.weekCount} day${summary.weekCount === 1 ? '' : 's'} added to your notebook.` : 'Your weekly pages are still unwritten.'}</p>
          </section>
          <section className="rounded-2xl border border-line bg-accent-alt p-5">
            <p className="eyebrow mb-3">A writing prompt</p><p className="font-display text-xl italic leading-relaxed">What caught your attention today that you would like to notice again?</p><p className="mt-3 text-xs text-muted">Start with one detail and follow the thought.</p>
          </section>
        </div>
      </div>
    </>
  )
}
