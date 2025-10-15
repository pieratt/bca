// import {getImageDimensions} from '@sanity/asset-utils'
// import {FileValue} from 'sanity'
//
// export const minDimensions = (x: number, y: number) => (value: FileValue | undefined) => {
//   if (!value || !value.asset) {
//     return true
//   }
//   const {width, height} = getImageDimensions(value.asset._ref)
//   if (width < x || height < y) {
//     return `Image must be at least ${x}x${y} pixels`
//   }
//   return true
// }
