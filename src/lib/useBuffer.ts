'use client'

import {useEffect, useState} from 'react'

const DEFAULT_BUFFER_TIMEOUT = 500

export const useBuffer = <T>(
  input: T | undefined,
  timeout: number = DEFAULT_BUFFER_TIMEOUT,
  timeIn = 0
) => {
  const [bufferedValue, setBufferedValue] = useState<T>()

  useEffect(() => {
    const clearBufferedTimeout = setTimeout(
      () => setBufferedValue(input),
      !!input ? timeIn : timeout
    )
    return () => {
      window.clearTimeout(clearBufferedTimeout)
    }
  }, [input, setBufferedValue, timeIn, timeout])
  return bufferedValue
}
