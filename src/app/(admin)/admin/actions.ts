'use server'

import {revalidatePath} from 'next/cache'
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import slugify from 'slugify'
import {CreditRole} from '@prisma/client'
import {prisma} from '@/lib/prisma'
import {storeCover} from '@/lib/coverStorage'

const toSlug = (value: string) => slugify(value, {lower: true, strict: true})

const text = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim()

const names = (formData: FormData, key: string) =>
  text(formData, key)
    .split('\n')
    .map((name) => name.trim())
    .filter(Boolean)

async function upsertPeople(nameList: string[]) {
  const people = []
  for (const name of nameList) {
    const slug = toSlug(name)
    const person = await prisma.person.upsert({
      where: {slug},
      update: {name},
      create: {slug, name},
    })
    people.push(person)
  }
  return people
}

async function syncCredits(bookId: string, role: CreditRole, nameList: string[]) {
  const people = await upsertPeople(nameList)
  await prisma.bookCredit.deleteMany({where: {bookId, role}})
  await prisma.bookCredit.createMany({
    data: people.map((person, position) => ({
      bookId,
      personId: person.id,
      role,
      position,
    })),
  })
}

async function syncGenre(name: string) {
  if (!name) return null
  const slug = toSlug(name)
  return prisma.genre.upsert({
    where: {slug},
    update: {name},
    create: {slug, name},
  })
}

export async function loginAdmin(formData: FormData) {
  const password = process.env.ADMIN_PASSWORD
  const attempt = text(formData, 'password')
  if (!password || attempt !== password) {
    redirect('/admin/login?error=1')
  }
  const jar = await cookies()
  jar.set('bca_admin', password, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  redirect('/admin')
}

export async function saveBook(formData: FormData) {
  const id = text(formData, 'id')
  const title = text(formData, 'title')
  const slug = text(formData, 'slug') || toSlug(title)
  const file = formData.get('file')
  const uploaded = file instanceof File && file.size > 0 ? await storeCover(file) : ''
  const cover = uploaded || text(formData, 'cover')
  const publisher = text(formData, 'publisher')
  const isbn = text(formData, 'isbn')
  const genreName = text(formData, 'genre')
  const notes = text(formData, 'notes')
  const yearValue = Number(text(formData, 'year'))
  const year = Number.isFinite(yearValue) && yearValue > 0 ? yearValue : null
  const widthValue = Number(text(formData, 'width'))
  const heightValue = Number(text(formData, 'height'))

  if (!title || !cover) {
    throw new Error('Title and a cover file or URL are required')
  }

  const genre = await syncGenre(genreName)
  const data = {
    title,
    slug,
    publisher: publisher || null,
    isbn: isbn || null,
    notes: notes || null,
    year,
    genreId: genre?.id ?? null,
    datePublished: year ? new Date(`${year}-01-01`) : new Date(),
  }

  const book = id
    ? await prisma.book.update({where: {id}, data})
    : await prisma.book.create({data})

  await prisma.bookImage.deleteMany({where: {bookId: book.id}})
  await prisma.bookImage.create({
    data: {
      bookId: book.id,
      url: cover,
      width: Number.isFinite(widthValue) && widthValue > 0 ? widthValue : 1000,
      height: Number.isFinite(heightValue) && heightValue > 0 ? heightValue : 1500,
      position: 0,
    },
  })

  await syncCredits(book.id, CreditRole.AUTHOR, names(formData, 'authors'))
  await syncCredits(book.id, CreditRole.DESIGNER, names(formData, 'designers'))
  await syncCredits(book.id, CreditRole.ILLUSTRATOR, names(formData, 'illustrators'))
  await syncCredits(book.id, CreditRole.ART_DIRECTOR, names(formData, 'artDirectors'))
  await syncCredits(book.id, CreditRole.PHOTOGRAPHER, names(formData, 'photographers'))

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath(`/book/${book.slug}`)
  redirect(`/admin/books/${book.id}`)
}

export async function deleteBook(formData: FormData) {
  const id = text(formData, 'id')
  if (!id) return
  await prisma.book.delete({where: {id}})
  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function savePerson(formData: FormData) {
  const id = text(formData, 'id')
  const name = text(formData, 'name')
  const homepage = text(formData, 'homepage')
  const slug = text(formData, 'slug') || toSlug(name)
  if (!name) throw new Error('Name is required')

  if (id) {
    await prisma.person.update({
      where: {id},
      data: {name, slug, homepage: homepage || null},
    })
  } else {
    await prisma.person.create({
      data: {name, slug, homepage: homepage || null},
    })
  }

  revalidatePath('/admin/people')
  redirect('/admin/people')
}
