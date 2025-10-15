'use client'
import {InputWrapper, Label, Message} from './lib'
import {InputProps} from './lib/types'
import {forwardRef, type ComponentProps, type ForwardedRef} from 'react'
import styled from 'styled-components'

const CustomSelectControl = (
  {
    label,
    className,
    message,
    icon,
    inputStyle = 'normal',
    messageType,
    children,
    ...props
  }: InputProps<ComponentProps<'select'>>,
  ref: ForwardedRef<HTMLSelectElement>
) => {
  return (
    <Wrapper className={className}>
      <InputWrapper
        disabled={props.disabled}
        hasIcon={!!icon || !!props.disabled}
        className={inputStyle}
      >
        <select {...props} ref={ref}>
          {children}
        </select>

        <Label htmlFor={props.name} className={inputStyle}>
          {label}
          {props.required ? ' *' : ''}
        </Label>

        <Arrow />
      </InputWrapper>
      <Message inputStyle={inputStyle} message={message} messageType={messageType} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;
`

const Arrow = styled.div`
  pointer-events: none;
  position: absolute;
  top: 22px;
  right: 14px;
  width: 14px;
  height: 20px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid var(--cream);

  transition: opacity 0.15s ease-in-out;
  &.filled {
    opacity: 0;
  }
`

export const SelectControl = forwardRef(CustomSelectControl)
