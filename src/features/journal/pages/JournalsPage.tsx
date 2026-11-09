import { useState } from 'react'
import { Link } from 'react-router-dom'
import { faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useJournals } from '../hooks/journalContext'
import { filterJournals } from '../services/journalSummary'
import { MOODS } from '../types/journal'
import { JournalCard } from '../components/JournalCard'
import { Icon } from '@/shared/components/Icon'
import { EmptyState } from '@/shared/components/EmptyState'

export function JournalsPage() {
  const { entries } = useJournals()
  const [search, setSearch] = useState('')
  const [mood, setMood] = useState('')
  const filtered = filterJournals(entries, search, mood)
  const hasFilters = !!search || !!mood

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-5"><div><p className="eyebrow mb-2">Collected along the way</p><h1 className="text-3xl font-semibold tracking-tight">Journal archive<span className="text-primary">.</span></h1><p className="mt-3 text-sm text-muted">Revisit an observation, follow a feeling, or find a date.</p></div><Link to="/new" className="button-primary"><Icon icon={faPlus} />New reflection</Link></div>
      <div className="card mb-6 flex flex-col gap-4 p-4 sm:flex-row">
        <div className="relative flex-1"><label htmlFor="journal-search" className="sr-only">Search journals</label><Icon icon={faMagnifyingGlass} className="absolute left-4 top-4 text-sm text-muted" /><input id="journal-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your pages by words or date…" className="field pl-10" /></div>
        <div><label htmlFor="mood-filter" className="sr-only">Filter by mood</label><select id="mood-filter" value={mood} onChange={(event) => setMood(event.target.value)} className="field sm:w-40"><option value="">All moods</option>{MOODS.map((item) => <option key={item.value} value={item.value}>{item.emoji} {item.label}</option>)}</select></div>
        {hasFilters && <button className="button-secondary" onClick={() => { setSearch(''); setMood('') }}>Clear filters</button>}
      </div>
      <p className="mb-5 text-xs text-muted" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}{hasFilters ? ' found' : ' · newest first'}</p>
      {filtered.length ? <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">{filtered.map((entry) => <JournalCard key={entry.date} entry={entry} />)}</div> : <div className="card"><EmptyState filtered={hasFilters} /></div>}
    </>
  )
}
