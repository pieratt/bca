export const blockTextToString = (block, lineBreakChar) => {
  return (
    block?.reduce((a, c, i) => {
      const text = c.children?.flatMap((c) => c.text).join('') || ''
      return a + text + (i !== block.length - 1 ? ' ' : '')
    }, '') || ''
  )
}
