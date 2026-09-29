import {getHeaderStats} from '@/data/catalog'
import {HeaderBar} from './HeaderBar'

export const Header = async () => {
  const {books, designers} = await getHeaderStats()
  return <HeaderBar books={books} designers={designers} />
}
