import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Save, ArrowLeft, Plus, X, Upload, RotateCw, Eye } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { createProduct } from '../../services/products'
import { getCategories } from '../../services/categories'
import { STATIC_CATEGORIES, getStaticCategory } from '../../constants/categories'
import { slugify, formatPrice, getImageUrl } from '../../utils/format'
import { FABRIC_OPTIONS, SIZE_OPTIONS } from '../../constants'
import { validateAndCompressImage, uploadProductImage } from '../../lib/storage'
import { getSharedMedia, addSharedMedia, type MediaItem } from '../../utils/media'

export const Route = createFileRoute('/admin/products/new')({
  component: AdminProductForm,
})

function AdminProductForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [discount, setDiscount] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Custom states for new fields
  const [colorInput, setColorInput] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  
  // Cropper states
  const [croppingIdx, setCroppingIdx] = useState<number | null>(null)
  const [cropZoom, setCropZoom] = useState(1)
  const [cropRotation, setCropRotation] = useState(0)

  // Preview Modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Media Library Reuse Modal
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [availableMedia, setAvailableMedia] = useState<MediaItem[]>([])

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    category_id: '',
    fabric: '',
    color: [] as string[],
    sizes: [] as string[],
    price: '',
    offer_price: '',
    images: [] as string[],
    sku: '',
    wash_care: '',
    featured: false,
    best_seller: false,
    new_arrival: true,
    stock: '15',
    in_stock: true,
    tags: [] as string[],
  })

  useEffect(() => {
    if (isMediaModalOpen) {
      setAvailableMedia(getSharedMedia())
    }
  }, [isMediaModalOpen])

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }))

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: slugify(name) }))
  }

  const toggleSize = (size: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }))
  }

  const addColor = () => {
    if (colorInput.trim() && !form.color.includes(colorInput.trim())) {
      setForm((f) => ({ ...f, color: [...f.color, colorInput.trim()] }))
      setColorInput('')
    }
  }

  const removeColor = (idx: number) => {
    setForm((f) => ({ ...f, color: f.color.filter((_, i) => i !== idx) }))
  }

  const addTag = () => {
    if (tagsInput.trim() && !form.tags.includes(tagsInput.trim())) {
      setForm((f) => ({ ...f, tags: [...f.tags, tagsInput.trim()] }))
      setTagsInput('')
    }
  }

  const removeTag = (idx: number) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((_, i) => i !== idx) }))
  }

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      if (form.images.length >= 10) {
        alert('You can add a maximum of 10 images per product.')
        return
      }
      setForm((f) => ({ ...f, images: [...f.images, imageUrl.trim()] }))
      setImageUrl('')
    }
  }

  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (form.images.length + files.length > 10) {
      alert('You can upload a maximum of 10 images per product.')
      return
    }

    const selectedCategory = categories?.find((c) => c.id === form.category_id)?.name || form.category_id || 'general'

    setUploading(true)
    setUploadProgress(10)
    try {
      const uploadedUrls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setUploadProgress(Math.round(10 + (i / files.length) * 40))

        // 1. Validate & Compress Image on Client
        const { blob, previewUrl, compressedSize } = await validateAndCompressImage(file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.82,
        })

        setUploadProgress(Math.round(50 + (i / files.length) * 45))

        // 2. Upload to Supabase Storage in category-specific folder (e.g. tops/, dresses/, jeans/)
        const { publicUrl } = await uploadProductImage(blob, file.name, selectedCategory)

        const finalUrl = publicUrl || previewUrl
        uploadedUrls.push(finalUrl)
        addSharedMedia(file.name, finalUrl, compressedSize)
      }

      setUploadProgress(100)
      setForm((f) => {
        const nextImages = [...f.images, ...uploadedUrls]
        return {
          ...f,
          images: nextImages,
        }
      })
      setTimeout(() => setUploadProgress(0), 600)
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || err))
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const handlePriceChange = (val: string) => {
    set('price', val)
    const numPrice = parseFloat(val)
    if (!isNaN(numPrice)) {
      if (discount) {
        const numDiscount = parseFloat(discount)
        const calculatedOffer = Math.round(numPrice * (1 - numDiscount / 100))
        set('offer_price', calculatedOffer.toString())
      } else if (form.offer_price) {
        const numOffer = parseFloat(form.offer_price)
        if (numOffer < numPrice) {
          const calculatedDiscount = Math.round(((numPrice - numOffer) / numPrice) * 100)
          setDiscount(calculatedDiscount > 0 ? calculatedDiscount.toString() : '')
        }
      }
    } else {
      set('offer_price', '')
      setDiscount('')
    }
  }

  const handleDiscountChange = (val: string) => {
    setDiscount(val)
    const numPrice = parseFloat(form.price)
    const numDiscount = parseFloat(val)
    if (!isNaN(numPrice) && !isNaN(numDiscount) && numDiscount >= 0 && numDiscount <= 100) {
      const calculatedOffer = Math.round(numPrice * (1 - numDiscount / 100))
      set('offer_price', calculatedOffer.toString())
    } else {
      set('offer_price', '')
    }
  }

  const handleOfferPriceChange = (val: string) => {
    set('offer_price', val)
    const numPrice = parseFloat(form.price)
    const numOffer = parseFloat(val)
    if (!isNaN(numPrice) && !isNaN(numOffer) && numPrice > 0) {
      const calculatedDiscount = Math.round(((numPrice - numOffer) / numPrice) * 100)
      setDiscount(calculatedDiscount >= 0 && calculatedDiscount <= 100 ? calculatedDiscount.toString() : '')
    } else {
      setDiscount('')
    }
  }

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  const moveImage = (idx: number, direction: 'left' | 'right') => {
    setForm((f) => {
      const imgs = [...f.images]
      const targetIdx = direction === 'left' ? idx - 1 : idx + 1
      if (targetIdx < 0 || targetIdx >= imgs.length) return f
      const temp = imgs[idx]
      imgs[idx] = imgs[targetIdx]
      imgs[targetIdx] = temp
      return { ...f, images: imgs }
    })
  }

  const selectFromMediaLibrary = (url: string) => {
    setForm((f) => {
      const isSelected = f.images.includes(url)
      if (isSelected) {
        return { ...f, images: f.images.filter(img => img !== url) }
      } else {
        if (f.images.length >= 10) {
          alert('You can add a maximum of 10 images per product.')
          return f
        }
        return { ...f, images: [...f.images, url] }
      }
    })
  }

  const applyCrop = () => {
    if (croppingIdx === null) return
    const src = form.images[croppingIdx]

    if (!src.startsWith('data:') && !src.startsWith('http') && !src.startsWith('/')) {
      alert('Cannot crop this image format.')
      setCroppingIdx(null)
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const angle = (cropRotation * Math.PI) / 180
      const sin = Math.abs(Math.sin(angle))
      const cos = Math.abs(Math.cos(angle))
      
      const width = img.width
      const height = img.height
      const newWidth = Math.round(width * cos + height * sin)
      const newHeight = Math.round(width * sin + height * cos)

      canvas.width = Math.round(newWidth * 0.9)
      canvas.height = Math.round(newHeight * 0.9)

      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(angle)
      ctx.scale(cropZoom, cropZoom)
      ctx.drawImage(img, -width / 2, -height / 2)

      const croppedUrl = canvas.toDataURL('image/jpeg', 0.9)
      setForm((f) => {
        const imgs = [...f.images]
        imgs[croppingIdx] = croppedUrl
        return { ...f, images: imgs }
      })
      setCroppingIdx(null)
    }
    img.src = src
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let currentImages = [...form.images]
      if (imageUrl.trim() && !currentImages.includes(imageUrl.trim())) {
        currentImages.push(imageUrl.trim())
      }

      const categoryObj =
        (categories && categories.length > 0 ? categories : STATIC_CATEGORIES)?.find(
          (c) => c.id === form.category_id || c.slug === form.category_id || c.name === form.category_id,
        ) || getStaticCategory(form.category_id)
      const categoryId = categoryObj?.id || form.category_id || undefined
      const categoryName = categoryObj?.name || form.category_id || ''

      if (!categoryId) {
        alert('Please select a category for this product.')
        setSaving(false)
        return
      }

      const stockQty = parseInt(form.stock) || 0
      const inStock = stockQty > 0 && form.in_stock !== false

      await createProduct({
        ...form,
        images: currentImages,
        image_url: currentImages[0] || null,
        price: parseFloat(form.price) || 0,
        offer_price: form.offer_price ? parseFloat(form.offer_price) : undefined,
        stock: stockQty,
        stock_quantity: stockQty,
        in_stock: inStock,
        category: categoryName,
        category_id: categoryId,
      })

      // Invalidate queries so /shop and admin lists immediately show the new product
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      await queryClient.invalidateQueries({ queryKey: ['featured-products'] })
      await queryClient.invalidateQueries({ queryKey: ['best-sellers'] })
      await queryClient.invalidateQueries({ queryKey: ['new-arrivals'] })
      await queryClient.invalidateQueries({ queryKey: ['festival-products'] })
      await queryClient.invalidateQueries({ queryKey: ['categories'] })

      navigate({ to: '/admin/products' })
    } catch (err: any) {
      alert('Failed to save product: ' + (err.message || err))
      setSaving(false)
    }
  }

  const selectedCategoryName = categories?.find((c) => c.id === form.category_id)?.name || 'Category'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-700 text-gray-800">Add New Product</h1>
            <p className="text-gray-400 text-sm">Fill in the product details below</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="btn-pink px-4 py-2.5 text-xs flex items-center gap-1.5 bg-white text-pink-600 border border-pink-200 shadow-sm hover:bg-pink-50/20 cursor-pointer"
          style={{ background: 'white', color: 'var(--color-pink)', borderColor: 'var(--color-pink-light)' }}
        >
          <Eye size={14} />
          Preview Card
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 font-body">
        {/* Main Fields */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#f0e0e8' }}>
            <h2 className="font-heading font-700 text-gray-800 mb-5">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  placeholder="e.g. Royal Kanjivaram Silk Saree"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                  style={{ borderColor: 'var(--color-pink-light)' }}
                />
              </div>

              <div>
                <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => set('slug', e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50"
                  style={{ borderColor: 'var(--color-pink-light)' }}
                />
              </div>

              <div>
                <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Description</label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describe the product in detail..."
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
                  style={{ borderColor: 'var(--color-pink-light)' }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    required
                    min={0}
                    placeholder="0"
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                    style={{ borderColor: 'var(--color-pink-light)' }}
                  />
                </div>
                <div>
                  <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Discount (%)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    min={0}
                    max={100}
                    placeholder="0"
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                    style={{ borderColor: 'var(--color-pink-light)' }}
                  />
                </div>
                <div>
                  <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Offer Price (₹)</label>
                  <input
                    type="number"
                    value={form.offer_price}
                    onChange={(e) => handleOfferPriceChange(e.target.value)}
                    min={0}
                    placeholder="Offer price"
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                    style={{ borderColor: 'var(--color-pink-light)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">SKU</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => set('sku', e.target.value)}
                    placeholder="SSF-XXX-001"
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                    style={{ borderColor: 'var(--color-pink-light)' }}
                  />
                </div>
                <div>
                  <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Stock Quantity</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => set('stock', e.target.value)}
                    min={0}
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                    style={{ borderColor: 'var(--color-pink-light)' }}
                  />
                </div>
                <div>
                  <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Fabric</label>
                  <select
                    value={form.fabric}
                    onChange={(e) => set('fabric', e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none bg-white text-gray-700"
                    style={{ borderColor: 'var(--color-pink-light)' }}
                  >
                    <option value="">Select Fabric</option>
                    {FABRIC_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Wash Care Instructions</label>
                <input
                  type="text"
                  value={form.wash_care}
                  onChange={(e) => set('wash_care', e.target.value)}
                  placeholder="e.g. Dry clean only"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                  style={{ borderColor: 'var(--color-pink-light)' }}
                />
              </div>
            </div>
          </div>

          {/* Color & Tags Configuration */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#f0e0e8' }}>
            <h2 className="font-heading font-700 text-gray-800 mb-4">Colors &amp; Tags</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Colors */}
              <div>
                <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Available Colors</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    placeholder="Add color (e.g. Rose Pink)"
                    className="flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none"
                    style={{ borderColor: 'var(--color-pink-light)' }}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                  />
                  <button type="button" onClick={addColor} className="btn-pink px-3 py-2 text-xs cursor-pointer">Add</button>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {form.color.map((col, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-600 bg-gray-50 border border-gray-100 text-gray-700">
                      {col}
                      <button type="button" onClick={() => removeColor(idx)} className="text-gray-400 hover:text-red-500 cursor-pointer">✕</button>
                    </span>
                  ))}
                  {form.color.length === 0 && <span className="text-xs text-gray-400 italic">No colors specified</span>}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Product Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Add tag (e.g. Traditional)"
                    className="flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none"
                    style={{ borderColor: 'var(--color-pink-light)' }}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button type="button" onClick={addTag} className="btn-pink px-3 py-2 text-xs cursor-pointer">Add</button>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {form.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-700 uppercase bg-pink-50 border border-pink-100 text-pink-600" style={{ color: 'var(--color-pink)', background: 'var(--color-pink-light)', borderColor: 'var(--color-pink-light)' }}>
                      {tag}
                      <button type="button" onClick={() => removeTag(idx)} className="hover:text-red-500 cursor-pointer">✕</button>
                    </span>
                  ))}
                  {form.tags.length === 0 && <span className="text-xs text-gray-400 italic">No tags specified</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Multiple Image Upload with preview, reordering, and deleting */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#f0e0e8' }}>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="font-heading font-700 text-gray-800">Product Images</h2>
                <p className="text-xs text-gray-400 mt-0.5">Drag &amp; drop up to 10 images (Max 5MB each)</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(true)}
                className="text-xs font-nav font-700 text-pink-600 hover:underline border border-pink-200 px-3 py-1.5 rounded-lg cursor-pointer"
                style={{ color: 'var(--color-pink)', borderColor: 'var(--color-pink-light)' }}
              >
                Choose from Media
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Add via URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none"
                    style={{ borderColor: 'var(--color-pink-light)' }}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                  />
                  <button type="button" onClick={addImageUrl} className="btn-pink px-4 py-3 flex items-center gap-1 text-sm cursor-pointer">
                    <Plus size={14} />
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Upload from Local</label>
                <label
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-3 cursor-pointer hover:bg-pink-50/10 transition-all text-center relative ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  style={{ borderColor: 'var(--color-pink-light)' }}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    disabled={uploading}
                    onChange={handleLocalImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors">
                    <Upload size={16} className={uploading ? 'animate-bounce text-pink-500' : 'text-gray-400'} />
                    <span className="text-sm font-600">{uploading ? `Uploading (${uploadProgress}%)` : 'Choose or Drag Images'}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Upload Progress Bar */}
            {uploading && (
              <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-pink-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%`, backgroundColor: 'var(--color-pink)' }}
                />
              </div>
            )}

            {/* Previews & Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border group shadow-sm flex flex-col justify-end" style={{ borderColor: 'var(--color-pink-light)' }}>
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover absolute inset-0" />
                  
                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-between items-center">
                      <span className="bg-pink-600 text-white font-nav text-[10px] font-700 px-1.5 py-0.5 rounded">
                        {idx === 0 ? 'Main' : `Img ${idx + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <div className="flex justify-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveImage(idx, 'left')}
                        className="w-7 h-7 bg-white text-gray-700 rounded-lg flex items-center justify-center disabled:opacity-40 hover:scale-105 transition-transform text-xs font-nav font-700 cursor-pointer"
                        title="Move Left"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCroppingIdx(idx)
                          setCropZoom(1)
                          setCropRotation(0)
                        }}
                        className="w-7 h-7 bg-white text-gray-700 rounded-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                        title="Crop / Rotate"
                      >
                        <RotateCw size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === form.images.length - 1}
                        onClick={() => moveImage(idx, 'right')}
                        className="w-7 h-7 bg-white text-gray-700 rounded-lg flex items-center justify-center disabled:opacity-40 hover:scale-105 transition-transform text-xs font-nav font-700 cursor-pointer"
                        title="Move Right"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {form.images.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-400 text-sm border-2 border-dashed rounded-xl" style={{ borderColor: 'var(--color-pink-light)' }}>
                  No images added yet. Click upload, choose from library, or enter a URL above.
                </div>
              )}
            </div>
          </div>

          {/* Sizes Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#f0e0e8' }}>
            <h2 className="font-heading font-700 text-gray-800 mb-4">Available Sizes</h2>
            <div className="flex gap-2 flex-wrap">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className="w-14 h-10 rounded-xl border text-xs font-nav font-700 transition-all cursor-pointer"
                  style={{
                    borderColor: form.sizes.includes(size) ? 'var(--color-pink)' : 'var(--color-pink-light)',
                    background: form.sizes.includes(size) ? 'var(--color-pink)' : 'white',
                    color: form.sizes.includes(size) ? 'white' : 'var(--color-gray)',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#f0e0e8' }}>
            <h2 className="font-heading font-700 text-gray-800 mb-5">Classification</h2>

            <div className="space-y-5">
              <div>
                <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Category *</label>
                <select
                  required
                  value={form.category_id}
                  onChange={(e) => set('category_id', e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none bg-white text-gray-700 font-medium"
                  style={{ borderColor: 'var(--color-pink-light)' }}
                >
                  <option value="">Select Category *</option>
                  {(categories && categories.length > 0 ? categories : STATIC_CATEGORIES).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Flags */}
              <div className="space-y-3">
                {[
                  { key: 'featured', label: '⭐ Featured', desc: 'Show in featured section' },
                  { key: 'best_seller', label: '🏆 Best Seller', desc: 'Mark as bestseller' },
                  { key: 'new_arrival', label: '🆕 New Arrival', desc: 'Show in new arrivals' },
                ].map(({ key, label, desc }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form[key as keyof typeof form] as boolean}
                      onChange={(e) => set(key, e.target.checked)}
                      className="w-5 h-5 rounded border accent-pink-500 cursor-pointer"
                    />
                    <div>
                      <p className="font-nav font-600 text-sm text-gray-700">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <hr style={{ borderColor: '#fde8f0' }} />

              {/* Availability Toggle */}
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-nav font-700 text-xs uppercase tracking-wide text-gray-500">Product Availability</span>
                    <p className="text-xs text-gray-400 mt-0.5">{form.in_stock ? 'Product is in stock' : 'Product is out of stock'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => set('in_stock', !form.in_stock)}
                    className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${form.in_stock ? 'bg-pink-500' : 'bg-gray-200'}`}
                    style={form.in_stock ? { backgroundColor: 'var(--color-pink)' } : {}}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${form.in_stock ? 'right-1' : 'left-1'}`} />
                  </button>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-pink w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>

      {/* Choose from Media Library selector modal */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-heading font-700 text-gray-800 text-lg">Select Product Images</h3>
                <p className="text-xs text-gray-400 mt-0.5">Select existing assets to attach to this product ({form.images.length}/10 selected)</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Media Items Grid */}
            <div className="flex-1 overflow-y-auto min-h-[300px] border rounded-2xl p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3" style={{ borderColor: '#fde8f0' }}>
              {availableMedia.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-400 text-sm">No assets in Media Library yet.</div>
              ) : (
                availableMedia.map((media) => {
                  const isSelected = form.images.includes(media.url)
                  return (
                    <button
                      key={media.url}
                      type="button"
                      onClick={() => selectFromMediaLibrary(media.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected ? 'border-pink-500 scale-[0.97] ring-2 ring-pink-100' : 'border-gray-100 hover:border-pink-200'
                      }`}
                      style={isSelected ? { borderColor: 'var(--color-pink)' } : {}}
                    >
                      <img src={media.url} alt="" className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                          <span className="w-6 h-6 bg-pink-600 text-white text-xs font-700 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-pink)' }}>✓</span>
                        </div>
                      )}
                    </button>
                  )
                })
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="btn-pink px-5 py-2.5 text-xs"
              >
                Select Images
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropping simulation modal */}
      {croppingIdx !== null && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <h3 className="font-heading font-700 text-gray-800 mb-4 text-lg">Crop &amp; Edit Image</h3>
            
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border relative flex items-center justify-center">
              <img
                src={form.images[croppingIdx]}
                alt=""
                className="max-w-full max-h-full transition-transform duration-200"
                style={{
                  transform: `scale(${cropZoom}) rotate(${cropRotation}deg)`
                }}
              />
            </div>

            <div className="mt-5 space-y-4">
              {/* Zoom */}
              <div>
                <label className="block text-xs font-600 text-gray-400 uppercase tracking-wide mb-1">Zoom ({cropZoom.toFixed(1)}x)</label>
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.1"
                  value={cropZoom}
                  onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              {/* Rotation */}
              <div>
                <label className="block text-xs font-600 text-gray-400 uppercase tracking-wide mb-1">Rotate ({cropRotation}°)</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="90"
                  value={cropRotation}
                  onChange={(e) => setCropRotation(parseInt(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setCroppingIdx(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-700 text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyCrop}
                  className="btn-pink px-4 py-2 text-xs cursor-pointer"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pre-publishing visual preview modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full relative">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
            >
              ✕
            </button>
            <h3 className="font-heading font-700 text-gray-800 mb-4 text-sm uppercase tracking-wider text-gray-400">Pre-Publishing Card Preview</h3>

            {/* Simulated ProductCard */}
            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm" style={{ borderColor: '#f0e0e8' }}>
              <div className="aspect-[3/4] bg-gray-50 overflow-hidden relative">
                {form.images[0] ? (
                  <img src={getImageUrl(form.images[0])} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-pink-50 text-pink-300">🥻</div>
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {form.new_arrival && <span className="bg-pink-600 text-white text-[9px] font-700 px-2 py-0.5 rounded-full">NEW</span>}
                  {form.best_seller && <span className="bg-amber-500 text-white text-[9px] font-700 px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-gold)' }}>BESTSELLER</span>}
                  {discount && <span className="bg-green-500 text-white text-[9px] font-700 px-2 py-0.5 rounded-full">-{discount}% OFF</span>}
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <span className="font-nav text-[10px] font-600 uppercase tracking-widest text-amber-600" style={{ color: 'var(--color-gold)' }}>
                  {selectedCategoryName}
                </span>
                <h4 className="font-heading font-700 text-gray-800 text-sm leading-tight line-clamp-1">{form.name || 'Product Title'}</h4>
                {form.fabric && <p className="text-[10px] text-gray-400">Fabric: {form.fabric}</p>}
                
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="font-price font-sans text-base font-bold" style={{ color: 'var(--color-pink)' }}>
                    {formatPrice(parseFloat(form.offer_price) || parseFloat(form.price) || 0)}
                  </span>
                  {form.offer_price && (
                    <span className="font-price font-sans text-xs text-gray-400 line-through">
                      {formatPrice(parseFloat(form.price) || 0)}
                    </span>
                  )}
                </div>

                <div className="pt-2 flex gap-1 flex-wrap">
                  {form.sizes.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 border rounded text-[9px] font-700 text-gray-400">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="btn-pink px-4 py-2 text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
