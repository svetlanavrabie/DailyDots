import { AppRouter } from './router'
import { JournalProvider } from './providers/JournalProvider'
import { journalRepository } from '@/infrastructure/storage/journalRepository'

export function App() {
  return <JournalProvider repository={journalRepository}><AppRouter /></JournalProvider>
}
