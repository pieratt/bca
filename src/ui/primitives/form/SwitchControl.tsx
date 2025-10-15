// import { forwardRef, type ComponentProps, type ForwardedRef } from 'react'
// import { artboards, typography } from 'shared-ui'
// import styled from 'styled-components'
//
// export type ISwitchControl = ComponentProps<'input'> & {
//   label?: string
//   sublabel?: string
// }
//
// const CustomSwitchControl = (
//   { disabled = false, label, sublabel, className, checked, readOnly, ...rest }: ISwitchControl,
//   ref: ForwardedRef<HTMLInputElement>,
// ) => (
//   <Wrapper
//     className={`
//     ${className}
//     ${disabled ? 'disabled' : ''}
//     ${readOnly ? 'read-only' : ''}
//   `}
//   >
//     {(!!label || !!sublabel) && (
//       <Text>
//         <dt>
//           <Label>{label}</Label>
//         </dt>
//         {!!sublabel && (
//           <dd>
//             <Label>{sublabel}</Label>
//           </dd>
//         )}
//       </Text>
//     )}
//     <input disabled={disabled} type="checkbox" ref={ref} {...rest} defaultChecked={checked} readOnly={readOnly} />
//     <Switch checked={checked} />
//   </Wrapper>
// )
//
// const Wrapper = styled.label<{ gridArea?: string }>`
//   position: relative;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: ${artboards.mobile.padding.l3}px;
//   width: 100%;
//   user-select: none;
//   cursor: pointer;
//
//   &.disabled {
//     cursor: not-allowed;
//   }
//
//   &.read-only {
//     pointer-events: none;
//   }
//
//   input {
//     position: absolute;
//     opacity: 0;
//     height: 0;
//     width: 0;
//   }
//
//   @media only screen and (min-width: ${artboards.laptop.breakpoint}px) {
//     gap: ${artboards.laptop.padding.l3}px;
//   }
//
//   @media only screen and (min-width: ${artboards.desktop.breakpoint}px) {
//     gap: ${artboards.desktop.padding.l3}px;
//   }
// `
//
// const Switch = styled.span<{ checked?: boolean }>`
//   flex: 0 0 auto;
//   position: relative;
//   background-color: rgba(${props => (props.checked ? 'var(--border-focused)' : 'var(--border-default)')});
//   width: 28px;
//   height: 16px;
//   border-radius: 8px;
//   opacity: 1;
//   transition: background-color 0.25s ease-in-out, opacity 0.25s ease-in-out;
//   appearance: none;
//
//   ${Wrapper}.disabled & {
//     opacity: 0.4;
//   }
//
//   &::after {
//     position: absolute;
//     left: 0;
//     top: 50%;
//     display: block;
//     background-color: rgba(var(--surface-inv-elements), 1);
//     width: 12px;
//     height: 12px;
//     border-radius: 50%;
//     transform: translate3d(${props => (props.checked ? 14 : 2)}px, -50%, 0);
//     transition: transform 0.25s ease-in-out;
//     will-change: transform;
//     content: '';
//   }
//
//   @media only screen and (min-width: ${artboards.laptop.breakpoint}px) {
//     width: 44px;
//     height: 24px;
//     border-radius: 12px;
//
//     &::after {
//       width: 20px;
//       height: 20px;
//       transform: translate3d(${props => (props.checked ? 22 : 2)}px, -50%, 0);
//     }
//   }
// `
//
// const Text = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: ${artboards.mobile.padding.l4}px;
//   font-size: 0px;
//   line-height: 0px;
//
//   dt {
//     & > span {
//       transition: color 0.25s linear;
//       ${typography('label', 'l2', { crop: true })}
//       color: rgb(var(--text-secondary));
//     }
//
//     ${Wrapper}.disabled & > span {
//       color: rgb(var(--text-secondary)) !important;
//     }
//   }
//
//   dd {
//     & > span {
//       transition: color 0.25s linear;
//       ${typography('label', 'l3', { crop: true })}
//       color: rgb(var(--text-tertiary));
//     }
//
//     ${Wrapper}.disabled & > span {
//       color: rgb(var(--text-tertiary)) !important;
//     }
//   }
//
//   @media only screen and (min-width: ${artboards.tablet.breakpoint}px) {
//     gap: ${artboards.tablet.padding.l4}px;
//
//     ${Wrapper}:hover & {
//       dt,
//       dd {
//         & > span {
//           color: rgb(var(--text-primary));
//         }
//       }
//     }
//   }
//
//   @media only screen and (min-width: ${artboards.desktop.breakpoint}px) {
//     gap: ${artboards.desktop.padding.l4}px;
//   }
// `
//
// const Label = styled.span`
//   position: relative;
//   display: inline;
// `
//
// export const SwitchControl = forwardRef(CustomSwitchControl)
