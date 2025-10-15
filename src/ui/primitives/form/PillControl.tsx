// import { forwardRef, type ComponentProps, type ForwardedRef } from 'react'
// import { typography } from 'shared-ui'
// import styled from 'styled-components'
//
// type IPillControl = ComponentProps<'input'> & {
//   label?: string
//   type?: 'radio' | 'checkbox'
// }
//
// export const CustomPillControl = (
//   { label, className, type, checked, ...rest }: IPillControl,
//   ref: ForwardedRef<HTMLInputElement>,
// ) => (
//   <Wrapper className={`${checked ? 'checked' : ''} ${className || ''}`}>
//     <input type={type} ref={ref} {...rest} defaultChecked={checked} />
//     <Label>{label}</Label>
//   </Wrapper>
// )
//
// const Wrapper = styled.label`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 12px 16px;
//
//   border: 1px solid;
//   border-radius: 25px;
//   background: transparent;
//   border-color: rgba(var(--border-default));
//   box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0);
//
//   cursor: pointer;
//
//   > span {
//     position: relative;
//     display: inline;
//     overflow: hidden;
//     color: rgba(var(--text-secondary), 1);
//     transition: color 0.15s ease-in-out;
//     ${typography('label', 'l3_uppercase', { crop: true })}
//   }
//
//   &.checked {
//     background-color: rgba(var(--surface-inv-primary), 1);
//     border-color: rgba(var(--surface-inv-primary));
//     > span {
//       color: rgba(var(--text-inv-secondary), 1);
//     }
//   }
//
//   input {
//     position: absolute;
//     opacity: 0;
//     height: 0;
//     width: 0;
//   }
//
//   transform: scale3d(1, 1, 1) translateZ(0);
//   transition: background-color 0.25s linear, border-color 0.25s linear, color 0.25s linear, box-shadow 0.25s linear,
//     transform 0.4s cubic-bezier(0.42, 0.97, 0.52, 1.49);
//
//   &:not(.invalid):hover {
//     border-color: rgba(var(--border-hover));
//     box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0);
//     color: rgba(var(--text-secondary), 1);
//     svg {
//       color: rgba(var(--text-secondary), 1);
//     }
//   }
// `
//
// const Label = styled.span`
//   position: relative;
//   display: inline;
//   padding: 4px 0;
//   white-space: nowrap;
// `
//
// export const PillControl = forwardRef(CustomPillControl)
