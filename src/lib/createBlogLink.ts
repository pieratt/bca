export const createBlogLink = (post: Member<Sanity.PostIndexQueryResult>) => {
  if (!post) return null
  let {year, month, day} = getBlockDateParts(post.publishDate ?? '01-01-1969')
  return `/news/${year}/${month}/${day}/${post.metadata.slug?.current}`
}

export const getBlockDateParts = (input: String): {year: string; month: string; day: string} => {
  var dateArray = input.split('-') || ['2000', '01', '01']
  var year = dateArray[0]
  var month = dateArray[1]
  var day = dateArray[2]
  return {
    year,
    month: month.padStart(2, '0'),
    day: day.padStart(2, '0'),
  }
}
