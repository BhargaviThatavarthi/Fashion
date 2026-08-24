import type { Collection } from '../types'
import {
  getCollectionsServerFn,
  getCollectionBySlugServerFn,
} from '../server/functions/collections'

export async function getCollections(): Promise<Collection[]> {
  return await getCollectionsServerFn()
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  return await getCollectionBySlugServerFn({ data: slug })
}
