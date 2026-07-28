import type { Product, ProductFilters, PaginatedResponse } from '../types'
import {
  getProductsServerFn,
  getProductBySlugServerFn,
  getFeaturedProductsServerFn,
  getBestSellersServerFn,
  getNewArrivalsServerFn,
  getRelatedProductsServerFn,
  createProductServerFn,
  updateProductServerFn,
  deleteProductServerFn,
} from '../server/functions/products'

// Wrapper functions that route query execution to the server
export async function getProducts(
  filters: ProductFilters = {},
): Promise<PaginatedResponse<Product>> {
  return await getProductsServerFn({ data: filters })
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return await getProductBySlugServerFn({ data: slug })
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return await getFeaturedProductsServerFn()
}

export async function getBestSellers(): Promise<Product[]> {
  return await getBestSellersServerFn()
}

export async function getNewArrivals(): Promise<Product[]> {
  return await getNewArrivalsServerFn()
}

export async function getRelatedProducts(
  productId: string,
  categoryId?: string,
): Promise<Product[]> {
  return await getRelatedProductsServerFn({ data: { productId, categoryId } })
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  return await createProductServerFn({ data: product })
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  return await updateProductServerFn({ data: { id, updates } })
}

export async function deleteProduct(id: string): Promise<void> {
  return await deleteProductServerFn({ data: id })
}
