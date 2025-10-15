'use client'
import {styled} from '@linaria/react'
import {forwardRef, useId, type ComponentProps, type ForwardedRef} from 'react'
import {InputWrapper, Label, Message} from './lib'
import {InputProps} from './lib/types'

const CustomTextareaControl = (
  {
    required,
    label,
    className,
    message,
    icon,
    inputStyle = 'normal',
    messageType,
    ...props
  }: InputProps<ComponentProps<'textarea'>>,
  ref: ForwardedRef<HTMLTextAreaElement>
) => {
  const id = useId()
  return (
    <Wrapper className={className}>
      <InputWrapper disabled={props.disabled} hasIcon={!!icon} className={inputStyle}>
        <textarea name={id} ref={ref} rows={3} {...props} />

        <StyledLabel htmlFor={id} className={inputStyle}>
          {label}
          {required ? ' *' : ''}
        </StyledLabel>

        <Message inputStyle={inputStyle} message={message} messageType={messageType} />
      </InputWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;
`

const StyledLabel = styled(Label)`
  textarea ~ & {
    height: 48px;
    @media only screen and (min-width: 744px) {
      height: 56px;
    }
  }

  textarea:focus ~ &,
  textarea:not(:placeholder-shown) ~ &,
  textarea:required:valid ~ &,
  &.valid {
    transform: translate3d(0, -11px, 0) scale3d(0.8, 0.8, 1);
  }
`

export const TextControl = forwardRef(CustomTextareaControl)
