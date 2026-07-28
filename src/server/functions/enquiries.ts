import { createServerFn } from '@tanstack/react-start'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import type { ContactEnquiry } from '../../types'
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

// 1. Submit Enquiry
export const submitEnquiryServerFn = createServerFn({
  method: 'POST',
})
  .validator((enquiry: Omit<ContactEnquiry, 'id' | 'created_at' | 'read'>) => enquiry)
  .handler(async ({ data: enquiry }) => {
    if (!isSupabaseConfigured()) {
      const enquiries = await readJson<ContactEnquiry[]>('enquiries.json', [])
      const newEnq: ContactEnquiry = {
        id: Math.random().toString(36).substring(2, 11),
        created_at: new Date().toISOString(),
        read: false,
        ...enquiry,
      }
      enquiries.unshift(newEnq)
      await writeJson('enquiries.json', enquiries)
      console.log('Demo mode persistent submission: ', newEnq)
      return
    }

    const { error } = await supabase
      .from('contact_enquiries')
      .insert({
        id: crypto.randomUUID(),
        ...enquiry,
      })
    if (error) throw new Error(error.message)
  })

// 2. Get Enquiries
export const getEnquiriesServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  if (!isSupabaseConfigured()) {
    return await readJson<ContactEnquiry[]>('enquiries.json', [])
  }

  const { data, error } = await supabase
    .from('contact_enquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as ContactEnquiry[]) || []
})

// 3. Mark Enquiry Read
export const markEnquiryReadServerFn = createServerFn({
  method: 'POST',
})
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (!isSupabaseConfigured()) {
      const enquiries = await readJson<ContactEnquiry[]>('enquiries.json', [])
      const idx = enquiries.findIndex((e) => e.id === id)
      if (idx !== -1) {
        enquiries[idx].read = true
        await writeJson('enquiries.json', enquiries)
      }
      return
    }

    const { error } = await supabase
      .from('contact_enquiries')
      .update({ read: true })
      .eq('id', id)

    if (error) throw new Error(error.message)
  })
