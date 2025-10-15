import {ValidationContext} from 'sanity'

export const maxDepth = (maxDepth: number) => (_: any, context: ValidationContext) => {
  const paths = (context.path as Array<any>).filter(
    (e) => typeof e === 'string' && e.match(/topLevelItems|subMenu/)
  )
  return paths.length > maxDepth ? `Error: You can only nest menus ${maxDepth} levels deep.` : true
}
