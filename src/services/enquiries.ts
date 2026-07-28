import type { ContactEnquiry } from '../types'
import {
  submitEnquiryServerFn,
  getEnquiriesServerFn,
  markEnquiryReadServerFn,
} from '../server/functions/enquiries'

export async function submitEnquiry(enquiry: Omit<ContactEnquiry, 'id' | 'created_at' | 'read'>): Promise<void> {
  return await submitEnquiryServerFn({ data: enquiry })
}

export async function getEnquiries(): Promise<ContactEnquiry[]> {
  return await getEnquiriesServerFn()
}

export async function markEnquiryRead(id: string): Promise<void> {
  return await markEnquiryReadServerFn({ data: id })
}
