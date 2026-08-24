import type { Category } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { STATIC_CATEGORIES, getStaticCategory, getStaticCategoryImage } from '../constants/categories'
import {
  getCategoriesServerFn,
  createCategoryServerFn,
  updateCategoryServerFn,
  deleteCategoryServerFn,
} from '../server/functions/categories'

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured() && typeof window !== 'undefined') {
    try {
      const { data: dbCats, error } = await supabase.from('categories').select('*').order('id', { ascending: true })
      if (!error && dbCats && dbCats.length > 0) {
        return dbCats.map((c) => {
          const staticCat = getStaticCategory(c.slug) || getStaticCategory(c.name) || getStaticCategory(c.id)
          return {
            id: String(c.id),
            name: c.name,
            slug: c.slug,
            image: staticCat?.image || getStaticCategoryImage(c.slug),
            description: staticCat?.description || c.description || null,
          }
        })
      }
    } catch (err: any) {
      console.warn('Direct client getCategories notice:', err.message)
    }
  }
  return STATIC_CATEGORIES
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cats = await getCategories()
  return (
    cats.find(
      (c) =>
        c.slug.toLowerCase() === slug.toLowerCase() ||
        c.name.toLowerCase() === slug.toLowerCase() ||
        c.id === slug,
    ) ||
    getStaticCategory(slug) ||
    null
  )
}

export async function createCategory(cat: Partial<Category>): Promise<Category> {
  return await createCategoryServerFn({ data: cat })
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  return await updateCategoryServerFn({ data: { id, updates } })
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteCategoryServerFn({ data: id })
}
