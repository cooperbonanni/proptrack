import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { signOut } from '../../lib/supabase'

const NAV = [
  { path: '/dashboard',           icon: '📊', label: 'Accounts'   },
  { path: '/dashboard/analytics', icon: '📈', label: 'Analytics'  },
  { path: '/dashboard/rules',     icon: '📋', label: 'Firm Rules' },
]

export default function AppLayout({ children }) {
  const { user, profile } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const active = (path) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path))

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Top nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #E2E8F0', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <svg width="30" height="30" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#1D4ED8"/><path d="M9 29L16 17L23 23L31 10" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="31" cy="10" r="3" fill="#93C5FD"/></svg>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>PropTrack</span>
          <span style={{ fontSize: 10, color: '#94A3B8', background: '#F1F5F9', borderRadius: 4, padding: '2px 6px' }}>v1.0</span>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {NAV.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: active(item.path) ? 700 : 500, color: active(item.path) ? '#1D4ED8' : '#6B7280', background: active(item.path) ? '#EFF6FF' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all .15s' }}>
              {item.icon}  {item.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate('/dashboard/profile')} style={{ fontSize: 13, color: '#64748B', background: 'none', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 500 }}>
            {profile?.full_name || user?.email?.split('@')[0] || 'Profile'}
          </button>
        </div>
      </div>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {children}
      </main>
    </div>
  )
}
