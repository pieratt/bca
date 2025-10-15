import {defineField, defineType} from 'sanity'
import {minCount} from 'sanity-advanced-validators'

const genre = defineType({
  name: 'genre',
  type: 'document',

  fields: [
    defineField({
      name: 'slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'genre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'genre',
    },
  },
})

const person = defineType({
  name: 'person',
  type: 'document',

  groups: [{name: 'overview', default: true}, {name: 'contents'}],

  fields: [
    defineField({
      name: 'slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // group some of these
    defineField({
      name: 'homepage',
      type: 'url',
    }),
  ],

  preview: {
    select: {
      title: 'name',
    },
  },
})

const book = defineType({
  name: 'book',
  type: 'document',

  fields: [
    defineField({
      name: 'slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'notes',
      type: 'array',
      of: [{type: 'block'}],
    }),

    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'legacyId',
      type: 'string',
      hidden: true,
    }),

    // group some of these
    defineField({
      name: 'isbn',
      type: 'string',
    }),

    defineField({
      name: 'isbnNum',
      type: 'string',
    }),

    defineField({
      name: 'genre',
      type: 'string',
    }),

    defineField({
      name: 'images',
      type: 'array',
      of: [{type: 'image'}],
      validation: (Rule) => Rule.required().custom(minCount(1)),
    }),

    defineField({
      name: 'designers',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
        },
      ],
    }),

    defineField({
      name: 'authors',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
        },
      ],
    }),

    defineField({
      name: 'illustrators',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
        },
      ],
    }),

    defineField({
      name: 'artDirectors',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
        },
      ],
    }),

    defineField({
      name: 'photographers',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
        },
      ],
    }),

    defineField({
      name: 'typefaces',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
        },
      ],
    }),
  ],
})

export const schemaTypes = [book, person]
