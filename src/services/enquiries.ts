import type { CustomerLead } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  submitEnquiryServerFn,
  getEnquiriesServerFn,
  markEnquiryReadServerFn,
} from '../server/functions/enquiries'

export async function submitEnquiry(enquiry: {
  name: string
  phone?: string
  email?: string
  message: string
}): Promise<void> {
  const newLead: CustomerLead = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `lead-${Date.now()}`,
    customer_name: enquiry.name,
    phone: enquiry.phone || null,
    email: enquiry.email || null,
    source: 'Website Contact',
    message: enquiry.message,
    status: 'New',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Update localStorage immediately if client-side
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('ssf_customer_leads')
      const leads: CustomerLead[] = saved ? JSON.parse(saved) : []
      leads.unshift(newLead)
      localStorage.setItem('ssf_customer_leads', JSON.stringify(leads))
    } catch (e) {}
  }

  // Save to Supabase client if available
  if (typeof window !== 'undefined' && isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('customer_leads').insert(newLead)
      if (!error) return
    } catch (e) {
      console.warn('Client Supabase insert fallback to server function', e)
    }
  }

  // Save via Server Function
  return await submitEnquiryServerFn({ data: enquiry })
}

export async function getEnquiries(): Promise<any[]> {
  if (typeof window !== 'undefined' && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('customer_leads')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) return data
    } catch (e) {}
  }
  return await getEnquiriesServerFn()
}

export async function markEnquiryRead(id: string): Promise<void> {
  if (typeof window !== 'undefined' && isSupabaseConfigured()) {
    try {
      await supabase
        .from('customer_leads')
        .update({ status: 'Contacted', updated_at: new Date().toISOString() })
        .eq('id', id)
    } catch (e) {}
  }
  return await markEnquiryReadServerFn({ data: id })
}
