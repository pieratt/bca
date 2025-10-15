'use client'

import {styled} from '@linaria/react'
import type {PropsWithChildren} from 'react'
import {PortableText} from '@portabletext/react'

export const RichText = ({value}: {value: any}) => (
  <PortableText value={value} components={copyRenderers} />
)

export const copyRenderers = {
  block: {
    normal: ({children}: PropsWithChildren) => <Normal>{children}</Normal>,
    titleSmall: ({children}: PropsWithChildren) => <TitleSmall>{children}</TitleSmall>,
    titleNormal: ({children, as}: PropsWithChildren & {as?: React.ElementType}) => (
      <TitleNormal as={as}>{children}</TitleNormal>
    ),
    titleLarge: ({children}: PropsWithChildren) => <TitleLarge>{children}</TitleLarge>,
  },
  marks: {
    em: ({children}: PropsWithChildren) => <em>{children}</em>,
    strong: ({children}: PropsWithChildren) => <strong>{children}</strong>,
  },
  list: {
    bullet: ({children}: PropsWithChildren) => <Bullets>{children}</Bullets>,
    number: ({children}: PropsWithChildren) => <Numbered>{children}</Numbered>,
  },
}

const Bullets = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--gapS);
  li {
    display: block;
    position: relative;
    margin-left: 28px;
    @media only screen and (min-width: 744px) {
      margin-left: min(calc(35 / 1728 * 100vw), 35px);
    }
    font-size: var(--normal);
    line-height: var(--normalLine);
    text-box: trim-both cap alphabetic;
    &:before {
      content: ' ';
      position: absolute;
      left: -20px;
      top: 0px;
      width: 12px;
      height: 12px;
      @media only screen and (min-width: 744px) {
        left: min(calc(-27 / 1728 * 100vw), -27px);
        top: min(calc(-3 / 1728 * 100vw), -3px);
        width: min(calc(17 / 1728 * 100vw), 17px);
        height: min(calc(17 / 1728 * 100vw), 17px);
      }
      background-image: url('/bullet-1.svg');
      background-repeat: no-repeat;
      background-size: contain;
    }
    &:nth-child(even):before {
      background-image: url('/bullet-2.svg');
    }
  }
`

const Numbered = styled.ol``

export const Normal = styled.p`
  font-size: var(--normal);
  line-height: var(--normalLine);
  text-box: trim-both cap alphabetic;
`

export const TitleSmall = styled.h3`
  font-size: var(--titleSmall);
  line-height: var(--titleSmallLine);
  letter-spacing: var(--titleSmallLetter);
  font-weight: var(--titleSmallWeight);
  font-variant: var(--titleVariant);
  text-transform: uppercase;
  text-box: trim-both cap alphabetic;
`

export const TitleNormal = styled.h2`
  font-size: var(--titleNormal);
  line-height: var(--titleNormalLine);
  letter-spacing: var(--titleNormalLetter);
  font-weight: var(--titleNormalWeight);
  font-variant: var(--titleVariant);
  text-transform: uppercase;
  text-box: trim-both cap alphabetic;
`

export const TitleLarge = styled.h1`
  font-size: var(--titleLarge);
  line-height: var(--titleLargeLine);
  letter-spacing: var(--titleLargeLetter);
  font-weight: var(--titleLargeWeight);
  font-variant: var(--titleVariant);
  text-transform: uppercase;
  text-box: trim-both cap alphabetic;
`

export const EyebrowSmall = styled.h4`
  font-size: var(--eyebrowSmall);
  line-height: var(--eyebrowSmallLine);
  letter-spacing: var(--eyebrowSmallLetter);
  font-weight: var(--eyebrowSmallWeight);
  text-transform: uppercase;
  text-box: trim-both cap alphabetic;
`

export const Eyebrow = styled.h4`
  font-size: var(--eyebrow);
  line-height: var(--eyebrowLine);
  letter-spacing: var(--eyebrowLetter);
  font-weight: var(--eyebrowWeight);
  text-transform: uppercase;
  text-box: trim-both cap alphabetic;
`

export const EyebrowLarge = styled.h4`
  font-size: var(--eyebrowLarge);
  line-height: var(--eyebrowLargeLine);
  letter-spacing: var(--eyebrowLargeLetter);
  font-weight: var(--eyebrowLargeWeight);
  text-transform: uppercase;
  text-box: trim-both cap alphabetic;
`
