import {defineField, defineType} from 'sanity'
import {minCount} from 'sanity-advanced-validators'

export default defineType({
  name: 'book',
  type: 'document',

  groups: [{name: 'overview', default: true}, {name: 'contributors'}, {name: 'notes'}],

  fieldsets: [
    {
      name: 'website',
      options: {columns: 2}, // Set to 2 columns
    },
    {
      name: 'data',
      options: {columns: 3}, // Set to 2 columns
    },
  ],

  orderings: [
    {
      title: 'Published on site (recent)',
      name: 'bookPublishedAsc',
      by: [{field: 'datePublished', direction: 'asc'}],
    },
    {
      title: 'Published on site (old)',
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
      fieldset: 'website',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'datePublished',
      title: '“Live” on site date',
      type: 'datetime',
      group: 'overview',
      fieldset: 'website',
      initialValue: () => new Date().toISOString(),
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
          'memoir',
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
      name: 'notes',
      description: 'Any comments or links you’d like to add.',
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
