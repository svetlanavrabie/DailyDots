import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useJournals } from '../hooks/journalContext'
import { displayDate } from '@/shared/utils/dates'
import { errorMessage } from '@/shared/services/logger'
import { Icon } from '@/shared/components/Icon'

interface DeleteJournalDialogProps {
  date: string
  onClose(): void
}

export function DeleteJournalDialog({ date, onClose }: DeleteJournalDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const { remove } = useJournals()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  async function confirmDelete() {
    setBusy(true)
    setError(null)
    try {
      await remove(date)
      navigate('/journals')
    } catch (caught) {
      setError(errorMessage(caught))
      setBusy(false)
    }
  }

  return (
    <dialog ref={ref} aria-labelledby="delete-title" aria-describedby="delete-description" onCancel={(event) => { if (busy) event.preventDefault() }} onClose={(event) => {
      // Ignore a queued cleanup event if StrictMode has already reopened the dialog.
      if (!event.currentTarget.open) onClose()
    }} className="w-[calc(100%-2rem)] max-w-md rounded-3xl border border-line bg-surface p-7 text-ink shadow-xl">
      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-rose text-red-700 dark:text-red-300"><Icon icon={faTrashCan} /></span>
      <h2 id="delete-title" className="text-xl font-semibold">Let this entry go?</h2>
      <p id="delete-description" className="mt-3 text-sm leading-6 text-muted">Your entry for {displayDate(date)} will be permanently deleted and excluded from future JSON backups. This can’t be undone.</p>
      {error && <p role="alert" className="mt-4 rounded-lg bg-rose p-3 text-sm">{error}</p>}
      <div className="mt-7 flex flex-wrap justify-end gap-3">
        <button autoFocus disabled={busy} onClick={() => ref.current?.close()} className="button-secondary">Keep my entry</button>
        <button disabled={busy} onClick={() => void confirmDelete()} className="button-primary bg-red-700 text-white hover:bg-red-800 dark:bg-red-400 dark:text-canvas dark:hover:bg-red-300">{busy ? 'Deleting…' : 'Delete entry'}</button>
      </div>
    </dialog>
  )
}
