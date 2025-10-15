// import { IconWrapper, InputWrapper, Label, Message } from './lib'
// import { InputProps } from './lib/types'
// import { CountryCode, E164Number } from 'libphonenumber-js/core'
// import { forwardRef, type ComponentProps, type ForwardedRef } from 'react'
// import { type Control, type FieldValues } from 'react-hook-form'
// import PhoneInput from 'react-phone-number-input/react-hook-form-input'
// import { artboards } from 'shared-ui'
// import styled from 'styled-components'
//
// interface CustomPhoneControlProps<T extends FieldValues> extends InputProps<ComponentProps<'input'>> {
//   name: string
//   defaultValue?: E164Number
//   control?: Control<T>
//   country?: CountryCode
// }
//
// const CustomPhoneControl = <T extends FieldValues>(
//   {
//     required,
//     value,
//     label,
//     className,
//     message,
//     icon,
//     inputStyle = 'normal',
//     messageType,
//     control,
//     defaultValue,
//     name,
//     country,
//     ...props
//   }: CustomPhoneControlProps<T>,
//   ref: ForwardedRef<HTMLInputElement>,
// ) => {
//   return (
//     <Wrapper className={className}>
//       <InputWrapper disabled={props.disabled} hasIcon={!!icon} className={inputStyle}>
//         <PhoneInput
//           name={name}
//           className={!!value ? 'hasData' : ''}
//           {...props}
//           ref={ref}
//           control={control}
//           country={country}
//           international
//           withCountryCallingCode
//           defaultValue={defaultValue}
//         />
//         <Label htmlFor={name} className={inputStyle}>
//           {label}
//           {required ? ' *' : ''}
//         </Label>
//
//         {!!icon && <IconWrapper className={inputStyle}>{icon}</IconWrapper>}
//         <Message inputStyle={inputStyle} message={message} messageType={messageType} />
//       </InputWrapper>
//     </Wrapper>
//   )
// }
//
// const Wrapper = styled.div`
//   position: relative;
//   width: 100%;
//   height: fit-content;
//
//   .PhoneInputCountry {
//     z-index: 1;
//     position: absolute;
//     top: 50%;
//     right: 30px;
//
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     height: 100%;
//     width: 72px;
//     @media only screen and (min-width: ${artboards.laptop.breakpoint}px) {
//       width: 76px;
//     }
//     @media only screen and (min-width: ${artboards.desktop.breakpoint}px) {
//       width: 80px;
//     }
//
//     transform: translateY(-50%);
//
//     .PhoneInputCountryIconUnicode {
//       position: absolute;
//       display: flex;
//       width: 24px;
//       height: 16px;
//       pointer-events: none;
//       font-size: 24px;
//       line-height: 1em;
//     }
//
//     .PhoneInputCountrySelectArrow {
//       /* to-do */
//     }
//   }
// `
//
// const CallingCode = styled.div`
//   position: absolute;
//   left: 0;
//   height: 100%;
// `
//
// export const PhoneControl = forwardRef(CustomPhoneControl)
