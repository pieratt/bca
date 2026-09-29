import {CreditRole} from '@prisma/client'
import type {LocalBook} from '@/data/archive'
import {CoverGrid} from '../bookIndex/CoverGrid'

const headingFor = (name: string, role?: CreditRole) => {
  if (role === CreditRole.PHOTOGRAPHER) return `Photography by ${name}`
  if (role === CreditRole.ILLUSTRATOR) return `Illustration by ${name}`
  if (role === CreditRole.ART_DIRECTOR) return `Art direction by ${name}`
  if (role === CreditRole.AUTHOR) return `Books by ${name}`
  return `Covers by ${name}`
}

export const PersonPage = ({
  name,
  books,
  role,
}: {
  name: string
  books: LocalBook[]
  role?: CreditRole
}) => <CoverGrid books={books} heading={headingFor(name, role)} />
