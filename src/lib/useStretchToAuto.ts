'use client'

import {useRef, useEffect, useState} from 'react'

export const useStretchToAuto = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const initialHeightRef = useRef<number>(null)

  const stretchableRef = useRef<HTMLDivElement>(null)
  const maxHeightRef = useRef<number>(null)

  const [stretched, setStretched] = useState(false)

  useEffect(() => {
    if (!stretchableRef.current || !wrapperRef.current) {
      return
    }
    initialHeightRef.current = wrapperRef.current.clientHeight
    maxHeightRef.current = stretchableRef.current.clientHeight

    if (initialHeightRef.current >= maxHeightRef.current) {
      setStretched(true)
    }
  }, [stretchableRef.current, wrapperRef.current])

  return {stretched, setStretched, maxHeightRef, wrapperRef, initialHeightRef, stretchableRef}
}
