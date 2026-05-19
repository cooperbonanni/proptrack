import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { signUp } from '../lib/supabase'
import { PLANS } from '../lib/firms'

export default function Signup() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [step, setStep]         = useState(1)
  const [plan, setPlan]         = useState(params.get('plan') || 'pro')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setError(''); setLoading(true)
    const { error } = await signUp(email, password, name)
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: step === 1 ? 860 : 440 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#1D4ED8"/><path d="M9 29L16 17L23 23L31 10" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="31" cy="10" r="3" fill="#93C5FD"/></svg>
          <span style={{ fontSize: 22, fontWeight: 800 }}>PropTrack</span>
        </div>

        {step === 1 && (
          <div className="fade-in">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Choose your plan</h1>
              <p style={{ fontSize: 14, color: '#64748B' }}>7-day free trial. No credit card required.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
              {PLANS.map(p => (
                <div key={p.id} onClick={() => setPlan(p.id)} style={{ background: plan === p.id ? '#EFF6FF' : '#fff', borderRadius: 14, padding: '24px 20px', cursor: 'pointer', border: `2px solid ${plan === p.id ? '#1D4ED8' : '#E2E8F0'}`, position: 'relative', transition: 'all .15s' }}>
                  {p.id === 'pro' && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#1D4ED8', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 99, whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
                  <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#1D4ED8' }}>${p.price}<span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{p.id === 'lifetime' ? ' once' : '/mo'}</span></div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 16 }}>{p.id === 'lifetime' ? 'Pay once, use forever' : '7-day free trial'}</div>
                  {p.features.map(f => <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#374151', marginBottom: 8 }}><span style={{ color: '#059669' }}>✓</span>{f}</div>)}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => setStep(2)} style={{ padding: '13px 32px', background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                Continue with {PLANS.find(p => p.id === plan)?.name} →
              </button>
              <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 12 }}>Already have an account? <Link to="/login" style={{ color: '#1D4ED8', fontWeight: 600 }}>Sign in</Link></p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in" style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 4px 24px rgba(0,0,0,.07)', border: '1px solid #E2E8F0' }}>
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '8px 14px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#1D4ED8', fontWeight: 600 }}>{PLANS.find(p => p.id === plan)?.name} plan selected</span>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', fontSize: 12, color: '#1D4ED8', cursor: 'pointer', fontWeight: 600 }}>Change</button>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Create your account</h1>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>7-day free trial. No card required.</p>
            {error && <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, color: '#DC2626', marginBottom: 16 }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Full Name"><input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required autoFocus style={iSx} /></Field>
              <Field label="Email"><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required style={iSx} /></Field>
              <Field label="Password"><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required style={iSx} /></Field>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 4 }}>{loading ? 'Creating account...' : 'Start Free Trial'}</button>
              <p style={{ textAlign: 'center', fontSize: 11, color: '#94A3B8' }}>By signing up you agree to our Terms of Service.</p>
            </form>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#64748B', marginTop: 16 }}>Already have an account? <Link to="/login" style={{ color: '#1D4ED8', fontWeight: 600 }}>Sign in</Link></p>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>{children}</div>
}
const iSx = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 13, outline: 'none' }
