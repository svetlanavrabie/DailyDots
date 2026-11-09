import { Link } from 'react-router-dom'

export function NotFoundPage({ entry = false }: { entry?: boolean }) {
  return (
    <div className="card mx-auto max-w-xl p-10 text-center">
      <p className="mb-4 text-4xl text-primary" aria-hidden="true">✦</p>
      <h1 className="text-2xl font-semibold">{entry ? 'This journal entry isn’t here' : 'A little off the page'}</h1>
      <p className="my-4 text-sm leading-6 text-muted">{entry ? 'It may have been deleted, or this day hasn’t been written yet.' : 'We couldn’t find the page you’re looking for.'}</p>
      <Link to={entry ? '/journals' : '/'} className="button-primary">{entry ? 'Go to my journals' : 'Back to home'}</Link>
    </div>
  )
}
