import { createServerFn } from '@tanstack/react-start'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import type { CustomerLead } from '../../types'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

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

// 1. Submit Enquiry / Message
export const submitEnquiryServerFn = createServerFn({
  method: 'POST',
})
  .validator((enquiry: { name: string; phone?: string; email?: string; message: string }) => enquiry)
  .handler(async ({ data: enquiry }) => {
    if (isSupabaseConfigured()) {
      const newLead: CustomerLead = {
        id: crypto.randomUUID(),
        customer_name: enquiry.name,
        phone: enquiry.phone || null,
        email: enquiry.email || null,
        source: 'Website Contact',
        message: enquiry.message,
        status: 'New',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('customer_leads').insert(newLead)
      if (error) {
        console.error('Supabase customer_leads insert error:', error.message)
        throw new Error(error.message)
      }
      return
    }

    // Local JSON fallback
    const leads = await readJson<CustomerLead[]>('customer_leads.json', [])
    const newLead: CustomerLead = {
      id: crypto.randomUUID(),
      customer_name: enquiry.name,
      phone: enquiry.phone || '',
      email: enquiry.email || '',
      source: 'Website Contact',
      message: enquiry.message,
      status: 'New',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    leads.unshift(newLead)
    await writeJson('customer_leads.json', leads)
  })

// 2. Get Enquiries / Messages
export const getEnquiriesServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('customer_leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase customer_leads select error:', error.message)
      throw new Error(error.message)
    }
    return (data as CustomerLead[]) || []
  }

  return await readJson<CustomerLead[]>('customer_leads.json', [])
})

// 3. Mark Enquiry Read / Status Update
export const markEnquiryReadServerFn = createServerFn({
  method: 'POST',
})
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('customer_leads')
        .update({ status: 'Contacted', updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw new Error(error.message)
      return
    }

    const leads = await readJson<CustomerLead[]>('customer_leads.json', [])
    const idx = leads.findIndex((e) => e.id === id)
    if (idx !== -1) {
      leads[idx].status = 'Contacted'
      leads[idx].updated_at = new Date().toISOString()
      await writeJson('customer_leads.json', leads)
    }
  })
