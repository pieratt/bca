export const parseDate = (dateString?: string, withDay?: boolean): string => {
  if (!dateString) return ''
  var dateArray = dateString.split('-')
  var year = dateArray[0]
  var month = parseInt(dateArray[1], 10) - 1
  var date = dateArray[2]
  var _entryDate = new Date(parseInt(year), month, parseInt(date))
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return withDay
    ? `${months[_entryDate.getMonth()]} ${_entryDate.getDate()}, ${_entryDate.getFullYear()}`
    : `${months[_entryDate.getMonth()]}, ${_entryDate.getFullYear()}`
}

export const parseDateTime = (dateString: string): string => {
  var _entryDate = new Date(dateString)
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return `${
    months[_entryDate.getMonth()]
  } ${_entryDate.getDate()}, ${_entryDate.getFullYear()}, ${_entryDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })}`
}
