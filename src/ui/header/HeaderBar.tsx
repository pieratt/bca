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
const STORAGE_KEY = 'bca-header-tracking'

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

const letterKey = (word: string, index: number) => `${word}-${index}`
const wordKey = (left: string, right: string) => `${left}-${right}`

const defaultTracking = (): Tracking => ({
  letters: {...DEFAULT_LETTERS},
  words: {...DEFAULT_WORDS},
})

const loadTracking = (): Tracking => {
  const fallback = defaultTracking()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Tracking
    return {
      letters: {...fallback.letters, ...parsed.letters},
      words: {...fallback.words, ...parsed.words},
    }
  } catch {
    return fallback
  }
}

export const HeaderBar = ({books, designers}: {books: number; designers: number}) => {
  const frameRef = useRef<HTMLHeadingElement>(null)
  const markRef = useRef<HTMLSpanElement>(null)
  const [tracking, setTracking] = useState<Tracking>(defaultTracking)

  useLayoutEffect(() => {
    setTracking(loadTracking())
  }, [])

  useLayoutEffect(() => {
    const frame = frameRef.current
    const mark = markRef.current
    if (!frame || !mark) return

    const fit = () => {
      mark.style.fontSize = `${BASE_SIZE}px`
      const natural = mark.scrollWidth
      const available = frame.clientWidth
      const next = natural > 0 ? Math.max(22, BASE_SIZE * Math.min(1, available / natural)) : BASE_SIZE
      mark.style.fontSize = `${next}px`
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [tracking])

  const tagline = (
    <>
      {books.toLocaleString('en-US')} beautiful book
      <br />
      covers by {designers.toLocaleString('en-US')} designers.
      <br />
      Updated Daily
    </>
  )

  const taglineLine = `${books.toLocaleString('en-US')} beautiful book covers by ${designers.toLocaleString('en-US')} designers. Updated Daily`

  return (
    <>
      <Shell className={`header-frame ${helveticaNow.className}`}>
        <Banner className="header" role="banner" href="/">
          <Intro>{taglineLine}</Intro>
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
                            ? {marginInlineEnd: `${tracking.letters[letterKey(word, index)] ?? DEFAULT_LETTERS[letterKey(word, index)]}em`}
                            : wordIndex < WORDS.length - 1
                              ? {
                                  marginInlineEnd: `${tracking.words[wordKey(word, WORDS[wordIndex + 1])] ?? DEFAULT_WORDS[wordKey(word, WORDS[wordIndex + 1])]}em`,
                                }
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
            <Stats>{tagline}</Stats>
          </Inner>
        </Banner>
      </Shell>
    </>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(16px, 2.4cqi, 40px);
  box-sizing: border-box;
  margin: 8px;
  padding: clamp(12px, 1.2cqi + 8px, 24px) clamp(14px, 2cqi, 28px);
  border: 1px solid #fff;
`

const Title = styled.h1`
  display: block;
  min-width: 0;
  flex: 1 1 auto;
  margin: 0;
  padding: 0;
  color: inherit;
  font-family: inherit;
  font-weight: 400;
  line-height: 0.82;
  letter-spacing: 0;
  text-indent: 0;
  background: none;
  overflow: visible;

  .wordmark,
  .word {
    display: flex;
    align-items: flex-end;
    white-space: nowrap;
  }

  .letter {
    display: block;
    flex: 0 0 auto;
    line-height: 0;
  }

  .letter svg {
    display: block;
    height: 1em;
    width: auto;
    fill: currentColor;
  }
`

const Intro = styled.p`
  display: block;
  margin: 0;
  padding: 10px 14px 6px;
  color: #fff;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 0.01em;
  text-align: right;
  white-space: nowrap;

  @media only screen and (min-width: 744px) {
    display: none;
  }
`

const Stats = styled.p`
  display: none;
  flex: 0 0 auto;
  margin: 0;
  max-width: 14em;
  color: inherit;
  font-family: inherit;
  font-size: clamp(9px, 0.55cqi + 7.5px, 12px);
  font-weight: 400;
  line-height: 1.28;
  letter-spacing: 0.01em;
  text-align: right;

  @media only screen and (min-width: 744px) {
    display: block;
  }
`
