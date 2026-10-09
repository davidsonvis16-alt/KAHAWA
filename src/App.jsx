import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Deals from './pages/Deals'
import Locations from './pages/Locations'
import Rewards from './pages/Rewards'
import Checkout from './pages/Checkout'
import Order from './pages/Order'
import { Login, Signup, ForgotPassword, ResetPassword, VerifyEmail } from './pages/Auth'
import Account from './pages/Account'
import NotFound from './pages/NotFound'
import { useAuth } from './store'

// This only decides what to SHOW. The real protection is on the server: every
// /api call checks the session cookie, so faking `user` here gets you an empty page.
function Private({ children }) {
  const { user, ready } = useAuth()
  const { pathname } = useLocation()
  if (!ready) return <div className="grid min-h-[50vh] place-items-center"><Loader2 className="h-8 w-8 animate-spin text-chili" /></div>
  return user ? children : <Navigate to={`/login?next=${encodeURIComponent(pathname)}`} replace />
}

export default function App() {
  const init = useAuth((s) => s.init)
  useEffect(() => { init() }, [init])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="deals" element={<Deals />} />
          <Route path="locations" element={<Locations />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order/:id" element={<Order />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="account" element={<Private><Account /></Private>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
