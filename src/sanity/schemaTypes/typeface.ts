import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'typeface',
  type: 'document',

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

    defineField({
      name: 'url',
      type: 'url',
    }),
  ],

  preview: {
    select: {
      title: 'name',
    },
  },
})
