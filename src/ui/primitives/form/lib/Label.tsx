import {styled} from '@linaria/react'
import {type PropsWithChildren} from 'react'

export const Label = ({
  children,
  ...rest
}: PropsWithChildren & {htmlFor?: string; className?: string}) => (
  <LabelStyle {...rest}>{children}</LabelStyle>
)

const LabelStyle = styled.label`
  position: absolute;
  top: 0;
  left: max(12px, min(calc(12 / 1728 * 100vw), 12px));
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px 0;
  overflow: hidden;
  transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  transform-origin: center left;
  transition: color 0.25s linear, transform 0.4s ease-in-out;
  will-change: transform;
  pointer-events: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 16px;

  &.inverted {
    color: rgba(var(--text-inv-tertiary), 1);

    select:hover ~ &,
    input:hover ~ &,
    textarea:hover ~ & {
      color: rgba(var(--text-inv-primary), 1);
    }

    input:disabled ~ &,
    textarea:disabled ~ & {
      color: rgba(var(--text-inv-tertiary), 1);
    }
  }

  &.normal {
    color: rgba(var(--text-tertiary), 1);

    select:hover ~ &,
    input:hover ~ &,
    textarea:hover ~ & {
      color: rgba(var(--text-primary), 1);
    }

    select:disabled ~ &,
    input:disabled ~ &,
    textarea:disabled ~ & {
      color: rgba(var(--text-tertiary), 1);
    }
  }

  .PhoneInput:focus-within ~ &,
  .PhoneInput.hasData ~ &,
  select ~ &,
  input:focus ~ &,
  input:not(:placeholder-shown) ~ &,
  input:required:valid ~ &,
  select:focus ~ &,
  select:not(:placeholder-shown) ~ &,
  select:required:valid ~ &,
  textarea:focus ~ &,
  textarea:not(:placeholder-shown) ~ &,
  textarea:required:valid ~ &,
  &.valid {
    transform: translate3d(0, -11px, 0) scale3d(0.7, 0.7, 1);
  }
`
