//
// Note: This could use a single setter/getter if the type is of Array<number> or {min: number, max: number}.
// Right now I'm not seeing a lot of benefit to that, but worth keeping in mind.
//
// import { clamp } from 'lodash-es'
// import { artboards } from 'shared-ui'
// import styled from 'styled-components'
//
// interface RangeProps {
//   setMin: (input: number | undefined) => void
//   min?: number
//   setMax: (input: number | undefined) => void
//   max?: number
//   rangeMin?: number
//   rangeMax?: number
// }
//
// export const RangeControl = ({ setMin, min, setMax, max, rangeMin = 0, rangeMax = 100, ...props }: RangeProps) => {
//   return (
//     <Wrapper {...props}>
//       <Input
//         type="range"
//         value={clamp(min || 0, rangeMin, max || rangeMax)}
//         min={rangeMin}
//         max={rangeMax}
//         onChange={e => setMin(parseInt(e.target.value))}
//         hiddenTrack
//       />
//       <Input
//         type="range"
//         value={clamp(max || rangeMax, min || rangeMin, rangeMax)}
//         min={rangeMin}
//         max={rangeMax}
//         onChange={e => setMax(parseInt(e.target.value))}
//       />
//     </Wrapper>
//   )
// }
//
// const Wrapper = styled.div`
//   position: relative;
//   min-height: 24px;
//   min-width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `
//
// const Input = styled.input<{ hiddenTrack?: boolean }>`
//   position: absolute;
//   z-index: ${props => (props.hiddenTrack ? 2 : 1)};
//
//   height: 1px;
//   width: 100%;
//
//   appearance: none;
//   background-color: ${props => (props.hiddenTrack ? 'transparent' : 'rgba(var(--border-focused))')};
//   pointer-events: none;
//
//   ::-webkit-slider-thumb {
//     appearance: none;
//     pointer-events: all;
//     width: 24px;
//     height: 24px;
//     @media only screen and (min-width: ${artboards.laptop.breakpoint}px) {
//       width: 32px;
//       height: 32px;
//     }
//     @media only screen and (min-width: ${artboards.desktop.breakpoint}px) {
//       width: 40px;
//       height: 40px;
//     }
//     background-color: rgba(var(--surface-primary), 1);
//     border: 1px solid rgba(var(--border-focused));
//     border-radius: 50%;
//     box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.08);
//     cursor: pointer;
//   }
//
//   ::-moz-range-thumb {
//     appearance: none;
//     pointer-events: all;
//     width: 24px;
//     height: 24px;
//     @media only screen and (min-width: ${artboards.laptop.breakpoint}px) {
//       width: 32px;
//       height: 32px;
//     }
//     @media only screen and (min-width: ${artboards.desktop.breakpoint}px) {
//       width: 40px;
//       height: 40px;
//     }
//     background-color: rgba(var(--surface-primary), 1);
//     border: 1px solid rgba(var(--border-focused));
//     border-radius: 50%;
//     box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.08);
//     cursor: pointer;
//   }
//
//   ::-webkit-slider-runnable-track,
//   ::-moz-range-track {
//     background: rgba(var(--border-default));
//     height: 0.5rem;
//   }
//
//   &:focus {
//     outline: none;
//     ::-webkit-slider-thumb {
//       background: rgba(var(--ruin), 1);
//     }
//     ::-moz-range-thumb {
//       background: rgba(var(--ruin), 1);
//     }
//   }
// `
