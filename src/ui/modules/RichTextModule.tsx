import {styled} from '@linaria/react'
import {RichText} from '@/ui'
import {ModuleWrapper} from '../primitives'

export const RichTextModule = ({module: {copy}}: {module: NonNullable<Sanity.RichTextModule>}) => (
  <>
    <StyledModuleWrapper>
      <Wrapper>{copy && <RichText value={copy} />}</Wrapper>
    </StyledModuleWrapper>
  </>
)

const StyledModuleWrapper = styled(ModuleWrapper)`
  padding-top: var(--gapS);
  padding-bottom: var(--gapS);
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--gapM);

  @media only screen and (min-width: 744px) {
    margin: 0 auto;
    width: max(445px, min(700px, calc((700 / 1728) * 100vw)));
  }
`
