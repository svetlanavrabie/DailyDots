import { StrictMode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'
import { journalRepository, JOURNAL_STORAGE_KEY } from '@/infrastructure/storage/journalRepository'
import { MOODS } from '@/features/journal/types/journal'
import { todayKey } from '@/shared/utils/dates'

function renderApp(path = '/') {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
}

beforeEach(() => localStorage.clear())
afterEach(() => vi.unstubAllGlobals())

describe('daily journal experience', () => {
  it('shows the Daily Dots brand and links it to Home', async () => {
    renderApp('/journals')
    await screen.findByText('Your story starts here')
    expect(screen.getByRole('link', { name: /^Daily Dots/ })).toHaveAttribute('href', '/')
    expect(screen.getByText('Daily Dots', { exact: true })).toBeInTheDocument()
    expect(screen.getByText('© 2026 Svetlana Vrabie')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Journal archive' })).toHaveAttribute('href', '/journals')
    expect(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('link', { name: 'New reflection' })).toHaveAttribute('href', '/new')
  })

  it('offers all 12 moods on Home and prefills a new draft without saving it', async () => {
    const user = userEvent.setup()
    renderApp()
    const checkIn = await screen.findByRole('region', { name: 'What is your mood right now?' })
    expect(within(checkIn).getAllByRole('link')).toHaveLength(12)
    await user.click(within(checkIn).getByRole('link', { name: 'Write about feeling excited' }))
    expect(await screen.findByRole('radio', { name: 'Excited' })).toBeChecked()
    expect(screen.getAllByRole('radio')).toHaveLength(12)
    expect(screen.getByRole('textbox', { name: 'What’s on your mind?' })).toHaveValue('')
    expect(await journalRepository.list()).toEqual([])
  })

  it('navigates through every main destination and moves focus to the page content', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Your story starts here')
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(within(navigation).getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getAllByRole('button', { name: 'Download JSON backup' })).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: /Switch to .* theme/ })).toHaveLength(1)
    await user.click(within(navigation).getByRole('link', { name: 'Journal archive' }))
    expect(await screen.findByRole('heading', { name: /^Journal archive/ })).toBeInTheDocument()
    expect(within(navigation).getByRole('link', { name: 'Journal archive' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('main')).toHaveFocus()
    await user.click(within(navigation).getByRole('link', { name: 'New reflection' }))
    expect(await screen.findByRole('textbox', { name: 'What’s on your mind?' })).toHaveValue('')
    expect(within(navigation).getByRole('link', { name: 'New reflection' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('main')).toHaveFocus()
    await user.click(within(navigation).getByRole('link', { name: 'Overview' }))
    expect(await screen.findByRole('region', { name: 'Journal summary' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveFocus()
  })

  it('preserves today’s reflection and saved mood until a quick-check-in update is saved', async () => {
    const today = todayKey()
    await journalRepository.save({ date: today, mood: 'calm', text: 'Synthetic existing reflection.' })
    const user = userEvent.setup()
    renderApp()
    expect(await screen.findByRole('link', { name: 'Saved today: Calm' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Write about feeling grateful' }))
    expect(await screen.findByRole('radio', { name: 'Grateful' })).toBeChecked()
    expect(screen.getByRole('textbox', { name: 'What’s on your mind?' })).toHaveValue('Synthetic existing reflection.')
    expect((await journalRepository.list())[0].mood).toBe('calm')
    await user.click(screen.getByRole('button', { name: 'Update entry' }))
    expect(await screen.findByText('Feeling grateful')).toBeInTheDocument()
    const entries = await journalRepository.list()
    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({ mood: 'grateful', text: 'Synthetic existing reflection.' })
  })

  it('shows new emotions in history cards and mood filters', async () => {
    await journalRepository.save({ date: '2026-03-08', mood: 'overwhelmed', text: 'Synthetic overwhelmed reflection.' })
    await journalRepository.save({ date: '2026-03-09', mood: 'proud', text: 'Synthetic proud reflection.' })
    const user = userEvent.setup()
    renderApp('/journals')
    const filter = await screen.findByRole('combobox', { name: 'Filter by mood' })
    expect(within(filter).getAllByRole('option')).toHaveLength(13)
    await user.selectOptions(filter, 'overwhelmed')
    expect(screen.getByText('1 entry found')).toBeInTheDocument()
    expect(within(screen.getByRole('article')).getByText('Overwhelmed')).toBeInTheDocument()
    expect(screen.queryByText('Synthetic proud reflection.')).not.toBeInTheDocument()
  })

  it('reports an invalid mood parameter and lets the user choose a valid emotion', async () => {
    renderApp('/new?date=2026-03-08&mood=not-a-mood')
    expect(await screen.findByRole('alert')).toHaveTextContent('mood isn’t recognized')
    for (const mood of MOODS) {
      expect(screen.getByRole('radio', { name: mood.label })).not.toBeChecked()
    }
  })

  it('shows an honest empty state and no invented journal history', async () => {
    renderApp()
    expect(await screen.findByText('Your story starts here')).toBeInTheDocument()
    expect(screen.getByText('0 days')).toBeInTheDocument()
  })

  it('creates, views, updates, reloads, cancels deletion, and deletes one daily entry', async () => {
    const user = userEvent.setup()
    const view = renderApp('/new?date=2026-03-08')
    await screen.findByRole('textbox', { name: 'What’s on your mind?' })
    await user.click(screen.getByRole('radio', { name: 'Calm' }))
    await user.type(screen.getByRole('textbox', { name: 'What’s on your mind?' }), 'Synthetic first reflection.')
    await user.click(screen.getByRole('button', { name: 'Save my day' }))
    expect(await screen.findByText('Synthetic first reflection.')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Edit entry' }))
    expect(await screen.findByText(/Saving will update that entry/)).toBeInTheDocument()
    const text = screen.getByRole('textbox', { name: 'What’s on your mind?' })
    await user.clear(text)
    await user.type(text, 'Synthetic updated reflection.')
    await user.click(screen.getByRole('radio', { name: 'Happy' }))
    await user.click(screen.getByRole('button', { name: 'Update entry' }))
    expect(await screen.findByText('Synthetic updated reflection.')).toBeInTheDocument()
    expect(await journalRepository.list()).toHaveLength(1)
    view.unmount()
    renderApp('/journals/2026-03-08')
    expect(await screen.findByText('Synthetic updated reflection.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Delete journal entry' }))
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Keep my entry' }))
    expect(await journalRepository.list()).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Delete journal entry' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete entry' }))
    expect(await screen.findByText('Your story starts here')).toBeInTheDocument()
    expect(await journalRepository.list()).toHaveLength(0)
  })

  it('validates blank content and missing mood', async () => {
    const user = userEvent.setup()
    renderApp('/new?date=2026-03-08')
    await user.click(await screen.findByRole('button', { name: 'Save my day' }))
    expect(await screen.findByText('Choose how you felt.')).toBeInTheDocument()
    expect(screen.getByText('Write a little something about your day.')).toBeInTheDocument()
    expect(await journalRepository.list()).toHaveLength(0)
  })

  it('keeps the confirmation open in StrictMode and exports only retained entries after deletion', async () => {
    const user = userEvent.setup()
    const removed = await journalRepository.save({ date: '2026-03-08', mood: 'calm', text: 'Synthetic entry to delete.' })
    const retained = await journalRepository.save({ date: '2026-03-09', mood: 'happy', text: 'Synthetic entry to keep.' })
    const createObjectURL = vi.fn<(blob: Blob) => string>().mockReturnValue('blob:synthetic-backup')
    vi.stubGlobal('URL', class extends URL {
      static createObjectURL = createObjectURL
      static revokeObjectURL = vi.fn()
    })
    const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      expect(this.download).toBe(`daily-dots-${todayKey()}.json`)
    })
    async function readBackup() {
      await user.click(screen.getAllByRole('button', { name: 'Download JSON backup' })[0])
      expect(download).toHaveBeenCalled()
      const blob = createObjectURL.mock.calls[createObjectURL.mock.calls.length - 1][0]
      const json = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(reader.error)
        reader.readAsText(blob)
      })
      return JSON.parse(json) as unknown
    }

    const view = render(<StrictMode><MemoryRouter initialEntries={['/journals/2026-03-08']}><App /></MemoryRouter></StrictMode>)
    const deleteButton = await screen.findByRole('button', { name: 'Delete journal entry' })
    await user.click(deleteButton)
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
    const dialog = screen.getByRole('dialog', { name: 'Let this entry go?' })
    expect(dialog).toHaveAttribute('open')
    expect(within(dialog).getByRole('button', { name: 'Keep my entry' })).toHaveFocus()
    expect(await journalRepository.list()).toEqual([retained, removed])
    await user.click(within(dialog).getByRole('button', { name: 'Keep my entry' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(await readBackup()).toMatchObject({ format: 'daily-dots', version: 1, entries: [retained, removed] })

    await user.click(deleteButton)
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete entry' }))
    expect(await screen.findByText('1 entry · newest first')).toBeInTheDocument()
    expect(screen.queryByText(removed.text)).not.toBeInTheDocument()
    expect(screen.getByText(retained.text)).toBeInTheDocument()
    expect(await journalRepository.list()).toEqual([retained])
    expect(await readBackup()).toMatchObject({ format: 'daily-dots', version: 1, entries: [retained] })

    view.unmount()
    renderApp('/journals')
    expect(await screen.findByText('1 entry · newest first')).toBeInTheDocument()
    expect(screen.queryByText(removed.text)).not.toBeInTheDocument()
    expect(await readBackup()).toMatchObject({ entries: [retained] })
  })

  it('keeps the confirmation and entry available when deletion fails, then allows retrying', async () => {
    const entry = await journalRepository.save({ date: '2026-03-08', mood: 'calm', text: 'Synthetic preserved entry.' })
    const user = userEvent.setup()
    renderApp('/journals/2026-03-08')
    await user.click(await screen.findByRole('button', { name: 'Delete journal entry' }))
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Full') })
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete entry' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('could not be saved')
    expect(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete entry' })).toBeEnabled()
    expect(await journalRepository.list()).toEqual([entry])
    expect(screen.getByText(entry.text)).toBeInTheDocument()
    write.mockRestore()
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete entry' }))
    expect(await screen.findByText('Your story starts here')).toBeInTheDocument()
    expect(await journalRepository.list()).toEqual([])
  })

  it('loads the existing entry when Add New Journal targets an occupied date', async () => {
    await journalRepository.save({ date: '2026-03-08', mood: 'calm', text: 'Synthetic existing text.' })
    renderApp('/new?date=2026-03-08')
    expect(await screen.findByRole('textbox', { name: 'What’s on your mind?' })).toHaveValue('Synthetic existing text.')
    expect(screen.getByRole('radio', { name: 'Calm' })).toBeChecked()
    expect(screen.getByRole('button', { name: 'Update entry' })).toBeInTheDocument()
  })

  it('keeps the draft and reports a storage write failure', async () => {
    const user = userEvent.setup()
    renderApp('/new?date=2026-03-08')
    await screen.findByRole('textbox', { name: 'What’s on your mind?' })
    await user.click(screen.getByRole('radio', { name: 'Calm' }))
    await user.type(screen.getByRole('textbox', { name: 'What’s on your mind?' }), 'Unsaved synthetic text.')
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Full') })
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    await user.click(screen.getByRole('button', { name: 'Save my day' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('could not be saved')
    expect(screen.getByRole('textbox', { name: 'What’s on your mind?' })).toHaveValue('Unsaved synthetic text.')
  })

  it('blocks editing instead of replacing corrupted journals with empty data', async () => {
    localStorage.setItem(JOURNAL_STORAGE_KEY, '{broken')
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    renderApp('/new')
    expect(await screen.findByRole('alert')).toHaveTextContent('have not been changed')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Download JSON backup' })).toBeDisabled()
    expect(localStorage.getItem(JOURNAL_STORAGE_KEY)).toBe('{broken')
  })

  it('filters journals and clears filters', async () => {
    await journalRepository.save({ date: '2026-03-08', mood: 'calm', text: 'Synthetic green notebook.' })
    await journalRepository.save({ date: '2026-03-09', mood: 'sad', text: 'Synthetic blue notebook.' })
    const user = userEvent.setup()
    renderApp('/journals')
    await user.type(await screen.findByRole('searchbox', { name: 'Search journals' }), 'green')
    expect(screen.getByText('1 entry found')).toBeInTheDocument()
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by mood' }), 'sad')
    expect(screen.getByText('No entries found')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByText('2 entries · newest first')).toBeInTheDocument()
  })

  it('uses a manual persistent theme toggle', async () => {
    const user = userEvent.setup()
    const view = renderApp()
    await screen.findByText('Your story starts here')
    await user.click(screen.getAllByRole('button', { name: 'Switch to dark theme' })[0])
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('dark'))
    expect(localStorage.getItem('daily-dots:theme:v1')).toBe('dark')
    view.unmount()
    const restored = renderApp()
    await screen.findByText('Your story starts here')
    expect(document.documentElement.dataset.theme).toBe('dark')
    await user.click(screen.getAllByRole('button', { name: 'Switch to light theme' })[0])
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('light'))
    expect(localStorage.getItem('daily-dots:theme:v1')).toBe('light')
    restored.unmount()
    renderApp()
    await screen.findByText('Your story starts here')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('handles invalid dates and missing routes without crashing', async () => {
    const view = renderApp('/new?date=2026-02-30')
    expect(await screen.findByRole('alert')).toHaveTextContent('isn’t valid')
    view.unmount()
    renderApp('/does-not-exist')
    expect(await screen.findByRole('heading', { name: 'A little off the page' })).toBeInTheDocument()
  })
})
