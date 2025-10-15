import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'person',
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
