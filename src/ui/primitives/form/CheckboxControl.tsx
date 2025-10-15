// import { forwardRef, type ComponentProps, type ForwardedRef } from 'react'
// import { IconCheckmarkSmall, artboards, typography } from 'shared-ui'
// import styled from 'styled-components'
//
// export type ICheckboxControl = ComponentProps<'input'> & {
//   staticDarkForm?: boolean
//   label?: string
// }
//
// /* Note: this can take text for a label, or child components. */
//
// const CustomCheckboxControl = (
//   { disabled = false, label, className, staticDarkForm, children, checked, ...rest }: ICheckboxControl,
//   ref: ForwardedRef<HTMLInputElement>,
// ) => (
//   <Wrapper disabled={disabled} className={`${className || ''} ${staticDarkForm ? 'staticDarkForm' : ''}`}>
//     <Box className={staticDarkForm ? 'staticDarkForm' : ''}>
//       <input disabled={disabled} type="checkbox" ref={ref} {...rest} defaultChecked={checked} />
//       <Checkmark disabled={disabled} checked={checked} className={staticDarkForm ? 'staticDarkForm' : ''}>
//         <StyledIconCheckmarkSmall
//           level={7}
//           className={staticDarkForm ? 'staticDarkForm' : ''}
//           disabled={disabled}
//           checked={checked}
//         />
//       </Checkmark>
//     </Box>
//     {!!label && (
//       <Label className={staticDarkForm ? 'staticDarkForm' : ''} disabled={disabled}>
//         {label}
//       </Label>
//     )}
//     {children}
//   </Wrapper>
// )
//
// /* Scaffolding */
//
// const Wrapper = styled.label<{ disabled: boolean }>`
//   position: relative;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   gap: ${artboards.mobile.padding.l4}px;
//   padding: 12px 0;
//   font-size: 0px;
//   line-height: 0px;
//   user-select: none;
//   cursor: ${props => (!!props.disabled ? 'not-allowed' : 'pointer')};
//
//   &.signUpModal {
//     padding: 0px 0;
//   }
//
//   & p {
//     position: relative;
//     display: inline;
//     ${typography('label', 'l2', { crop: true })}
//   }
//   & a {
//     position: relative;
//     font-weight: 700 !important;
//
//     background-image: linear-gradient(to bottom, transparent 31%, rgba(var(--surface-elements), 1) 32%);
//     background-position: 0 bottom;
//     background-repeat: no-repeat;
//     background-size: 0% 2px;
//     transition: background-size 0.4s ease-in-out;
//   }
//   &.staticDarkForm a {
//     background-image: linear-gradient(to bottom, transparent 31%, rgba(var(--snow), 1) 32%);
//   }
//
//   & input:checked ~ span,
//   &:hover input:checked ~ span {
//     border-color: ${props => (!!props.disabled ? 'transparent !important' : 'rgba(var(--surface-elements), 1)')};
//     &::before {
//       background-color: ${props =>
//         !props.disabled ? 'rgba(var(--surface-elements), 1)' : 'rgba(var(--state-disabled)'};
//       box-shadow: 0 0 0
//         ${props => (!props.disabled ? 'rgba(var(--surface-elements), 1)' : 'rgba(var(--state-disabled)')};
//       transform: scale3d(1, 1, 1);
//       opacity: 1;
//     }
//     &::after {
//       transform: rotate(45deg) scale3d(1, 1, 1);
//     }
//   }
//
//   &.staticDarkForm input:checked ~ span,
//   &.staticDarkForm:hover input:checked ~ span {
//     border-color: ${props => (!!props.disabled ? 'transparent !important' : 'rgba(var(--snow), 1)')};
//     &::before {
//       background-color: ${props => (!props.disabled ? 'rgba(var(--snow), 1)' : 'rgba(var(--snow), 0.08)')};
//       box-shadow: 0 0 0 ${props => (!props.disabled ? 'rgba(var(--snow), 1)' : 'rgba(var(--snow), 0.08)')};
//       transform: scale3d(1, 1, 1);
//       opacity: 1;
//     }
//     &::after {
//       transform: rotate(45deg) scale3d(1, 1, 1);
//     }
//   }
//
//   @media only screen and (min-width: ${artboards.tablet.breakpoint}px) {
//     gap: ${artboards.tablet.padding.l4}px;
//
//     a:hover {
//       background-size: 100% 2px;
//     }
//
//     &:hover input ~ span {
//       border-color: ${props => (!props.disabled ? 'rgba(var(--border-hover))' : 'rgba(var(--state-disabled)')};
//     }
//
//     &.staticDarkForm:hover input ~ span {
//       border-color: ${props => (!props.disabled ? 'rgba(var(--snow), 0.48)' : 'rgba(var(--snow), 0.08)')};
//     }
//   }
//
//   @media only screen and (min-width: ${artboards.desktop.breakpoint}px) {
//     gap: ${artboards.desktop.padding.l4}px;
//   }
// `
//
// const Box = styled.div`
//   flex: 0 0 auto;
//   position: relative;
//   width: 24px;
//   height: 24px;
//
//   &::before {
//     z-index: 1;
//     display: block;
//     position: absolute;
//     content: '';
//     width: 100%;
//     height: 100%;
//     border: 0.5px solid rgba(var(--border-default));
//     border-radius: 50%;
//     transform: scale3d(1, 1, 1);
//     transition: transform 0.25s ease-in-out, opacity 0.25s linear;
//     opacity: 0;
//
//     @keyframes OutlineCheckbox {
//       0% {
//         opacity: 0;
//         transform: scale3d(1, 1, 1);
//       }
//       50% {
//         opacity: 0.8;
//       }
//       100% {
//         opacity: 0;
//         transform: scale3d(1.5, 1.5, 1);
//       }
//     }
//   }
//
//   &.staticDarkForm::before {
//     border: 0.5px solid rgba(var(--snow), 0.16);
//   }
//
//   &::after {
//     display: block;
//     position: absolute;
//     content: '';
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-color: rgba(var(--surface-elements), 0.08);
//     border-radius: 50%;
//     transform: scale3d(1, 1, 1);
//     transition: transform 0.25s cubic-bezier(0.42, 0.97, 0.52, 1.49), opacity 0.25s linear;
//     opacity: 0;
//   }
//
//   &.staticDarkForm::after {
//     border: 0.5px solid rgba(var(--snow), 0.08);
//   }
//
//   @media only screen and (min-width: ${artboards.tablet.breakpoint}px) {
//     ${Wrapper}:not([disabled]):focus &,
//     ${Wrapper}:not([disabled]):active &,
//     ${Wrapper}.poked:not([disabled]) & {
//       transform: scale3d(1.02, 1.01, 1);
//       &::after {
//         transform: scale3d(1.4, 1.4, 1);
//         opacity: 1;
//       }
//     }
//
//     ${Wrapper}:not([disabled]):hover &::before {
//       animation: OutlineCheckbox ease-in-out 0.6s backwards;
//     }
//   }
//
//   input {
//     position: absolute;
//     opacity: 0;
//     height: 0;
//     width: 0;
//   }
// `
//
// const Checkmark = styled.span<{ disabled: boolean; checked?: boolean }>`
//   position: absolute;
//   top: 0;
//   left: 0;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   height: 100%;
//
//   border-radius: 50%;
//   border: 1px solid ${props => (!props.disabled ? 'rgba(var(--border-default))' : 'rgba(var(--state-disabled)')};
//   &.staticDarkForm {
//     border: 1px solid ${props => (!props.disabled ? 'rgba(var(--snow), 0.16)' : 'rgba(var(--snow), 0.08)')};
//   }
//
//   appearance: none;
//   transition: border-color 0.25s linear;
//
//   &::before {
//     display: block;
//     position: absolute;
//     content: '';
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-color: rgba(var(--surface-elements), 1);
//     box-shadow: 0 0 0 1px rgba(var(--surface-elements), 1);
//     border-radius: 50%;
//     transform: scale3d(0, 0, 1);
//     transition: ${props =>
//       props.checked
//         ? 'transform 0.3s ease-in-out, opacity 0s linear'
//         : 'transform 0.3s 0.3s ease-in-out, opacity 0.3s 0.3s linear'};
//     opacity: 0;
//   }
//
//   &.staticDarkForm::before {
//     background-color: rgba(var(--snow), 1);
//     box-shadow: 0 0 0 1px rgba(var(--snow), 1);
//   }
// `
//
// const StyledIconCheckmarkSmall = styled(IconCheckmarkSmall)<{
//   disabled: boolean
//   checked?: boolean
// }>`
//   color: ${props => (!props.disabled ? 'rgba(var(--icon-inv-primary), 1)' : 'rgba(var(--icon-disabled)')};
//   &.staticDarkForm {
//     color: ${props => (!props.disabled ? 'rgba(var(--ruin), 1)' : 'rgba(var(--snow), 0.24)')};
//   }
//
//   transform: scale3d(${props => (props.checked ? '1, 1, 1' : '0, 0, 1')});
//   transition: transform
//     ${props => (props.checked ? '0.3s 0.3s cubic-bezier(0.42, 0.97, 0.52, 1.49)' : '0.3s 0s ease-in')};
// `
//
// const Label = styled.span<{ disabled: boolean }>`
//   position: relative;
//   display: inline;
//   ${typography('label', 'l2', { crop: true })}
//
//   color: ${props => (!props.disabled ? 'rgba(var(--text-secondary), 1)' : 'rgba(var(--text-tertiary), 1)')};
//   &.staticDarkForm {
//     color: ${props => (!props.disabled ? 'rgba(var(--fog), 1)' : 'rgba(var(--text-tertiary), 1)')};
//   }
//   transition: color 0.25s linear;
//
//   @media only screen and (min-width: ${artboards.tablet.breakpoint}px) {
//     ${Wrapper}:not([disabled]):hover & {
//       color: rgba(var(--text-primary), 1);
//     }
//     ${Wrapper}:not([disabled]):hover &.staticDarkForm {
//       color: rgba(var(--white), 1);
//     }
//   }
// `
//
// export const CheckboxControl = forwardRef(CustomCheckboxControl)
