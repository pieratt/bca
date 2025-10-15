import {useBuffer, useStretchToAuto} from '@/lib'
import {styled} from '@linaria/react'
import {IMessage} from './types'

export const Message = ({message, inputStyle = 'normal', messageType = 'NEUTRAL'}: IMessage) => {
  const {stretchableRef, wrapperRef} = useStretchToAuto()

  const bufferedMessage = useBuffer(message, 550)

  return (
    <Wrapper
      className={`${inputStyle} ${messageType} ${!!message ? 'hasMessage' : ''}`}
      ref={wrapperRef}
      style={{
        maxHeight: !!message ? `36px` : 0,
        // todo: hard-coding the height doesn't support multi-line messages.
        // the line below fixes that, but it's miscalculating for some reason.
        //        maxHeight: !!message ? `${stretchableRef.current?.clientHeight}px` : 0,
      }}
    >
      <MessageBox ref={stretchableRef}>{bufferedMessage as string}</MessageBox>
    </Wrapper>
  )
}

interface IWrapper {
  maxHeight?: number
}

const Wrapper = styled.div<IWrapper>`
  position: relative;
  height: auto;
  overflow: hidden;
  pointer-events: none;

  &.NEUTRAL {
    color: rgba(var(--text-secondary), 1);
  }

  &.ERROR {
    color: rgba(var(--error-static), 1);
  }

  &.SUCCESS {
    color: rgba(var(--success-static), 1);
  }

  &.WARNING {
    color: rgba(var(--text-secondary), 1);
  }

  max-height: 0;
  opacity: 0;
  transform: translate3d(0, -100%, 0);
  transform-origin: top;
  transition: max-height 0.5s ease-in-out, color 0.25s linear, transform 0.5s ease-in-out,
    opacity 0.35s ease-in-out;

  &.hasMessage {
    transform: translate3d(0, 0, 0);
    opacity: 1;
    transition: max-height 0.5s ease-in-out, color 0.25s linear, transform 0.5s ease-in-out,
      opacity 0.45s ease-in-out;
  }
`

export const MessageBox = styled.div`
  display: flex;
  position: relative;
  height: fit-content;
  padding: calc(var(--l4) - 4px) var(--l2);
`
