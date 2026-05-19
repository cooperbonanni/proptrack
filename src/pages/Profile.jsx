import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { updateProfile, signOut, updatePassword } from '../lib/supabase'
import { PLANS } from '../lib/firms'

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [name, setName]       = useState(profile?.full_name || '')
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [newPw, setNewPw]     = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [error, setError]     = useState('')

  const currentPlan = PLANS.find(p => p.id === (profile?.plan || 'pro')) || PLANS[1]

  async function saveName(e) {
    e.preventDefault(); setSaving(true)
    await updateProfile(user.id, { full_name: name })
    await refreshProfile()
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function savePassword(e) {
    e.preventDefault()
    if (newPw.length < 8) { setError('Must be at least 8 characters'); return }
    setError(''); setPwSaving(true)
    const { error } = await updatePassword(newPw)
    setPwSaving(false)
    if (error) { setError(error.message); return }
    setNewPw(''); setPwSaved(true)
    setTimeout(() => setPwSaved(false), 2500)
  }

  async function handleSignOut() {
    await signOut(); navigate('/login')
  }

  const card = (children, style = {}) => (
    <div style={{ background: '#fff', borderRadius: 12, padding: '22px 24px', border: '1px solid #E2E8F0', marginBottom: 14, ...style }}>
      {children}
    </div>
  )

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Account Settings</h1>
      <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>Manage your profile and subscription.</p>

      {card(<>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 4 }}>CURRENT PLAN</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1D4ED8' }}>{currentPlan.name}</div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{currentPlan.id === 'lifetime' ? 'Lifetime access' : `$${currentPlan.price}/month`}</div>
          </div>
          <button onClick={() => navigate('/pricing')} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Upgrade</button>
        </div>
        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {currentPlan.features.map(f => (
            <div key={f} style={{ fontSize: 12, color: '#374151', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '3px 10px' }}>✓ {f}</div>
          ))}
        </div>
      </>, { borderTop: '3px solid #1D4ED8' })}

      {card(<>
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Profile</h2>
        <form onSubmit={saveName} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Full Name"><input value={name} onChange={e => setName(e.target.value)} style={iSx} /></Field>
          <Field label="Email"><input value={user?.email || ''} disabled style={{ ...iSx, opacity: 0.6 }} /></Field>
          <button type="submit" disabled={saving} style={{ ...btnSx, width: 'auto', alignSelf: 'flex-start', padding: '8px 20px', fontSize: 13 }}>{saved ? '✓ Saved' : saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </>)}

      {card(<>
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Change Password</h2>
        {error && <div style={{ padding: '8px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, fontSize: 13, color: '#DC2626', marginBottom: 12 }}>{error}</div>}
        <form onSubmit={savePassword} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="New Password"><input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters" style={iSx} /></Field>
          <button type="submit" disabled={pwSaving} style={{ ...btnSx, width: 'auto', alignSelf: 'flex-start', padding: '8px 20px', fontSize: 13 }}>{pwSaved ? '✓ Updated' : pwSaving ? 'Updating...' : 'Update Password'}</button>
        </form>
      </>)}

      {card(<>
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Account Info</h2>
        <div style={{ fontSize: 13, color: '#64748B', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Email</span><span style={{ fontWeight: 500 }}>{user?.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Member since</span>
            <span>{new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </>)}

      <button onClick={handleSignOut} style={{ width: '100%', padding: '11px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
        Sign Out
      </button>
    </div>
  )
}

function Field({ label, children }) {
  return <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>{children}</div>
}
const iSx = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 13, outline: 'none' }
const btnSx = { padding: '11px', background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }
