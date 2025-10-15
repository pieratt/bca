// 'use client'
//
// import {typography, usePokeable, useBuffer} from '@lib'
// import {styled} from '@linaria/react'
// import {breakpoints} from '@theme'
// import Link from 'next/link'
// import {
//   useEffect,
//   cloneElement,
//   forwardRef,
//   memo,
//   type ComponentProps,
//   type ForwardedRef,
//   type ReactElement,
// } from 'react'
//
// type ButtonStyle = 'normal' | 'inverted' | 'text'
//
// export type IButton = Omit<ComponentProps<'a' | 'button'>, 'href'> & {
//   as?: keyof JSX.IntrinsicElements
//   invalid?: boolean
//   processing?: boolean
//   buttonStyle?: ButtonStyle
//   circle?: boolean
//   label?: string | null
//   leftIcon?: ReactElement
//   icon?: ReactElement
//   href?: string
//   target?: string
// }
//
// export const CustomButton = (
//   {
//     invalid,
//     processing,
//     href,
//     buttonStyle = 'normal',
//     label,
//     circle,
//     leftIcon,
//     icon,
//     children,
//     className,
//     target,
//     ...props
//   }: IButton,
//   forwardRef: ForwardedRef<HTMLLinkElement | HTMLButtonElement>
// ) => {
//   const {poke, poking} = usePokeable()
//
//   const loading = useBuffer(processing, 500)
//
//   const TheButton = (
//     <Wrapper
//       as={!!href ? 'button' : 'button'}
//       noLabel={!label}
//       // @ts-ignore
//       type={props.type || 'button'}
//       {...props}
//       onTouchStart={poke}
//       className={`
//         ${className}
//         ${buttonStyle}
//         ${poking ? 'poked' : ''}
//         ${invalid ? 'invalid' : ''}
//         ${circle ? 'circle' : ''}
//         ${loading ? 'loading' : ''}
//       `}
//       // @ts-ignore
//       ref={forwardRef}
//     >
//       {!!leftIcon &&
//         cloneElement(leftIcon, {
//           level: 3,
//         })}
//       {label && <Label className={loading ? 'loading' : ''}>{label}</Label>}
//       {children}
//       {!!icon &&
//         cloneElement(icon, {
//           level: 3,
//         })}
//       {buttonStyle !== 'text' && !circle && (
//         <LoadingWrapper className={loading ? 'active' : ''}>
//           <Loading className={loading ? 'active' : ''}>
//             <div></div>
//             <div></div>
//             <div></div>
//             <div></div>
//           </Loading>
//         </LoadingWrapper>
//       )}
//     </Wrapper>
//   )
//
//   if (!href) return TheButton
//
//   return href.slice(0, 4) === 'http' ? (
//     <ExternalLink href={href} target="_blank" rel="noopener noreferrer">
//       {TheButton}
//     </ExternalLink>
//   ) : (
//     <StyledLink href={href} target={target}>
//       {TheButton}
//     </StyledLink>
//   )
// }
//
// /* z-index 9999 ensures the before/after effects always sit above other buttons in a row */
//
// const Label = styled.span`
//   position: relative;
//   display: inline;
//   white-space: pre-line;
//   transition: opacity 0.15s ease-in-out;
//   &.loading {
//     opacity: 0;
//   }
// `
//
// const ExternalLink = styled.a`
//   display: contents;
//
//   &:hover {
//     z-index: 2;
//   }
// `
//
// const StyledLink = styled(Link)`
//   display: contents;
//
//   &:hover {
//     z-index: 2;
//   }
// `
//
// const Wrapper = styled.button<{noLabel: boolean}>`
//   z-index: 1;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   max-width: 100%;
//   height: 48px;
//   padding: 0 var(--l3);
//   border: none !important;
//   ${typography('label', 'l1', {crop: true})}
//   text-transform: uppercase;
//   transform: scale3d(1, 1, 1) translateY(0);
//   transition: background-color 0.24s linear, box-shadow 0.24s linear, color 0.24s linear,
//     transform 0.4s cubic-bezier(0.42, 0.97, 0.52, 1.49);
//   will-change: transform;
//
//   cursor: pointer;
//   user-select: none;
//
//   /* Before / After */
//
//   &::before,
//   &::after {
//     z-index: 1;
//     display: block;
//     position: absolute;
//     transform: scale3d(1, 1, 1);
//     will-change: transform;
//     opacity: 0;
//     content: '';
//     pointer-events: none;
//   }
//
//   &::before {
//     width: 100%;
//     height: 100%;
//     border: 0.5px solid rgb(var(--accent-primary));
//     transition: transform 0.24s ease, opacity 0.24s linear;
//
//     @keyframes NormalButton {
//       0% {
//         opacity: 0;
//         transform: scale3d(1, 1, 1);
//       }
//       50% {
//         opacity: 0.32;
//       }
//       100% {
//         opacity: 0;
//         transform: scale3d(1.1, 1.4, 1);
//       }
//     }
//
//     @keyframes CircleButton {
//       0% {
//         opacity: 0;
//         transform: scale3d(1, 1, 1);
//       }
//       50% {
//         opacity: 0.32;
//       }
//       100% {
//         opacity: 0;
//         transform: scale3d(1.6, 1.6, 1);
//       }
//     }
//
//     @keyframes TextLinkButton {
//       0% {
//         opacity: 1;
//         transform: scale3d(1, 1, 1);
//       }
//       50% {
//         opacity: 1;
//         transform: scale3d(1.07, 1, 1);
//       }
//       100% {
//         opacity: 1;
//         transform: scale3d(1, 1, 1);
//       }
//     }
//   }
//
//   &::after {
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     box-shadow: 0 0 0 var(--l5) rgba(var(--accent-primary), 0.08);
//     transition: opacity 0.24s linear;
//   }
//
//   /* SVG */
//
//   & svg {
//     opacity: 1;
//     transition: 0.24s opacity 0.24s linear, color 0.24s linear;
//   }
//
//   /* Invalid */
//
//   &.invalid {
//     background-color: rgb(var(--surface-tertiary)) !important;
//     box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
//     color: rgb(var(--text-tertiary)) !important;
//     cursor: not-allowed !important;
//   }
//
//   &.invalid svg {
//     color: rgb(var(--icon-tertiary)) !important;
//   }
//
//   /* Normal */
//
//   &.normal {
//     background-color: rgb(var(--surface-secondary));
//     box-shadow: var(--surface-light-shadow);
//     color: rgb(var(--text-secondary));
//
//     svg {
//       color: rgb(var(--icon-secondary));
//     }
//   }
//
//   /* Inverted */
//
//   &.inverted {
//     background-color: rgb(var(--surface-inv-secondary));
//     box-shadow: var(--surface-dark-shadow);
//     color: rgb(var(--text-inv-secondary));
//
//     svg {
//       color: rgb(var(--icon-inv-secondary));
//     }
//   }
//
//   /* Circle */
//
//   &.circle {
//     width: 48px;
//     padding: 0;
//     border-radius: 50%;
//   }
//   &.circle::before,
//   &.circle::after {
//     border-radius: 50%;
//   }
//
//   /* Text */
//
//   &.text {
//     position: relative;
//     display: inline-flex;
//     background: transparent !important;
//     width: fit-content;
//     height: fit-content;
//     padding: var(--l4) 0;
//     border: 0 !important;
//     box-shadow: none !important;
//     color: rgb(var(--text-secondary));
//     transform: scale3d(1, 1, 1) !important;
//
//     & > span {
//       transform: translate3d(0, 0, 0);
//       transition: transform 0.24s ease-in-out;
//     }
//
//     &::before {
//       left: 0;
//       bottom: 0;
//       background-color: rgb(var(--surface-inv-secondary));
//       width: 100%;
//       height: 1px;
//       border: none;
//       transform: scale3d(1, 1, 1);
//       transition: background-color 0.24s linear, opacity 0.24s linear,
//         transform 0.8s cubic-bezier(0.42, 0.97, 0.52, 1.49);
//       opacity: 1;
//     }
//
//     &::after {
//       display: none !important;
//     }
//
//     &:disabled,
//     &.loading {
//       color: rgba(var(--text-tertiary), 1);
//       cursor: not-allowed !important;
//     }
//
//     svg {
//       display: none !important;
//     }
//
//     &.inverted {
//       color: rgb(var(--text-inv-secondary));
//       text-shadow: var(--text-shadow);
//
//       &::before {
//         background-color: rgb(var(--surface-secondary));
//       }
//     }
//   }
//
//   /* Focus */
//
//   &:not(.invalid):focus,
//   &:not(.invalid):active,
//   &.poked:not(.invalid) {
//     z-index: 2;
//     background-color: rgb(var(--accent-primary));
//     box-shadow: var(--surface-light-active-shadow);
//     color: rgb(var(--text-inv-primary));
//     transform: scale3d(1.04, 1.02, 1) translateY(-2px);
//     &::after {
//       opacity: 1;
//     }
//     & svg {
//       color: rgb(var(--icon-inv-primary));
//     }
//   }
//
//   &.circle:not(.invalid):focus,
//   &.circle:not(.invalid):active,
//   &.circle.poked:not(.invalid) {
//     transform: scale3d(1.08, 1.08, 1);
//   }
//
//   &.text:not(.invalid):focus,
//   &.text:not(.invalid):active,
//   &.text.circle.poked:not(.invalid) {
//     color: rgb(var(--text-primary));
//
//     & > span {
//       transform: translate3d(0, -2px, 0);
//     }
//     &::before {
//       background-color: rgb(var(--surface-inv-primary));
//       animation: TextLinkButton cubic-bezier(0.42, 0.97, 0.52, 1.49) 0.6s backwards;
//     }
//
//     &.inverted {
//       color: rgb(var(--text-inv-primary));
//
//       &::before {
//         background-color: rgb(var(--surface-primary));
//       }
//     }
//   }
//
//   @media only screen and (min-width: ${breakpoints.tablet}px) {
//     /* Normal */
//
//     &:not(.invalid):hover {
//       z-index: 2;
//       background-color: rgb(var(--accent-primary));
//       box-shadow: var(--surface-light-active-shadow);
//       color: rgb(var(--text-inv-primary));
//       transform: scale3d(1.04, 1.02, 1) translateY(-2px);
//       &::before {
//         animation: NormalButton ease 0.6s backwards;
//       }
//       & svg {
//         color: rgb(var(--icon-inv-primary));
//       }
//     }
//
//     /* Circle */
//
//     &.circle:not(.invalid):hover {
//       z-index: 2;
//       transform: scale3d(1.08, 1.08, 1) translateY(-2px);
//       &::before {
//         animation: CircleButton ease 0.6s backwards;
//       }
//     }
//
//     /* Text */
//
//     &.text:not(.invalid):hover {
//       color: rgb(var(--text-primary));
//
//       & > span {
//         transform: translate3d(0, -2px, 0);
//       }
//       &::before {
//         background-color: rgb(var(--surface-inv-primary));
//         animation: TextLinkButton cubic-bezier(0.42, 0.97, 0.52, 1.49) 0.6s backwards;
//       }
//
//       &.inverted {
//         color: rgb(var(--text-inv-primary));
//
//         &::before {
//           background-color: rgb(var(--surface-primary));
//         }
//       }
//     }
//   }
//
//   @media only screen and (min-width: ${breakpoints.laptop}px) {
//     /* Normal */
//     height: 56px;
//
//     /* Circle */
//
//     &.circle {
//       width: 56px;
//     }
//   }
//
//   @media only screen and (min-width: ${breakpoints.desktop}px) {
//     /* Normal */
//     height: 64px;
//
//     /* Circle */
//
//     &.circle {
//       width: 64px;
//     }
//   }
//
//   &.hideLabel ${Label} {
//     opacity: 0;
//   }
//
//   /* Colors */
//
//   @media only screen and (min-width: ${breakpoints.tablet}px) {
//     &:not(.invalid):hover {
//       &.button-facebook {
//         background-color: rgb(var(--facebook));
//         &::before {
//           border-color: rgb(var(--facebook-tertiary));
//         }
//         &::after {
//           box-shadow: 0 0 0 var(--l5) rgba(var(--facebook-tertiary), 0.08);
//         }
//       }
//
//       &.button-dribbble {
//         background-color: rgb(var(--dribbble));
//         &::before {
//           border-color: rgb(var(--dribbble-tertiary));
//         }
//         &::after {
//           box-shadow: 0 0 0 var(--l5) rgba(var(--dribbble-tertiary), 0.08);
//         }
//       }
//
//       &.button-github {
//         background-color: rgb(var(--github));
//         &::before {
//           border-color: rgb(var(--github-tertiary));
//         }
//         &::after {
//           box-shadow: 0 0 0 var(--l5) rgba(var(--github-tertiary), 0.08);
//         }
//       }
//
//       &.button-instagram {
//         background-color: rgb(var(--instagram));
//         &::before {
//           border-color: rgb(var(--instagram-tertiary));
//         }
//         &::after {
//           box-shadow: 0 0 0 var(--l5) rgba(var(--instagram-tertiary), 0.08);
//         }
//       }
//
//       &.button-linkedin {
//         background-color: rgb(var(--linkedin));
//         &::before {
//           border-color: rgb(var(--linkedin-tertiary));
//         }
//         &::after {
//           box-shadow: 0 0 0 var(--l5) rgba(var(--linkedin-tertiary), 0.08);
//         }
//       }
//
//       &.button-twitter {
//         background-color: rgb(var(--twitter));
//         &::before {
//           border-color: rgb(var(--twitter-tertiary));
//         }
//         &::after {
//           box-shadow: 0 0 0 var(--l5) rgba(var(--twitter-tertiary), 0.08);
//         }
//       }
//     }
//   }
// `
//
// const LoadingWrapper = styled.div`
//   z-index: 1;
//   position: absolute;
//   top: 0;
//   bottom: 0;
//   left: 0;
//   right: 0;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   height: 100%;
//   opacity: 0;
//   transition: opacity 0.24s linear 0.4s;
//   pointer-events: none;
//
//   &.active {
//     opacity: 1;
//     transition-delay: 0s;
//   }
// `
//
// const Loading = styled.div`
//   position: relative;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 60px;
//   height: 12px;
//   opacity: 0;
//   transform: scale3d(0.8, 0.8, 1);
//   transition: opacity 0.24s linear, transform 0.4s ease-in-out;
//
//   &.active {
//     opacity: 1;
//     transform: scale3d(1, 1, 1);
//   }
//
//   & div {
//     position: absolute;
//     top: 0;
//     width: 12px;
//     height: 12px;
//     background-color: rgba(var(--surface-secondary), 1);
//     border-radius: 50%;
//     animation-timing-function: cubic-bezier(0, 1, 1, 0);
//     will-change: transform;
//
//     ${Wrapper}.invalid & {
//       background-color: rgba(var(--text-tertiary), 1);
//     }
//
//     ${Wrapper}.outline & {
//       background-color: rgba(var(--surface-elements), 1);
//     }
//     ${Wrapper}.outline.invalid & {
//       background-color: rgba(var(--text-tertiary), 1);
//     }
//
//     ${Wrapper}.darkformoutline & {
//       background-color: rgba(var(--snow), 1);
//     }
//     ${Wrapper}.darkformoutline.invalid & {
//       background-color: rgba(var(--fog), 1);
//     }
//
//     ${Wrapper}.darkformfill & {
//       background-color: rgba(var(--ruin), 1);
//     }
//     ${Wrapper}.darkformfill.invalid & {
//       background-color: rgba(var(--fog), 1);
//     }
//   }
//   & div:nth-child(1) {
//     left: 0;
//     animation: button-loading-circle-1 0.6s infinite;
//   }
//   & div:nth-child(2) {
//     left: 0;
//     animation: button-loading-circle-2 0.6s infinite;
//   }
//   & div:nth-child(3) {
//     left: 24px;
//     animation: button-loading-circle-2 0.6s infinite;
//   }
//   & div:nth-child(4) {
//     left: 48px;
//     animation: button-loading-circle-3 0.6s infinite;
//   }
//
//   @keyframes button-loading-circle-1 {
//     0% {
//       transform: scale3d(0, 0, 0);
//     }
//     100% {
//       transform: scale3d(1, 1, 1);
//     }
//   }
//   @keyframes button-loading-circle-2 {
//     0% {
//       transform: translate3d(0, 0, 0);
//     }
//     100% {
//       transform: translate3d(24px, 0, 0);
//     }
//   }
//   @keyframes button-loading-circle-3 {
//     0% {
//       transform: scale3d(1, 1, 1);
//     }
//     100% {
//       transform: scale3d(0, 0, 0);
//     }
//   }
// `
//
// export const Button = memo(forwardRef(CustomButton))
