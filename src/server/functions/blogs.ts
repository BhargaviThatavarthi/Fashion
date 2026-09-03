import { createServerFn } from '@tanstack/react-start'
import type { BlogPost } from '../../types'
import { DEMO_BLOGS } from '../../types'
import blogsData from '../data/blogs.json'

export const getBlogPosts = createServerFn({ method: 'GET' })
  .validator((d: { category?: string; search?: string; tag?: string } | undefined) => d)
  .handler(async ({ data }) => {
    let posts: BlogPost[] = (blogsData as BlogPost[]) || DEMO_BLOGS

    if (data?.category && data.category !== 'All') {
      const catLower = data.category.toLowerCase()
      posts = posts.filter(
        (p) => p.category.toLowerCase() === catLower || p.tags.some((t) => t.toLowerCase() === catLower)
      )
    }

    if (data?.tag) {
      const tagLower = data.tag.toLowerCase()
      posts = posts.filter((p) => p.tags.some((t) => t.toLowerCase() === tagLower))
    }

    if (data?.search) {
      const q = data.search.toLowerCase()
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    return posts
  })

export const getBlogPostBySlug = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const posts: BlogPost[] = (blogsData as BlogPost[]) || DEMO_BLOGS
    const post = posts.find((p) => p.slug === slug || p.id === slug)

    if (!post) {
      return null
    }

    const relatedPosts = posts.filter((p) => p.slug !== slug).slice(0, 3)

    return {
      post,
      relatedPosts,
    }
  })

export const getFeaturedBlogPosts = createServerFn({ method: 'GET' }).handler(async () => {
  const posts: BlogPost[] = (blogsData as BlogPost[]) || DEMO_BLOGS
  return posts.filter((p) => p.featured)
})
