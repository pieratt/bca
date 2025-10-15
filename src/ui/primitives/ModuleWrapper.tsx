import {styled} from '@linaria/react'

export const ModuleWrapper = styled.main`
  padding: var(--gapM);
  // padding: var(--gapM) 84px;

  @media only screen and (max-width: 743px) {
    &.mobile-full-bleed {
      padding: 2rem 0;
    }
  }

  @media only screen and (min-width: 1728px) {
    padding: 40px calc((100vw - var(--windowMaxWidth)) / 2);
    // padding: 40px calc((100vw - var(--windowMaxWidth) + 84px) / 2);
  }
`
