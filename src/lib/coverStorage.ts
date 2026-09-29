import {mkdir, writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import slugify from 'slugify'

const filenameFor = (name: string) => {
  const ext = name.includes('.') ? name.split('.').pop() : 'jpg'
  const base = slugify(name.replace(/\.[^.]+$/, ''), {lower: true, strict: true}) || 'cover'
  return `${base}-${Date.now()}.${ext}`
}

async function writeCover(filename: string, bytes: Buffer, contentType: string) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const {put} = await import('@vercel/blob')
    const blob = await put(`covers/${filename}`, bytes, {
      access: 'public',
      contentType,
    })
    return blob.url
  }

  const dir = join(process.cwd(), 'public/covers')
  await mkdir(dir, {recursive: true})
  await writeFile(join(dir, filename), bytes)
  return `/covers/${filename}`
}

export async function storeCover(file: File) {
  return writeCover(filenameFor(file.name), Buffer.from(await file.arrayBuffer()), file.type || 'image/jpeg')
}

export async function storeCoverBytes(name: string, data: Uint8Array, contentType = 'image/jpeg') {
  return writeCover(filenameFor(name), Buffer.from(data), contentType)
}
