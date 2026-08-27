import { supabase, isSupabaseConfigured } from './supabase'

export const STORAGE_BUCKET = 'product-images'

/**
 * Derives a clean folder slug from the category name.
 * e.g. "Tops" -> "tops", "Cotton Saree" -> "cotton-saree", "New Arrivals" -> "new-arrivals"
 */
export function getCategoryFolder(category?: string | null): string {
  if (!category) return 'general'
  const slug = category
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return slug || 'general'
}

export interface CompressedImageResult {
  blob: Blob
  previewUrl: string
  originalSize: number
  compressedSize: number
  width: number
  height: number
}

/**
 * Validates and compresses an image file using browser HTML5 Canvas.
 * This avoids consuming unnecessary Supabase storage quota on the Free plan.
 */
export function validateAndCompressImage(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {},
): Promise<CompressedImageResult> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.82 } = options

  return new Promise((resolve, reject) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return reject(
        new Error(`Unsupported file type: ${file.type}. Please use JPG, PNG, WEBP, or GIF.`),
      )
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB raw limit
    if (file.size > MAX_FILE_SIZE) {
      return reject(new Error(`File "${file.name}" exceeds the 10 MB limit.`))
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read image file.'))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Invalid or corrupted image file.'))
      img.onload = () => {
        let width = img.width
        let height = img.height

        // Downscale while preserving aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return reject(new Error('Could not create canvas 2D context.'))
        }

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Failed to compress image.'))
            }
            const previewUrl = URL.createObjectURL(blob)
            resolve({
              blob,
              previewUrl,
              originalSize: file.size,
              compressedSize: blob.size,
              width,
              height,
            })
          },
          'image/jpeg',
          quality,
        )
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Converts a data URL (base64) or blob URL string into a standard Blob.
 */
export async function dataUrlToBlob(urlOrData: string): Promise<Blob> {
  if (urlOrData.startsWith('data:') || urlOrData.startsWith('blob:')) {
    const res = await fetch(urlOrData)
    return await res.blob()
  }
  throw new Error('Provided string is not a valid data or blob URL')
}

/**
 * Uploads a compressed image Blob or File to Supabase Storage in the appropriate category folder.
 */
export async function uploadProductImage(
  fileOrBlob: Blob | File,
  originalFileName: string,
  category?: string | null,
): Promise<{ publicUrl: string; filePath: string; size: number }> {
  const folder = getCategoryFolder(category)
  const sanitizedName = originalFileName
    .toLowerCase()
    .replace(/\.[^/.]+$/, '') // remove extension
    .replace(/[^a-z0-9_-]/g, '_')
    .slice(0, 32)
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const filePath = `${folder}/${timestamp}_${randomSuffix}_${sanitizedName}.jpg`

  // 1. Upload to Supabase Storage bucket 'product-images'
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, fileOrBlob, {
      contentType: 'image/jpeg',
      cacheControl: '31536000', // 1 year CDN caching for optimized assets
      upsert: true,
    })

  if (uploadError) {
    console.error('Supabase Storage upload error:', uploadError)
    throw new Error(`Failed to upload to Supabase Storage: ${uploadError.message}`)
  }

  // 2. Obtain the public URL from Supabase Storage
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)
  let publicUrl = data?.publicUrl || ''

  if (!publicUrl) {
    const cleanUrl = supabaseUrl.replace(/\/+$/, '')
    publicUrl = `${cleanUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`
  }

  // 3. Track asset in media_assets table if available
  try {
    await supabase.from('media_assets').insert({
      file_name: originalFileName,
      file_path: filePath,
      public_url: publicUrl,
      file_type: 'image/jpeg',
      file_size: fileOrBlob.size,
      created_at: new Date().toISOString(),
    })
  } catch (trackErr) {
    console.debug('Media tracking notice:', trackErr)
  }

  return {
    publicUrl,
    filePath,
    size: fileOrBlob.size,
  }
}

/**
 * Extracts the storage file path (e.g., "tops/170000000_shirt.jpg") from a Supabase public Storage URL.
 */
export function extractStoragePath(urlOrPath: string): string | null {
  if (!urlOrPath) return null
  const trimmed = urlOrPath.trim()

  // Case 1: Already a relative path like "tops/1234_photo.jpg"
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/')) {
    return trimmed
  }

  // Case 2: Full Supabase Storage URL
  // e.g. https://xyz.supabase.co/storage/v1/object/public/product-images/tops/1234_photo.jpg
  const bucketMarker = `/${STORAGE_BUCKET}/`
  const index = trimmed.indexOf(bucketMarker)
  if (index !== -1) {
    const afterBucket = trimmed.slice(index + bucketMarker.length)
    // Remove any query params
    return afterBucket.split('?')[0]
  }

  return null
}

/**
 * Deletes a single image from Supabase Storage.
 */
export async function deleteProductImage(urlOrPath: string): Promise<boolean> {
  const filePath = extractStoragePath(urlOrPath)
  if (!filePath) return false

  if (!isSupabaseConfigured()) {
    return true
  }

  try {
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath])
    if (error) {
      console.warn(`Failed to delete storage file "${filePath}":`, error.message)
      return false
    }

    // Clean up media_assets table
    try {
      await supabase.from('media_assets').delete().eq('file_path', filePath)
    } catch (_) {}

    return true
  } catch (err: any) {
    console.warn(`Error deleting image "${filePath}":`, err.message)
    return false
  }
}

/**
 * Deletes multiple images from Supabase Storage in a single batch.
 */
export async function deleteProductImages(urlsOrPaths: string[]): Promise<void> {
  if (!urlsOrPaths || urlsOrPaths.length === 0) return

  const filePaths = urlsOrPaths
    .map((item) => extractStoragePath(item))
    .filter((p): p is string => Boolean(p))

  if (filePaths.length === 0 || !isSupabaseConfigured()) return

  try {
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(filePaths)
    if (error) {
      console.warn('Batch storage deletion notice:', error.message)
    }

    // Clean up media_assets table
    try {
      await supabase.from('media_assets').delete().in('file_path', filePaths)
    } catch (_) {}
  } catch (err: any) {
    console.warn('Batch image deletion failed:', err.message)
  }
}
