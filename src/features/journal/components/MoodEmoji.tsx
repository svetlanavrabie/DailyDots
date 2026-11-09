import { getMood } from '../types/journal'
import type { Mood } from '../types/journal'

interface MoodEmojiProps {
  mood: Mood
  size?: 'small' | 'medium' | 'large'
}

const sizes = {
  small: 'h-8 w-8 text-xl',
  medium: 'h-12 w-12 text-3xl',
  large: 'h-14 w-14 text-4xl',
}

export function MoodEmoji({ mood, size = 'medium' }: MoodEmojiProps) {
  const definition = getMood(mood)
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center rounded-full leading-none ${sizes[size]} ${definition.color}`}>
      {definition.emoji}
    </span>
  )
}
