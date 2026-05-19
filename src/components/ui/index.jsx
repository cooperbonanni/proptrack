import { useState } from 'react'

// ── Button ────────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, type = 'button', variant = 'primary', size = 'md', loading = false, disabled = false, style = {} }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    border: 'none', borderRadius: 8, fontFamily: 'inherit', fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all .15s', whiteSpace: 'nowrap',
    padding: size === 'sm' ? '6px 14px' : size === 'lg' ? '13px 28px' : '10px 20px',
    fontSize: size === 'sm' ? 12 : size === 'lg' ? 15 : 13,
  }
  const variants = {
    primary:   { background: '#1D4ED8', color: '#fff' },
    secondary: { background: '#F1F5F9', color: '#374151', border: '1px solid #E2E8F0' },
    ghost:     { background: 'transparent', color: '#6B7280', border: '1px solid #E2E8F0' },
    danger:    { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' },
    success:   { background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' },
    dark:      { background: '#0F172A', color: '#fff' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} style={{ ...base, ...variants[variant], ...style }}>
      {loading ? '...' : children}
    </button>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, error, hint, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>}
      <input
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e) }}
        onBlur={e => { setFocused(false); props.onBlur?.(e) }}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13,
          border: `1px solid ${error ? '#FECACA' : focused ? '#1D4ED8' : '#E2E8F0'}`,
          background: '#F8FAFC', color: '#0F172A', outline: 'none', transition: 'border .15s',
          ...props.style
        }}
      />
      {error && <p style={{ fontSize: 11, color: '#DC2626', marginTop: 4 }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{hint}</p>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ label, error, options, ...props }) {
  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>}
      <select
        {...props}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13,
          border: `1px solid ${error ? '#FECACA' : '#E2E8F0'}`,
          background: '#F8FAFC', color: '#0F172A', outline: 'none', cursor: 'pointer',
          ...props.style
        }}
      >
        {options.map(o => typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
        )}
      </select>
      {error && <p style={{ fontSize: 11, color: '#DC2626', marginTop: 4 }}>{error}</p>}
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ title, subtitle, accent = '#1D4ED8', onClose, children, wide = false }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(15,23,42,.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: wide ? 640 : 480,
        maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.15)',
        borderTop: `4px solid ${accent}`,
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, color: '#94A3B8', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '20px 24px' }}>{children}</div>
      </div>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style = {}, hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={hover ? 'card-hover' : ''}
      style={{
        background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0',
        padding: '18px 20px', cursor: onClick ? 'pointer' : 'default', ...style
      }}
    >
      {children}
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
export function PBar({ pct, color, height = 6 }) {
  return (
    <div style={{ background: '#F1F5F9', borderRadius: 99, height, overflow: 'hidden' }}>
      <div style={{ height: '100%', borderRadius: 99, width: `${Math.min(100, Math.max(0, pct || 0))}%`, background: color, transition: 'width .5s ease' }} />
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ children, color = '#64748B', bg = '#F1F5F9', border }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 5,
      color, background: bg, border: border ? `1px solid ${border}` : undefined,
      display: 'inline-block', whiteSpace: 'nowrap',
    }}>{children}</span>
  )
}

// ── Logo ──────────────────────────────────────────────────────────────────────
export function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#1D4ED8"/>
      <path d="M9 29L16 17L23 23L31 10" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="31" cy="10" r="3" fill="#93C5FD"/>
      <line x1="9" y1="33" x2="31" y2="33" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
    </svg>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 24, color = '#1D4ED8' }) {
  return (
    <div style={{
      width: size, height: size, border: `2px solid #E2E8F0`,
      borderTop: `2px solid ${color}`, borderRadius: '50%',
      animation: 'spin .7s linear infinite',
    }}/>
  )
}
