import { useEffect, useRef, useState } from 'react'

/** Animates a number from 0 to `target` with an ease-out curve. */
export function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 4)
      setValue(target * eased)
      if (t < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target, duration])

  return value
}
