import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'genre',
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
  ],

  preview: {
    select: {
      title: 'name',
    },
  },
})
