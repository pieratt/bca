import {defineField, defineType} from 'sanity'
import {minCount} from 'sanity-advanced-validators'

export default defineType({
  name: 'book',
  type: 'document',

  groups: [{name: 'overview', default: true}, {name: 'contributors'}, {name: 'notes'}],

  fieldsets: [
    {
      name: 'data',
      options: {columns: 3}, // Set to 2 columns
    },
  ],

  orderings: [
    {
      title: 'Published (recent)',
      name: 'bookPublishedAsc',
      by: [{field: 'datePublished', direction: 'asc'}],
    },
    {
      title: 'Published (old)',
      name: 'bookPublishedDesc',
      by: [{field: 'datePublished', direction: 'desc'}],
    },
  ],

  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'overview',
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: (doc: any) => doc.title,
      },
      group: 'overview',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'notes',
      type: 'array',
      of: [{type: 'block'}],
      group: 'notes',
    }),

    defineField({
      name: 'legacyId',
      type: 'string',
      group: 'overview',
      hidden: true,
    }),

    // group some of these
    defineField({
      name: 'isbn',
      type: 'string',
      group: 'overview',
      fieldset: 'data',
    }),

    defineField({
      name: 'publisher',
      type: 'string',
      group: 'overview',
      fieldset: 'data',
    }),

    defineField({
      name: 'genre',
      type: 'string',
      options: {
        list: [
          'art and design',
          'biographies and memoires',
          'comics',
          'fiction',
          'humor',
          'mystery',
          'nonfiction',
          'poetry',
          'reference',
          'science fiction',
          'uncategorized',
          'youth fiction',
        ],
        layout: 'dropdown',
      },
      group: 'overview',
      fieldset: 'data',
    }),

    defineField({
      name: 'typefaces',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'typeface'}],
        },
      ],
      group: 'overview',
    }),

    defineField({
      name: 'images',
      type: 'array',
      of: [{type: 'image'}],
      validation: (rule) => rule.required().custom(minCount(1)),
      group: 'overview',
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
      group: 'contributors',
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
      group: 'contributors',
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
      group: 'contributors',
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
      group: 'contributors',
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
      group: 'contributors',
    }),

    defineField({
      name: 'datePublished',
      type: 'datetime',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images',
    },
    prepare: ({title, media}) => ({
      title: title,
      media: media?.[0],
    }),
  },
})
