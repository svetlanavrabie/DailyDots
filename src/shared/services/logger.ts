export const logger = {
  error(operation: string) {
    console.error(`[Daily Dots] ${operation} failed. No journal content was logged.`)
  },
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}
