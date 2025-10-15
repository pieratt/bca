import {styled} from '@linaria/react'

export const InputWrapper = styled.div<{
  disabled?: boolean
  hasIcon?: boolean
}>`
  position: relative;

  textarea,
  select,
  input {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 100%;
    height: max(56px, min(calc(56 / 1728 * 100vw), 56px));
    padding: max(12px, min(calc(12 / 1728 * 100vw), 12px))
      max(12px, min(calc(12 / 1728 * 100vw), 12px)) 0;
    border-radius: 0;
    border: 0.5px solid;
    border-color: inherit;
    outline: none;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.05);
    transform: translate3d(0, 0, 0);
    transition: background-color 0.25s linear, border 0.25s linear, box-shadow 0.25s linear,
      color 0.25s linear;
    will-change: transform;
    appearance: none;

    font-size: 16px;

    &::placeholder {
      transition: color 0.25s linear;
    }

    &::-webkit-contacts-auto-fill-button,
    &::-webkit-credentials-auto-fill-button {
      margin-top: -12px;
    }

    /* Firefox */
    &[type='number'] {
      -moz-appearance: textfield;
    }

    //     &.NEUTRAL {
    //       border-color: rgba(var(--text-secondary), 1);
    //     }
    //
    //     &.ERROR {
    //       border-color: rgba(var(--error-static), 1);
    //     }
    //
    //     &.SUCCESS {
    //       border-color: rgba(var(--success-static), 1);
    //     }
    //
    //     &.WARNING {
    //       border-color: rgba(var(--text-secondary), 1);
    //     }
  }

  textarea {
    height: auto;
    min-height: 120px;
    padding-top: 23px;
    padding-bottom: 16px;

    @media only screen and (min-width: 744px) {
      min-height: 160px;
      padding-top: 28px;
    }
  }

  textarea,
  input,
  select {
    background-color: transparent;
    border-color: var(--cream);
    color: var(--cream);

    &:hover {
      border-color: rgb(var(--surface-inv-tertiary));
    }
    &:focus {
      border-color: var(--gold);
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    }
    &::placeholder {
      color: rgb(from var(--cream) r g b / 0);
    }
    &:focus::placeholder {
      color: rgb(from var(--cream) r g b / 1);
    }

    &:disabled {
      border-color: rgba(var(--surface-inv-tertiary), 0.48) !important;
      color: rgb(var(--text-tertiary)) !important;
      cursor: not-allowed;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active,
    &:autofill,
    &:autofill:hover,
    &:autofill:focus,
    &:autofill:active {
      -webkit-background-clip: text;
      -webkit-text-fill-color: rgb(var(--text-secondary));
      caret-color: rgb(var(--text-secondary));
    }

    &::-webkit-contacts-auto-fill-button {
      background-color: rgb(var(--text-secondary));
    }

    &::-moz-selection {
      background: rgba(var(--surface-inv-primary), 1);
      color: rgb(var(--text-inv-primary));
      text-shadow: none;
    }
    &::selection {
      background: rgba(var(--surface-inv-primary), 1);
      color: rgb(var(--text-inv-primary));
      text-shadow: none;
    }
  }
`
