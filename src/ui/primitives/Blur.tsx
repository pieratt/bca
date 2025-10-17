'use client'

import {styled} from '@linaria/react'
import {Blurhash} from 'react-blurhash'
import {memo} from 'react'

export const Blur = memo(styled(Blurhash)`
  position: absolute !important;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;

  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;

  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  &.loaded {
    opacity: 0;
  }

  pointer-events: none;
`)
