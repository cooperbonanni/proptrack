import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Logo, Btn } from '../../components/ui'
import { PLANS } from '../../lib/firms'

export default function Pricing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Logo size={28}/>
          <span style={{ fontSize: 16, fontWeight: 800 }}>PropTrack</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {user ? (
            <Btn size="sm" onClick={() => navigate('/dashboard')}>Go to Dashboard</Btn>
          ) : (
            <>
              <Btn variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</Btn>
              <Btn size="sm" onClick={() => navigate('/signup')}>Get Started</Btn>
            </>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Simple, transparent pricing</h1>
          <p style={{ fontSize: 16, color: '#64748B' }}>7-day free trial on all plans. No credit card required.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 48 }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{
              background: '#fff', borderRadius: 16, padding: '28px 24px',
              border: `2px solid ${plan.id === 'pro' ? '#1D4ED8' : '#E2E8F0'}`,
              position: 'relative', boxShadow: plan.id === 'pro' ? '0 8px 32px rgba(29,78,216,.15)' : 'none',
            }}>
              {plan.id === 'pro' && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#1D4ED8', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 16px', borderRadius: 99, whiteSpace: 'nowrap' }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 2 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: '#0F172A' }}>${plan.price}</span>
                <span style={{ fontSize: 14, color: '#64748B', marginBottom: 6 }}>{plan.id === 'lifetime' ? ' one-time' : '/month'}</span>
              </div>
              <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 20 }}>
                {plan.id === 'lifetime' ? 'Pay once, use forever' : 'Billed monthly · Cancel anytime'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#374151' }}>
                    <span style={{ color: '#059669', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <Btn
                variant={plan.id === 'pro' ? 'primary' : 'secondary'}
                style={{ width: '100%' }}
                onClick={() => navigate(user ? '/dashboard' : `/signup?plan=${plan.id}`)}
              >
                {user ? 'Current Plan' : 'Start Free Trial'}
              </Btn>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '32px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Frequently asked questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              ["Is there really a free trial?", "Yes — 7 days free on all plans, no credit card required. Cancel anytime before the trial ends and you won't be charged."],
              ["What is PropTrack?", "PropTrack helps futures prop traders manage multiple funded accounts. Track P+L, payout eligibility, drawdown floors, winning days, and consistency rules across all your accounts."],
              ["Which firms are supported?", "Apex, Tradeify, MFFU, Alpha Futures, Lucid Trading, Take Profit Trader, and FundedNext — covering 22 account plans."],
              ["Does it sync with my prop firm?", "PropTrack is a manual tracker — you enter your P+L. This keeps it simple, private, and works with every firm. Auto-sync is on the roadmap."],
              ["Can I use it for copy trading?", "Yes — the Bulk Update feature lets you add the same P+L to all accounts at once. If some accounts got slightly different fills you can select specific ones."],
              ["What happens if I cancel?", "Your data stays accessible for 30 days after cancellation. You can export everything before it's removed."],
            ].map(([q, a]) => (
              <div key={q}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{q}</div>
                <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
