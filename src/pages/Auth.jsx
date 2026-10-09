import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Gift, MailCheck, CheckCircle2, XCircle } from 'lucide-react'
import SmartImage from '../components/SmartImage'
import { useAuth, useUI } from '../store'
import { heroImages } from '../data/menu'

function Shell({ title, sub, children, img }) {
  return (
    <div className="container-x grid gap-10 py-10 lg:grid-cols-2 lg:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md self-center">
        <h1 className="font-display text-5xl font-black">{title}</h1>
        <p className="mt-2 text-lg text-bean/60">{sub}</p>
        <div className="mt-8">{children}</div>
      </motion.div>
      <div className="relative hidden overflow-hidden rounded-[2.5rem] bg-cream-200 lg:block">
        <SmartImage src={img} alt="" className="h-full min-h-[560px] w-full object-cover" />
        <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 rounded-3xl bg-white/95 p-5 backdrop-blur">
          <Gift className="h-10 w-10 shrink-0 text-chili" />
          <p className="font-semibold">New members get <b className="text-chili">50 Crumbs</b> and 20% off their first order with KARIBU20.</p>
        </div>
      </div>
    </div>
  )
}

// Only follow ?next= to pages on THIS site. "?next=//evil.com" would otherwise
// bounce a freshly signed-in customer to a look-alike site (an "open redirect").
function safeNext(next) {
  return next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : '/account'
}

function ErrorNote({ children }) {
  return children ? <p className="rounded-xl bg-chili/10 px-4 py-3 text-sm font-semibold text-chili-700" role="alert">{children}</p> : null
}

function Password({ value, onChange, autoComplete }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} required minLength={8} value={value} onChange={onChange} autoComplete={autoComplete} className="field pr-12" placeholder="At least 8 characters" />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-bean/40" aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  )
}

export function Login() {
  const { login, user, ready } = useAuth()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const [f, setF] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    try { await login(f); nav(next, { replace: true }) } catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  if (ready && user && !busy) return <Navigate to={next} replace />
  return (
    <Shell title="Welcome back" sub="Sign in to reorder favourites and spend your Crumbs." img={heroImages.interior}>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label">Email</label><input type="email" required autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className="field" placeholder="you@example.com" /></div>
        <div>
          <div className="flex items-baseline justify-between"><label className="label">Password</label><Link to="/forgot-password" className="text-sm font-semibold text-chili">Forgot password?</Link></div>
          <Password value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" />
        </div>
        <ErrorNote>{err}</ErrorNote>
        <button disabled={busy} className="btn-primary w-full py-4 text-lg">{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign in'}</button>
      </form>
      <p className="mt-6 text-center text-bean/60">New here? <Link to="/signup" className="font-bold text-chili">Create an account</Link></p>
    </Shell>
  )
}

export function Signup() {
  const signup = useAuth((s) => s.signup)
  const nav = useNavigate()
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    try { await signup(f); nav('/account', { replace: true }) } catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  return (
    <Shell title="Join the club" sub="One account for ordering, tracking and rewards." img={heroImages.interior2}>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label">Full name</label><input required autoComplete="name" value={f.name} onChange={set('name')} className="field" placeholder="Wanjiku Kamau" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Email</label><input type="email" required autoComplete="email" value={f.email} onChange={set('email')} className="field" placeholder="you@example.com" /></div>
          <div><label className="label">Phone</label><input type="tel" required pattern="(\+?254|0)\s?[17](\s?\d){8}" title="A Kenyan number, e.g. 0712 345 678" autoComplete="tel" value={f.phone} onChange={set('phone')} className="field" placeholder="0712 345 678" /></div>
        </div>
        <div><label className="label">Password</label><Password value={f.password} onChange={set('password')} autoComplete="new-password" /></div>
        <ErrorNote>{err}</ErrorNote>
        <button disabled={busy} className="btn-primary w-full py-4 text-lg">{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create account'}</button>
        <p className="text-center text-xs text-bean/45">By joining you agree to our Terms and Privacy Policy.</p>
      </form>
      <p className="mt-6 text-center text-bean/60">Already a member? <Link to="/login" className="font-bold text-chili">Sign in</Link></p>
    </Shell>
  )
}

export function ForgotPassword() {
  const forgot = useAuth((s) => s.forgot)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    try { await forgot(email); setSent(true) } catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  return (
    <Shell title="Forgot password?" sub="Enter your email and we’ll send you a link to choose a new one." img={heroImages.interior}>
      {sent ? (
        <div className="rounded-[1.5rem] bg-white p-6 ring-1 ring-bean/5">
          <MailCheck className="h-10 w-10 text-chili" />
          <h2 className="mt-3 font-display text-2xl font-bold">Check your inbox</h2>
          <p className="mt-1 text-bean/60">If <b className="text-bean">{email}</b> has an account, a reset link is on its way. It works once and expires in 30 minutes.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label">Email</label><input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="you@example.com" /></div>
          <ErrorNote>{err}</ErrorNote>
          <button disabled={busy} className="btn-primary w-full py-4 text-lg">{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send reset link'}</button>
        </form>
      )}
      <p className="mt-6 text-center text-bean/60">Remembered it? <Link to="/login" className="font-bold text-chili">Sign in</Link></p>
    </Shell>
  )
}

// Reads the one-time token from the email link, then removes it from the address bar
// so it doesn't sit in browser history or get shared by accident.
function useLinkToken() {
  const [params] = useSearchParams()
  const [token] = useState(() => params.get('token') || '')
  useEffect(() => { if (params.get('token')) window.history.replaceState(null, '', window.location.pathname) }, [params])
  return token
}

export function ResetPassword() {
  const reset = useAuth((s) => s.reset)
  const toast = useUI((s) => s.showToast)
  const nav = useNavigate()
  const token = useLinkToken()
  const [f, setF] = useState({ password: '', confirm: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setErr('')
    if (f.password !== f.confirm) return setErr('Those passwords don’t match.')
    setBusy(true)
    try { await reset(token, f.password); toast('Password changed — you’re signed in'); nav('/account', { replace: true }) } catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  return (
    <Shell title="New password" sub="Choose a new password. You’ll be signed out everywhere else." img={heroImages.interior2}>
      {!token ? (
        <><ErrorNote>This page needs the link from your reset email.</ErrorNote><Link to="/forgot-password" className="btn-primary mt-6 w-full py-4">Request a new link</Link></>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label">New password</label><Password value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="new-password" /></div>
          <div><label className="label">Type it again</label><Password value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} autoComplete="new-password" /></div>
          <ErrorNote>{err}</ErrorNote>
          <button disabled={busy} className="btn-primary w-full py-4 text-lg">{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save new password'}</button>
          {err && <p className="text-center text-sm"><Link to="/forgot-password" className="font-bold text-chili">Request a new link</Link></p>}
        </form>
      )}
    </Shell>
  )
}

export function VerifyEmail() {
  const verify = useAuth((s) => s.verify)
  const token = useLinkToken()
  const [state, setState] = useState(token ? 'busy' : 'error')
  const [err, setErr] = useState(token ? '' : 'This page needs the link from your confirmation email.')
  const sent = useRef(false)
  useEffect(() => {
    if (!token || sent.current) return
    sent.current = true // links are single-use: don't let React's dev double-render burn it twice
    verify(token).then(() => setState('done'), (x) => { setErr(x.message); setState('error') })
  }, [token, verify])
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center ring-1 ring-bean/5">
        {state === 'busy' && <><Loader2 className="mx-auto h-10 w-10 animate-spin text-chili" /><h1 className="mt-4 font-display text-3xl font-black">Confirming…</h1></>}
        {state === 'done' && <><CheckCircle2 className="mx-auto h-12 w-12 text-chili" /><h1 className="mt-4 font-display text-3xl font-black">Email confirmed</h1><p className="mt-2 text-bean/60">Thanks — your account is all set.</p><Link to="/account" className="btn-primary mt-6">Go to my account</Link></>}
        {state === 'error' && <><XCircle className="mx-auto h-12 w-12 text-chili" /><h1 className="mt-4 font-display text-3xl font-black">Link didn’t work</h1><p className="mt-2 text-bean/60">{err} You can send a fresh one from your account page.</p><Link to="/account" className="btn-primary mt-6">My account</Link></>}
      </motion.div>
    </div>
  )
}
