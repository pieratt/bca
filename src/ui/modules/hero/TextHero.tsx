import {styled} from '@linaria/react'
import {ModuleWrapper, RichText} from '@/ui'

export const TextHero = ({module}: {module: Sanity.Hero}) => (
  <ModuleWrapper>
    <Wrapper>{module.subtitle && <RichText value={module.subtitle} />}</Wrapper>
  </ModuleWrapper>
)

const Wrapper = styled.header`
  margin: auto;
  max-width: min(1200px, calc(1200 / 1728 * 100vw));

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--gapM);
  text-align: center;
`
