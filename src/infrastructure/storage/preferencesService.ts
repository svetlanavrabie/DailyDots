import { logger } from '@/shared/services/logger'

export type Theme = 'light' | 'dark'
const THEME_KEY = 'daily-dots:theme:v1'

export function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved !== null && saved !== 'light' && saved !== 'dark') {
      logger.error('Validating theme preference; using light theme')
    }
    return saved === 'dark' ? 'dark' : 'light'
  } catch {
    logger.error('Reading theme preference; using light theme')
    return 'light'
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    logger.error('Saving theme preference')
    throw new Error('Your theme preference could not be saved. Enable browser storage and try again.')
  }
}
