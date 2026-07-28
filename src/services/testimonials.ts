import type { Testimonial } from '../types'
import {
  getTestimonialsServerFn,
  createTestimonialServerFn,
  updateTestimonialServerFn,
  deleteTestimonialServerFn,
} from '../server/functions/testimonials'

export async function getTestimonials(): Promise<Testimonial[]> {
  return await getTestimonialsServerFn()
}

export async function createTestimonial(t: Partial<Testimonial>): Promise<Testimonial> {
  return await createTestimonialServerFn({ data: t })
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
  return await updateTestimonialServerFn({ data: { id, updates } })
}

export async function deleteTestimonial(id: string): Promise<void> {
  return await deleteTestimonialServerFn({ data: id })
}
