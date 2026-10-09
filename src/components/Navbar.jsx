import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, User, Menu as MenuIcon, X, MapPin } from 'lucide-react'
import Logo from './Logo'
import { useCart, useAuth, cartTotals } from '../store'

const links = [
  { to: '/menu', label: 'Menu' },
  { to: '/deals', label: 'Deals' },
  { to: '/locations', label: 'Locations' },
  { to: '/rewards', label: 'Rewards' },
]

export default function Navbar() {
  const lines = useCart((s) => s.lines)
  const setOpen = useCart((s) => s.setOpen)
  const user = useAuth((s) => s.user)
  const { count } = cartTotals(lines, null)
  const [scrolled, setScrolled] = useState(false)
  const [mobile, setMobile] = useState(false)
  const loc = useLocation()

  useEffect(() => setMobile(false), [loc.pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <>
      <div className="bg-bean text-cream/90 text-[13px]">
        <div className="container-x flex h-9 items-center justify-between">
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Delivering across Nairobi & Mombasa · 6:30am – 11pm</span>
          <span className="hidden sm:inline">Use <b className="text-honey">KARIBU20</b> for 20% off your first order</span>
        </div>
      </div>
      <header className={`sticky top-0 z-40 transition-all ${scrolled ? 'bg-cream/90 backdrop-blur-md shadow-soft' : 'bg-cream'}`}>
        <div className="container-x flex h-[72px] items-center gap-6">
          <Logo />
          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) =>
                `relative rounded-full px-4 py-2 font-semibold transition ${isActive ? 'text-chili' : 'text-bean/80 hover:text-bean'}`}>
                {({ isActive }) => (<>
                  {l.label}
                  {isActive && <motion.span layoutId="nav-dot" className="absolute inset-x-4 -bottom-0.5 h-[3px] rounded-full bg-chili" />}
                </>)}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link to={user ? '/account' : '/login'} className="hidden items-center gap-2 rounded-full px-4 py-2 font-semibold text-bean/80 hover:bg-white sm:flex">
              <User className="h-5 w-5" />
              {user ? user.name.split(' ')[0] : 'Sign in'}
            </Link>
            <button onClick={() => setOpen(true)} className="relative flex items-center gap-2 rounded-full bg-chili py-2.5 pl-4 pr-5 font-bold text-white shadow-[0_4px_0_#A93421] transition active:translate-y-1 active:shadow-none" aria-label={`Open bag, ${count} items`}>
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden sm:inline">Bag</span>
              <AnimatePresence mode="popLayout">
                <motion.span key={count} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}
                  className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1.5 text-sm text-chili">{count}</motion.span>
              </AnimatePresence>
            </button>
            <button className="grid h-11 w-11 place-items-center rounded-full hover:bg-white md:hidden" onClick={() => setMobile(!mobile)} aria-label="Menu">
              {mobile ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobile && (
            <motion.nav initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-bean/10 bg-cream md:hidden">
              <div className="container-x flex flex-col py-3">
                {[...links, { to: user ? '/account' : '/login', label: user ? 'My account' : 'Sign in' }].map((l) => (
                  <NavLink key={l.to} to={l.to} className="rounded-xl px-3 py-3 font-display text-2xl font-bold">{l.label}</NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
