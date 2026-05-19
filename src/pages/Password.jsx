import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { resetPassword, updatePassword } from '../lib/supabase'

const iSx = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 13, outline: 'none' }
const Logo = () => <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
  <svg width="36" height="36" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#1D4ED8"/><path d="M9 29L16 17L23 23L31 10" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="31" cy="10" r="3" fill="#93C5FD"/></svg>
  <span style={{ fontSize: 22, fontWeight: 800 }}>PropTrack</span>
</div>

export function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handle(e) {
    e.preventDefault(); setLoading(true)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <Logo />
        <div style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 4px 24px rgba(0,0,0,.07)', border: '1px solid #E2E8F0' }}>
          {sent ? <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Check your email</h2>
              <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>We sent a reset link to <strong>{email}</strong></p>
              <Link to="/login"><button style={{ width: '100%', padding: '11px', background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Back to login</button></Link>
            </div>
          </> : <>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Reset password</h1>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>We'll send a reset link to your email.</p>
            {error && <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, color: '#DC2626', marginBottom: 16 }}>{error}</div>}
            <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required autoFocus style={iSx} />
              <button type="submit" disabled={loading} style={{ padding: '11px', background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
            </form>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#64748B', marginTop: 16 }}><Link to="/login" style={{ color: '#1D4ED8', fontWeight: 600 }}>Back to login</Link></p>
          </>}
        </div>
      </div>
    </div>
  )
}

export function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [done, setDone]         = useState(false)

  async function handle(e) {
    e.preventDefault()
    if (password.length < 8) { setError('Must be at least 8 characters'); return }
    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) { setError(error.message); return }
    setDone(true)
    setTimeout(() => navigate('/dashboard'), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <Logo />
        <div style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 4px 24px rgba(0,0,0,.07)', border: '1px solid #E2E8F0' }}>
          {done ? <div style={{ textAlign: 'center' }}><div style={{ fontSize: 48, marginBottom: 12 }}>✅</div><h2 style={{ fontSize: 20, fontWeight: 700 }}>Password updated!</h2><p style={{ fontSize: 13, color: '#64748B', marginTop: 8 }}>Redirecting you in...</p></div> : <>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Set new password</h1>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>Choose a strong password.</p>
            {error && <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, color: '#DC2626', marginBottom: 16 }}>{error}</div>}
            <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required autoFocus style={iSx} />
              <button type="submit" disabled={loading} style={{ padding: '11px', background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>{loading ? 'Updating...' : 'Update Password'}</button>
            </form>
          </>}
        </div>
      </div>
    </div>
  )
}
