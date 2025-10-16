import type {StructureResolver} from 'sanity/structure'

import {LuBookOpen, LuPersonStanding, LuLetterText, LuFilm} from 'react-icons/lu'

const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('book').title('Books').icon(LuBookOpen),
      S.documentTypeListItem('person').title('People').icon(LuPersonStanding),
      S.documentTypeListItem('typeface').title('Typeface').icon(LuLetterText),
      S.documentTypeListItem('genre').title('Genre').icon(LuFilm),

      // group(S, 'Miscellaneous', [
      // 	S.documentTypeListItem('logo').title('Logos'),
      // ]).icon(BsDatabaseAdd),
    ])

export default structure
