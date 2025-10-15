'use client'

/* "You poked me!"
 *
 * This hook returns a touch function, and a touching state (boolean).
 * It flips back to untouched after a brief delay.
 * The purpose of this is to simulate the `active` toggle when a link is clicked, but it could have some other purposes.
 *
 * Usage:
 * const SomeComponent = () => {
 *   const { touch, touching } = useTouchable(1000)
 *   return (
 *     <div onTouchStart={touch} >
 *       {!touching ? 'dum dee doo' : 'poke!'}
 *     </div>
 *   )
 * }
 */
import {useState, useEffect, type TouchEventHandler} from 'react'

const DEFAULT_POKE_DELAY = 250

export const usePokeable = (delay: number = DEFAULT_POKE_DELAY) => {
  const [poking, setPoking] = useState(false)
  const poke: TouchEventHandler<HTMLElement> = () => setPoking(true)

  useEffect(() => {
    if (typeof window === 'undefined' || !poking) return
    const clear = setTimeout(() => setPoking(false), delay)
    return () => window.clearTimeout(clear)
  }, [poking])

  return {poke, poking}
}
