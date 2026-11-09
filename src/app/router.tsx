import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { NotFoundPage } from './NotFoundPage'
import { HomePage } from '@/features/dashboard/pages/HomePage'
import { JournalsPage } from '@/features/journal/pages/JournalsPage'
import { NewJournalPage } from '@/features/journal/pages/NewJournalPage'
import { JournalDetailPage } from '@/features/journal/pages/JournalDetailPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="journals" element={<JournalsPage />} />
        <Route path="journals/:date" element={<JournalDetailPage />} />
        <Route path="new" element={<NewJournalPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
