import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from '@/lib'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  stega: {
    studioUrl: '/studio',
  },
})
