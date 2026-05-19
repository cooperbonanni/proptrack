import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { RequireAuth, RedirectIfAuth } from './components/auth/Guards'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { ForgotPassword, ResetPassword } from './pages/Password'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import FirmRules from './pages/FirmRules'
import Profile from './pages/Profile'
import './styles/global.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"           element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
          <Route path="/signup"          element={<RedirectIfAuth><Signup /></RedirectIfAuth>} />
          <Route path="/forgot-password" element={<RedirectIfAuth><ForgotPassword /></RedirectIfAuth>} />
          <Route path="/reset-password"  element={<ResetPassword />} />

          <Route path="/dashboard" element={<RequireAuth><AppLayout><Dashboard /></AppLayout></RequireAuth>} />
          <Route path="/dashboard/analytics" element={<RequireAuth><AppLayout><Analytics /></AppLayout></RequireAuth>} />
          <Route path="/dashboard/rules"     element={<RequireAuth><AppLayout><FirmRules /></AppLayout></RequireAuth>} />
          <Route path="/dashboard/profile"   element={<RequireAuth><AppLayout><Profile /></AppLayout></RequireAuth>} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
