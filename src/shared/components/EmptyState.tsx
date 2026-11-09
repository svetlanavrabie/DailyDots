import { faFeatherPointed } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'

interface EmptyStateProps {
  filtered?: boolean
}

export function EmptyState({ filtered = false }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-xl text-primary"><Icon icon={faFeatherPointed} /></span>
      <h3 className="text-lg font-semibold">{filtered ? 'No entries found' : 'Your story starts here'}</h3>
      <p className="mt-2 max-w-xs text-sm leading-6 text-muted">{filtered ? 'Try another search or clear your filters.' : 'Choose a date and capture your first observation. Your saved pages will appear here.'}</p>
      {!filtered && <Link to="/new" className="button-primary mt-6">Write your first entry</Link>}
    </div>
  )
}
