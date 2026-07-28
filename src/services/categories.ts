import type { Category } from '../types'
import {
  getCategoriesServerFn,
  getCategoryBySlugServerFn,
  createCategoryServerFn,
  updateCategoryServerFn,
  deleteCategoryServerFn,
} from '../server/functions/categories'

export async function getCategories(): Promise<Category[]> {
  return await getCategoriesServerFn()
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return await getCategoryBySlugServerFn({ data: slug })
}

export async function createCategory(cat: Partial<Category>): Promise<Category> {
  return await createCategoryServerFn({ data: cat })
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  return await updateCategoryServerFn({ data: { id, updates } })
}

export async function deleteCategory(id: string): Promise<void> {
  return await deleteCategoryServerFn({ data: id })
}
