import { createServerFn } from '@tanstack/react-start'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import type { Category } from '../../types'
import { DEMO_CATEGORIES } from '../../types'
import fs from 'fs/promises'
import path from 'path'

const getFilePath = (fileName: string) => {
  return path.join(process.cwd(), 'src', 'server', 'data', fileName)
}

async function readJson<T>(fileName: string, defaultData: T): Promise<T> {
  try {
    const file = getFilePath(fileName)
    const raw = await fs.readFile(file, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    return defaultData
  }
}

async function writeJson<T>(fileName: string, data: T): Promise<void> {
  const file = getFilePath(fileName)
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8')
}

export const getCategoriesServerFn = createServerFn({
  method: 'GET',
}).handler(async (): Promise<Category[]> => {
  const categoryMap = new Map<string, Category>()

  // 1. Query Supabase categories table
  if (isSupabaseConfigured()) {
    try {
      const { data: dbCats } = await supabase.from('categories').select('*').order('id', { ascending: true })
      if (dbCats && dbCats.length > 0) {
        dbCats.forEach((c) => {
          const defaultImage = `/images/categories/${c.slug}.jpg`
          categoryMap.set(c.slug.toLowerCase(), {
            id: String(c.id),
            name: c.name,
            slug: c.slug,
            image: defaultImage,
            description: c.description || null,
          })
        })
      }
    } catch (err: any) {
      console.warn('Supabase categories query notice:', err?.message || String(err))
    }
  }

  // 2. If no categories in DB, seed with base canonical categories
  if (categoryMap.size === 0) {
    DEMO_CATEGORIES.forEach((c) => {
      categoryMap.set(c.slug.toLowerCase(), c)
    })
  }

  return Array.from(categoryMap.values())
})

// 2. Get Category By Slug
export const getCategoryBySlugServerFn = createServerFn({
  method: 'GET',
})
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const cats = await getCategoriesServerFn()
    return cats.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null
  })

// 3. Create Category
export const createCategoryServerFn = createServerFn({
  method: 'POST',
})
  .validator((cat: Partial<Category>) => cat)
  .handler(async ({ data: cat }) => {
    if (!isSupabaseConfigured()) {
      const categories = await readJson<Category[]>('categories.json', [])
      const newCat: Category = {
        id: Math.random().toString(36).substring(2, 11),
        created_at: new Date().toISOString(),
        name: '',
        slug: '',
        ...cat,
      } as Category
      categories.push(newCat)
      await writeJson('categories.json', categories)
      return newCat
    }

    const insertData = {
      id: cat.id || crypto.randomUUID(),
      ...cat,
    }

    const { data, error } = await supabase
      .from('categories')
      .insert(insertData)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as Category
  })

// 4. Update Category
export const updateCategoryServerFn = createServerFn({
  method: 'POST',
})
  .validator((data: { id: string; updates: Partial<Category> }) => data)
  .handler(async ({ data: { id, updates } }) => {
    if (!isSupabaseConfigured()) {
      const categories = await readJson<Category[]>('categories.json', [])
      const idx = categories.findIndex((c) => c.id === id)
      if (idx === -1) throw new Error('Category not found')
      const updated = {
        ...categories[idx],
        ...updates,
      }
      categories[idx] = updated
      await writeJson('categories.json', categories)
      return updated
    }

    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as Category
  })

// 5. Delete Category
export const deleteCategoryServerFn = createServerFn({
  method: 'POST',
})
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (!isSupabaseConfigured()) {
      const categories = await readJson<Category[]>('categories.json', [])
      const updated = categories.filter((c) => c.id !== id)
      await writeJson('categories.json', updated)
      return
    }

    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw new Error(error.message)
  })
