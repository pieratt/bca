'use client'
import {styled} from '@linaria/react'
import {forwardRef, type ComponentProps, type ForwardedRef} from 'react'
import {InputWrapper, Label, Message} from './lib'
import {InputProps} from './lib/types'

const CustomStringControl = (
  {
    label,
    className,
    message,
    inputStyle = 'normal',
    messageType,
    ...props
  }: InputProps<ComponentProps<'input'>>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <Wrapper className={className}>
      <InputWrapper
        disabled={props.disabled}
        className={`${inputStyle} ${!!message ? 'ERROR' : ''}`}
      >
        <input {...props} ref={ref} name={props.name} />

        <Label htmlFor={props.name} className={inputStyle}>
          {label}
          {props.required ? ' *' : ''}
        </Label>
      </InputWrapper>
      <Message inputStyle={inputStyle} message={message} messageType={messageType} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;

  &.focused input {
    border-color: rgba(var(--surface-inv-tertiary)) !important;
  }
`

export const StringControl = forwardRef(CustomStringControl)
