import { type ReactElement } from 'react'

type InputStyle = 'normal' | 'inverted' | 'staticDarkForm'

export type InputProps<T> = T & {
  label: string
  message?: string
  messageType?: MessageType
  icon?: ReactElement
  iconOnClick?: Function
  iconHidden?: boolean
  inputStyle?: InputStyle
  setValue?: Function
}

export interface IMessage {
  message?: string
  messageType?: MessageType
  inputStyle?: InputStyle
}

export interface IFormMessage {
  message?: string
  messageType?: MessageType
}
