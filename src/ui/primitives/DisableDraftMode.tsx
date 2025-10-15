'use client'

import {useDraftModeEnvironment} from 'next-sanity/hooks'
import {styled} from '@linaria/react'

export function DisableDraftMode() {
  const environment = useDraftModeEnvironment()

  // Only show the disable draft mode button when outside of Presentation Tool
  if (environment !== 'live' && environment !== 'unknown') {
    return null
  }

  return <Trigger href="/api/draft-mode/disable">Disable Draft Mode</Trigger>
}

const Trigger = styled.a`
  position: fixed;
  bottom: 0;
  right: 0;
  background: yellow;
`
