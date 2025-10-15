import { defineQuery } from "next-sanity"
import { imageFragment, linkFragment } from "./fragments"

export const siteSettingsQuery = defineQuery(`
  *[_type == 'siteSettings'][0]{
    title,
    description,
    shareImage ${imageFragment},
    socialLinks[] {
      _key,
      label,
      iconKey,
      link ${linkFragment}
    },
    navigation[] {
      _key,
      label,
      link ${linkFragment}
    }
  }
`)
