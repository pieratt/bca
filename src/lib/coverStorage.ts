import {mkdir, writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import slugify from 'slugify'

const filenameFor = (file: File) => {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
  const base = slugify(file.name.replace(/\.[^.]+$/, ''), {lower: true, strict: true}) || 'cover'
  return `${base}-${Date.now()}.${ext}`
}

export async function storeCover(file: File) {
  const filename = filenameFor(file)
  const bytes = Buffer.from(await file.arrayBuffer())

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const {put} = await import('@vercel/blob')
    const blob = await put(`covers/${filename}`, bytes, {
      access: 'public',
      contentType: file.type || 'image/jpeg',
    })
    return blob.url
  }

  const dir = join(process.cwd(), 'public/covers')
  await mkdir(dir, {recursive: true})
  await writeFile(join(dir, filename), bytes)
  return `/covers/${filename}`
}
