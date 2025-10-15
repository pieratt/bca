import {type SchemaTypeDefinition} from 'sanity'

import genre from './genre'
import person from './person'
import book from './book'
import typeface from './typeface'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [genre, typeface, person, book],
}
