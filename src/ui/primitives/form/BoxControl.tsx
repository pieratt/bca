// import { forwardRef, type ComponentProps, type ForwardedRef, type PropsWithChildren } from 'react'
// import { IconCheckmark, typography } from 'shared-ui'
// import styled from 'styled-components'
//
// type IPillControl = ComponentProps<'input'> &
//   PropsWithChildren & {
//     label?: string
//     type?: 'radio' | 'checkbox'
//   }
//
// export const CustomBoxControl = (
//   { label, className, type = 'checkbox', checked, children, ...rest }: IPillControl,
//   ref: ForwardedRef<HTMLInputElement>,
// ) => (
//   <Wrapper className={`${checked ? 'checked' : ''} ${className || ''}`}>
//     <CheckmarkWrapper className={!!checked ? 'visible' : ''}>
//       <IconCheckmark level={1} outline />
//     </CheckmarkWrapper>
//
//     <input type={type} ref={ref} {...rest} defaultChecked={checked} />
//     {children}
//     <Label>
//       <span>{label}</span>
//     </Label>
//   </Wrapper>
// )
//
// const Wrapper = styled.label`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   padding: 18px 9px;
//   gap: 12px;
//   max-width: 100%;
//   min-width: 0;
//
//   border: 1px solid;
//   background: transparent;
//   border-color: rgba(var(--border-default));
//   box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0);
//
//   cursor: pointer;
//
//   &.checked {
//     border-color: rgba(var(--surface-inv-primary));
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
// const Label = styled.div`
//   position: relative;
//   display: block;
//   max-width: 100%;
//
//   & > span {
//     ${typography('label', 'l3', { crop: true })}
//   }
//   line-height: 1em;
//   text-align: center;
//   color: rgba(var(--text-secondary), 1);
//   transition: color 0.15s ease-in-out;
// `
//
// const CheckmarkWrapper = styled.div`
//   display: none;
//
//   z-index: var(--modals-z);
//   position: absolute;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   top: -12px;
//   right: -12px;
//   opacity: 0;
//   transform: scale3d(0.05, 0.05, 1);
//   transition: opacity 0.25s linear, transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
//   transition-delay: 0s;
//
//   background: rgba(var(--surface-inv-primary), 1);
//   width: 24px;
//   height: 24px;
//   border-radius: 100%;
//
//   svg {
//     color: rgba(var(--icon-inv-primary), 1) !important;
//   }
//
//   &.visible {
//     opacity: 1;
//     transform: scale3d(1, 1, 1);
//     transition-delay: 0.6s;
//   }
// `
//
// export const BoxControl = forwardRef(CustomBoxControl)
