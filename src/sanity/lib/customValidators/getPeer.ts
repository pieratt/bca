import {ValidationContext, KeyedSegment} from 'sanity'

export const getPeer = (key: string | number, context: ValidationContext) => {
  if (!context.document) {
    return undefined
  }

  const pathToParentObject = [...context.path!.slice(0, -1), key]

  var target: unknown = context.document
  for (var i = 0; i < pathToParentObject.length; i++) {
    const pathSegment = pathToParentObject[i]
    if (typeof Array.isArray(target) && pathSegment.hasOwnProperty('_key')) {
      target = Array.from(target as Array<Record<string, unknown>>).find(
        (a) => a._key === (pathSegment as KeyedSegment)['_key']
      )
    } else {
      target = (target as Record<string, unknown>)[pathSegment as string]
    }
  }
  return target
}
