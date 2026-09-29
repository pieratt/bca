'use client'

import {useLayoutEffect, useRef, useState} from 'react'
import localFont from 'next/font/local'
import {styled} from '@linaria/react'
import {isHeaderLetter, LetterGlyph} from './letters'

const helveticaNow = localFont({
  src: '../../fonts/HelveticaNowDisplay-Regular.otf',
  weight: '400',
  display: 'swap',
})

const WORDS = ['BOOK', 'COVER', 'ARCHIVE'] as const
const BASE_SIZE = 80
const STORAGE_KEY = 'bca-header-tracking-v2'
const LEGACY_KEY = 'bca-header-tracking'

const DEFAULT_LETTERS: Record<string, number> = {
  'BOOK-0': 0.21,
  'BOOK-1': 0.21,
  'BOOK-2': 0.24,
  'COVER-0': 0.17,
  'COVER-1': 0.07,
  'COVER-2': 0.22,
  'COVER-3': 0.31,
  'ARCHIVE-0': 0.2,
  'ARCHIVE-1': 0.13,
  'ARCHIVE-2': 0.31,
  'ARCHIVE-3': 0.39,
  'ARCHIVE-4': 0.3,
  'ARCHIVE-5': 0.25,
}

const DEFAULT_WORDS: Record<string, number> = {
  'BOOK-COVER': 0.63,
  'COVER-ARCHIVE': 0.64,
}

type Tracking = {
  letters: Record<string, number>
  words: Record<string, number>
}

type TrackingPair = {
  initial: Tracking
  expanded: Tracking
}

const letterKey = (word: string, index: number) => `${word}-${index}`
const wordKey = (left: string, right: string) => `${left}-${right}`

const scaleTracking = (tracking: Tracking, factor: number): Tracking => ({
  letters: Object.fromEntries(Object.entries(tracking.letters).map(([key, value]) => [key, Number((value * factor).toFixed(2))])),
  words: Object.fromEntries(Object.entries(tracking.words).map(([key, value]) => [key, Number((value * factor).toFixed(2))])),
})

const defaultPair = (): TrackingPair => {
  const initial: Tracking = {
    letters: {...DEFAULT_LETTERS},
    words: {...DEFAULT_WORDS},
  }
  return {
    initial,
    expanded: scaleTracking(initial, 2.4),
  }
}

const asTracking = (value: Partial<Tracking> | undefined, fallback: Tracking): Tracking => ({
  letters: {...fallback.letters, ...value?.letters},
  words: {...fallback.words, ...value?.words},
})

const loadPair = (): TrackingPair => {
  const fallback = defaultPair()
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as TrackingPair | Tracking
    if ('initial' in parsed && 'expanded' in parsed) {
      return {
        initial: asTracking(parsed.initial, fallback.initial),
        expanded: asTracking(parsed.expanded, fallback.expanded),
      }
    }
    if ('letters' in parsed && 'words' in parsed) {
      const initial = asTracking(parsed, fallback.initial)
      return {initial, expanded: scaleTracking(initial, 2.4)}
    }
    return fallback
  } catch {
    return fallback
  }
}

export const HeaderBar = () => {
  const frameRef = useRef<HTMLHeadingElement>(null)
  const markRef = useRef<HTMLSpanElement>(null)
  const [pair, setPair] = useState<TrackingPair>(defaultPair)

  useLayoutEffect(() => {
    setPair(loadPair())
  }, [])

  useLayoutEffect(() => {
    const frame = frameRef.current
    const mark = markRef.current
    if (!frame || !mark) return

    const fit = () => {
      mark.style.fontSize = `${BASE_SIZE}px`
      mark.style.setProperty('--track-t', '0')
      const widthInitial = mark.scrollWidth
      mark.style.setProperty('--track-t', '1')
      const widthExpanded = mark.scrollWidth
      const available = frame.clientWidth

      if (widthInitial <= 0) return

      if (available <= widthInitial) {
        mark.style.setProperty('--track-t', '0')
        mark.style.fontSize = `${Math.max(12, BASE_SIZE * (available / widthInitial))}px`
        return
      }

      const span = widthExpanded - widthInitial
      const nextT = span <= 0 ? 1 : Math.min(1, (available - widthInitial) / span)
      mark.style.setProperty('--track-t', String(nextT))
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [pair])

  const gapStyle = (initial: number, expanded: number) =>
    ({
      '--gap-initial': `${initial}em`,
      '--gap-expanded': `${expanded}em`,
    }) as React.CSSProperties

  return (
    <Shell className={`header-frame ${helveticaNow.className}`}>
      <Banner className="header" role="banner" href="/">
        <Inner>
          <Title ref={frameRef}>
            <span className="sr-only">Book Cover Archive</span>
            <span className="wordmark" aria-hidden="true" ref={markRef}>
              {WORDS.map((word, wordIndex) => (
                <span className="word" key={word}>
                  {[...word].map((letter, index) => (
                    <span
                      className="letter"
                      key={`${word}-${index}`}
                      style={
                        index < word.length - 1
                          ? gapStyle(
                              pair.initial.letters[letterKey(word, index)] ?? DEFAULT_LETTERS[letterKey(word, index)],
                              pair.expanded.letters[letterKey(word, index)] ?? DEFAULT_LETTERS[letterKey(word, index)],
                            )
                          : wordIndex < WORDS.length - 1
                            ? gapStyle(
                                pair.initial.words[wordKey(word, WORDS[wordIndex + 1])] ?? DEFAULT_WORDS[wordKey(word, WORDS[wordIndex + 1])],
                                pair.expanded.words[wordKey(word, WORDS[wordIndex + 1])] ?? DEFAULT_WORDS[wordKey(word, WORDS[wordIndex + 1])],
                              )
                            : undefined
                      }
                    >
                      {isHeaderLetter(letter) ? <LetterGlyph letter={letter} /> : letter}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </Title>
        </Inner>
      </Banner>
    </Shell>
  )
}

const Shell = styled.div`
  width: 100%;
  margin: 0;
  box-sizing: border-box;

  @media only screen and (min-width: 744px) {
    width: calc(100vw - 40px);
    margin: 16px auto 0;
  }

  @media only screen and (min-width: 900px) {
    width: calc(100vw - 50px);
  }
`

const Banner = styled.a`
  && {
    container-type: inline-size;
    container-name: site-header;
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    background: #000;
    color: #fff;
    text-decoration: none;
    border: 0;
    outline: none;
  }

  &&:hover,
  &&:focus,
  &&:active,
  &&:visited {
    color: #fff;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`

const Inner = styled.div`
  display: block;
  box-sizing: border-box;
  margin: 8px;
  padding: clamp(12px, 1.2cqi + 8px, 24px) clamp(14px, 2cqi, 28px);
  border: 1px solid #fff;
`

const Title = styled.h1`
  display: block;
  min-width: 0;
  margin: 0;
  padding: 0;
  color: inherit;
  font-family: inherit;
  font-weight: 400;
  line-height: 0.82;
  letter-spacing: 0;
  text-align: center;
  text-indent: 0;
  background: none;
  overflow: hidden;

  .wordmark,
  .word {
    display: inline-flex;
    align-items: flex-end;
    white-space: nowrap;
  }

  .wordmark {
    --track-t: 0;
  }

  .letter {
    display: block;
    flex: 0 0 auto;
    line-height: 0;
    margin-inline-end: calc(var(--gap-initial, 0em) + (var(--gap-expanded, 0em) - var(--gap-initial, 0em)) * var(--track-t, 0));
  }

  .letter svg {
    display: block;
    height: 1em;
    width: auto;
    fill: currentColor;
  }
`
