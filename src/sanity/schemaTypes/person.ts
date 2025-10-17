import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'person',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: (doc: any) => doc.title,
      },
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
