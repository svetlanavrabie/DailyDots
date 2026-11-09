import { z } from 'zod'
import { isValid, parseISO, format } from 'date-fns'

export const MOODS = [
  { value: 'happy', label: 'Happy', emoji: '😊', color: 'bg-peach' },
  { value: 'calm', label: 'Calm', emoji: '😌', color: 'bg-mint' },
  { value: 'neutral', label: 'Okay', emoji: '😐', color: 'bg-accent-soft' },
  { value: 'sad', label: 'Sad', emoji: '😔', color: 'bg-accent-soft' },
  { value: 'anxious', label: 'Anxious', emoji: '😟', color: 'bg-rose' },
  { value: 'angry', label: 'Angry', emoji: '😤', color: 'bg-rose' },
  { value: 'excited', label: 'Excited', emoji: '🤩', color: 'bg-peach' },
  { value: 'grateful', label: 'Grateful', emoji: '🥰', color: 'bg-mint' },
  { value: 'hopeful', label: 'Hopeful', emoji: '🌤️', color: 'bg-accent-alt' },
  { value: 'proud', label: 'Proud', emoji: '😎', color: 'bg-accent-soft' },
  { value: 'tired', label: 'Tired', emoji: '😴', color: 'bg-accent-soft' },
  { value: 'overwhelmed', label: 'Overwhelmed', emoji: '😵‍💫', color: 'bg-rose' },
] as const

export const moodSchema = z.enum(MOODS.map((mood) => mood.value), {
  error: 'Choose how you felt.',
})

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a valid date.').refine(
  (value) => {
    const date = parseISO(value)
    return isValid(date) && format(date, 'yyyy-MM-dd') === value
  },
  'Choose a valid calendar date.',
)

export const journalInputSchema = z.object({
  date: dateSchema,
  mood: moodSchema,
  text: z.string().trim().min(1, 'Write a little something about your day.').max(20000, 'Keep your entry under 20,000 characters.'),
})

export const journalEntrySchema = journalInputSchema.extend({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Mood = z.infer<typeof journalInputSchema>['mood']
export type JournalInput = z.infer<typeof journalInputSchema>
export type JournalEntry = z.infer<typeof journalEntrySchema>

export interface JournalRepository {
  list(): Promise<JournalEntry[]>
  save(input: JournalInput): Promise<JournalEntry>
  remove(date: string): Promise<void>
}

export function getMood(value: Mood) {
  return MOODS.find((mood) => mood.value === value) ?? MOODS[2]
}
