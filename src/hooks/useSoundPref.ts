import { useCallback, useState } from 'react'
import { loadMuted, saveMuted, unlockAudio } from '../lib/sound'

export interface SoundPref {
  muted: boolean
  toggle: () => void
}

/** Preferência de mudo, salva em localStorage. Alternar é um gesto: já destrava o áudio. */
export function useSoundPref(): SoundPref {
  const [muted, setMuted] = useState(loadMuted)
  const toggle = useCallback(() => {
    unlockAudio()
    setMuted((m) => {
      saveMuted(!m)
      return !m
    })
  }, [])
  return { muted, toggle }
}
