import { createServerFn } from '@tanstack/react-start'
import type { Collection } from '../../types'
import { DEMO_COLLECTIONS } from '../../types'

// 1. Get All Collections (Canonical collections)
export const getCollectionsServerFn = createServerFn({
  method: 'GET',
}).handler(async (): Promise<Collection[]> => {
  return DEMO_COLLECTIONS
})

// 2. Get Collection By Slug
export const getCollectionBySlugServerFn = createServerFn({
  method: 'GET',
})
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    return DEMO_COLLECTIONS.find((c) => c.slug === slug) || null
  })

