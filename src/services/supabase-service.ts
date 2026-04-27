import { supabase } from '../lib/supabase'

// ─── STUDIOS ───────────────────────────────────────

/** Fetch all approved, active studios with optional filters */
export const getStudios = async (filters: {
  city?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  search?: string
} = {}) => {
  try {
    let query = supabase
      .from('studios')
      .select('*, profiles(full_name, avatar_url)')
      .eq('is_approved', true)
      .eq('is_active', true)

    if (filters.city && filters.city !== 'all') query = query.ilike('city', filters.city)
    if (filters.type) query = query.eq('type', filters.type)
    if (filters.minPrice) query = query.gte('price_per_hour', filters.minPrice)
    if (filters.maxPrice) query = query.lte('price_per_hour', filters.maxPrice)
    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,city.ilike.%${filters.search}%,type.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/** Fetch a single studio by ID with owner profile */
export const getStudioById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('studios')
      .select('*, profiles(full_name, avatar_url, phone)')
      .eq('id', id)
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/** Fetch all studios belonging to a specific owner (including unapproved) */
export const getOwnerStudios = async (ownerId: string) => {
  try {
    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/** Fetch 4 latest approved studios for the homepage trending section */
export const getTrendingStudios = async () => {
  try {
    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .eq('is_approved', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(4)
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/** Create a new studio listing */
export const createStudio = async (studioData: Record<string, unknown>) => {
  try {
    const { data, error } = await supabase
      .from('studios')
      .insert([studioData])
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/** Update an existing studio */
export const updateStudio = async (id: string, updates: Record<string, unknown>) => {
  try {
    const { data, error } = await supabase
      .from('studios')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// ─── BOOKINGS ──────────────────────────────────────

/** Create a new booking */
export const createBooking = async (bookingData: Record<string, unknown>) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/** Get all bookings for a creator with studio details */
export const getCreatorBookings = async (creatorId: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, studios(name, photos, city, type)')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/** Get all bookings for a studio owner with creator info */
export const getOwnerBookings = async (ownerId: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, studios(name, city), profiles!bookings_creator_id_fkey(full_name, email)')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/** Update a booking's status (confirm / cancel / complete) */
export const updateBookingStatus = async (bookingId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// ─── IMAGE UPLOADS ─────────────────────────────────

/** Upload studio photos to Supabase Storage (studio-media bucket) */
export const uploadStudioPhotos = async (files: File[], studioOwnerId: string) => {
  try {
    const uploadedUrls: string[] = []
    for (const file of files) {
      const fileName = `${studioOwnerId}/${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('studio-media')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (error) throw error
      const { data: urlData } = supabase.storage
        .from('studio-media')
        .getPublicUrl(data.path)
      uploadedUrls.push(urlData.publicUrl)
    }
    return { urls: uploadedUrls, error: null }
  } catch (error) {
    return { urls: [] as string[], error }
  }
}

/** Upload government ID to a private bucket */
export const uploadGovernmentId = async (file: File, userId: string) => {
  try {
    const fileName = `${userId}/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('government-ids')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })
    if (error) throw error
    return { path: data.path, error: null }
  } catch (error) {
    return { path: null, error }
  }
}

// ─── PROFESSIONALS ─────────────────────────────────

/** Get all available professionals, optionally filtered by type */
export const getProfessionals = async (type?: string) => {
  try {
    let query = supabase
      .from('professionals')
      .select('*, profiles(full_name, avatar_url, location)')
      .eq('is_available', true)
    if (type) query = query.eq('type', type)
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/** Fetch 4 trending professionals by type for homepage */
export const getTrendingProfessionals = async (type: string) => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*, profiles(full_name, avatar_url, location)')
      .eq('is_available', true)
      .eq('type', type)
      .order('created_at', { ascending: false })
      .limit(4)
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/** Register a new professional listing */
export const createProfessional = async (profData: Record<string, unknown>) => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .insert([profData])
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// ─── EQUIPMENT ─────────────────────────────────────

/** Get all available equipment */
export const getEquipment = async () => {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('*, profiles(full_name)')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/** Register new equipment for rental */
export const createEquipment = async (equipData: Record<string, unknown>) => {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .insert([equipData])
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// ─── STATS ─────────────────────────────────────────

/** Get total earnings for a studio owner from confirmed/completed bookings */
export const getOwnerEarnings = async (ownerId: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('total_price, status')
      .eq('owner_id', ownerId)
      .in('status', ['confirmed', 'completed'])
    if (error) throw error
    const total = data?.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0) || 0
    return { total, error: null }
  } catch (error) {
    return { total: 0, error }
  }
}
