import {ImageResponse} from 'next/og'
import {GLYPHS, isHeaderLetter} from '../../ui/header/letters'

export const alt = 'Book Cover Archive'
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'

const WORDS = ['BOOK', 'COVER', 'ARCHIVE'] as const

const LETTER_GAPS: Record<string, number> = {
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

const WORD_GAPS: Record<string, number> = {
  'BOOK-COVER': 0.63,
  'COVER-ARCHIVE': 0.64,
}

const TRACK = 1.35
const INSET = 28
const BORDER = 2
const PAD_X = 48
const PAD_Y = 36

const viewSize = (viewBox: string) => {
  const parts = viewBox.split(' ').map(Number)
  return {width: parts[2], height: parts[3]}
}

const letterSize = (letter: string, height: number) => {
  if (!isHeaderLetter(letter)) return {width: height * 0.55, height}
  const box = viewSize(GLYPHS[letter].viewBox)
  return {width: (box.width / box.height) * height, height}
}

const gapAfter = (word: (typeof WORDS)[number], index: number, wordIndex: number, font: number) => {
  if (index < word.length - 1) return (LETTER_GAPS[`${word}-${index}`] ?? 0) * TRACK * font
  if (wordIndex < WORDS.length - 1) return (WORD_GAPS[`${word}-${WORDS[wordIndex + 1]}`] ?? 0) * TRACK * font
  return 0
}

const markWidth = (font: number) =>
  WORDS.reduce((total, word, wordIndex) => {
    return (
      total +
      [...word].reduce((sum, letter, index) => {
        return sum + letterSize(letter, font).width + gapAfter(word, index, wordIndex, font)
      }, 0)
    )
  }, 0)

export default function OpenGraphImage() {
  const contentWidth = size.width - INSET * 2 - BORDER * 2 - PAD_X * 2
  const FONT = contentWidth * (100 / markWidth(100))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#000',
          padding: INSET,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `${BORDER}px solid #fff`,
            padding: `${PAD_Y}px ${PAD_X}px`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              width: contentWidth,
            }}
          >
            {WORDS.map((word, wordIndex) =>
              [...word].map((letter, index) => {
                const glyph = isHeaderLetter(letter) ? GLYPHS[letter] : null
                const {width, height} = letterSize(letter, FONT)
                const gap = gapAfter(word, index, wordIndex, FONT)

                return (
                  <div
                    key={`${word}-${index}`}
                    style={{
                      display: 'flex',
                      marginRight: gap,
                      width,
                      height,
                    }}
                  >
                    {glyph ? (
                      <svg
                        width={width}
                        height={height}
                        viewBox={glyph.viewBox}
                        fill="#fff"
                      >
                        <path d={glyph.d} />
                      </svg>
                    ) : (
                      letter
                    )}
                  </div>
                )
              }),
            )}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
