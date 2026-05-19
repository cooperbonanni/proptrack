import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Auth
export const signUp = (email, password, fullName) =>
  supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const resetPassword = (email) =>
  supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` })

export const updatePassword = (password) =>
  supabase.auth.updateUser({ password })

// Profile
export const getProfile = (userId) =>
  supabase.from('profiles').select('*').eq('id', userId).single()

export const updateProfile = (userId, updates) =>
  supabase.from('profiles').update({ ...updates }).eq('id', userId).select().single()

// Accounts
export const getAccounts = (userId) =>
  supabase.from('accounts').select('*').eq('user_id', userId).order('created_at')

export const upsertAccount = (account) =>
  supabase.from('accounts').upsert(account, { onConflict: 'id' }).select().single()

export const upsertManyAccounts = (accounts) =>
  supabase.from('accounts').upsert(accounts, { onConflict: 'id' }).select()

export const deleteAccount = (id) =>
  supabase.from('accounts').delete().eq('id', id)

// Daily log
export const getDailyLog = (userId) =>
  supabase.from('daily_log').select('*').eq('user_id', userId).order('date', { ascending: false })

export const upsertLogEntry = (entry) =>
  supabase.from('daily_log').upsert(entry, { onConflict: 'user_id,date' }).select().single()

export const deleteLogEntry = (userId, date) =>
  supabase.from('daily_log').delete().eq('user_id', userId).eq('date', date)
