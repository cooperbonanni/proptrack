import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#1D4ED8"/><path d="M9 29L16 17L23 23L31 10" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="31" cy="10" r="3" fill="#93C5FD"/></svg>
          <span style={{ fontSize: 22, fontWeight: 800 }}>PropTrack</span>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 4px 24px rgba(0,0,0,.07)', border: '1px solid #E2E8F0' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>Sign in to your PropTrack account</p>
          {error && <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, color: '#DC2626', marginBottom: 16 }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Email"><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required autoFocus style={iSx} /></Field>
            <Field label="Password"><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={iSx} /></Field>
            <div style={{ textAlign: 'right', marginTop: -6 }}>
              <Link to="/forgot-password" style={{ fontSize: 12, color: '#1D4ED8', fontWeight: 500 }}>Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} style={btnSx}>{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#64748B', marginTop: 20 }}>
            No account? <Link to="/signup" style={{ color: '#1D4ED8', fontWeight: 600 }}>Start free trial</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>{children}</div>
}
const iSx = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 13, outline: 'none' }
const btnSx = { width: '100%', padding: '12px', background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 4 }
