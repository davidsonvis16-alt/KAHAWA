import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { ShoppingBag, User, Menu as MenuIcon, X, Bike, Store } from 'lucide-react'
import { Medallion } from './Logo'
import { useCart, useAuth, cartTotals } from '../store'
import { ksh } from '../lib/format'

const links = [
  { to: '/menu', label: 'Menu' },
  { to: '/deals', label: 'Deals' },
  { to: '/rewards', label: 'Rewards' },
  { to: '/locations', label: 'Locations' },
]

/** Delivery / pickup switch. Flat, two segments, no sliding pill. */
export function ModeToggle({ className = '', dark = false }) {
  const mode = useCart((s) => s.mode)
  const setMode = useCart((s) => s.setMode)
  return (
    <div className={`inline-grid grid-cols-2 border-2 ${dark ? 'border-white' : 'border-bean'} ${className}`} role="radiogroup" aria-label="Delivery or pickup">
      {[{ id: 'delivery', label: 'Delivery', Icon: Bike }, { id: 'pickup', label: 'Pickup', Icon: Store }].map((o) => {
        const on = mode === o.id
        return (
          <button key={o.id} role="radio" aria-checked={on} onClick={() => setMode(o.id)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-extrabold uppercase tracking-wide ${on ? (dark ? 'bg-white text-bean' : 'bg-bean text-white') : (dark ? 'text-white hover:bg-white/10' : 'text-bean hover:bg-bean/5')}`}>
            <o.Icon className="h-4 w-4" />{o.label}
          </button>
        )
      })}
    </div>
  )
}

export default function Navbar() {
  const lines = useCart((s) => s.lines)
  const setOpen = useCart((s) => s.setOpen)
  const mode = useCart((s) => s.mode)
  const user = useAuth((s) => s.user)
  const { count, total } = cartTotals(lines, null, mode)
  const [mobile, setMobile] = useState(false)
  const loc = useLocation()
  const hideBar = loc.pathname === '/checkout'

  // Close the mobile menu whenever the route changes.
  const [lastPath, setLastPath] = useState(loc.pathname)
  if (lastPath !== loc.pathname) { setLastPath(loc.pathname); setMobile(false) }

  return (
    <>
      <div className="bg-honey text-bean">
        <div className="container-x flex h-9 items-center justify-center text-center text-[13px] font-extrabold uppercase tracking-wide">
          <span className="sm:hidden">KARIBU20 = 20% off your first order</span>
          <span className="hidden sm:inline">New here? Use code KARIBU20 for 20% off your first order</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-bean text-white">
        <div className="container-x flex h-[72px] items-center gap-8">
          {/* medallion hangs off the bottom edge of the bar */}
          <Link to="/" className="relative z-10 shrink-0 self-start pt-2 lg:pt-3" aria-label="Kahawa & Crumb home">
            <Medallion className="h-14 w-14 lg:h-[88px] lg:w-[88px]" />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) =>
                `border-b-[3px] py-1 text-[15px] font-extrabold uppercase tracking-wider ${isActive ? 'border-chili text-white' : 'border-transparent text-white/80 hover:text-white'}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <Link to={user ? '/account' : '/login'} className="hidden items-center gap-2 text-[15px] font-extrabold uppercase tracking-wider text-white/80 hover:text-white sm:flex">
              <User className="h-5 w-5" />
              {user ? user.name.split(' ')[0] : 'Sign in'}
            </Link>
            <button onClick={() => setOpen(true)} className="relative grid h-11 w-11 place-items-center hover:text-honey" aria-label={`Open bag, ${count} items`}>
              <ShoppingBag className="h-6 w-6" />
              {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center bg-honey px-1 text-xs font-extrabold text-bean">{count}</span>}
            </button>
            <Link to="/menu" className="bg-chili px-5 py-3 text-[15px] font-extrabold uppercase tracking-wider text-white hover:bg-chili-600 sm:px-7">Order now</Link>
            <button className="grid h-11 w-11 place-items-center lg:hidden" onClick={() => setMobile(!mobile)} aria-label="Menu" aria-expanded={mobile}>
              {mobile ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {mobile && (
          <nav className="border-t border-white/15 bg-bean lg:hidden">
            <div className="container-x flex flex-col py-2">
              {[...links, { to: user ? '/account' : '/login', label: user ? 'My account' : 'Sign in' }].map((l) => (
                <NavLink key={l.to} to={l.to} className={({ isActive }) => `border-b border-white/10 py-3 font-display text-4xl ${isActive ? 'text-honey' : 'text-white'}`}>{l.label}</NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* sticky "view bag" bar on small screens, once something is in the bag */}
      {count > 0 && !hideBar && (
        <button onClick={() => setOpen(true)}
          className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between bg-chili px-5 py-4 font-extrabold uppercase tracking-wide text-white md:hidden">
          <span className="grid h-7 min-w-7 place-items-center bg-white px-1.5 text-sm text-bean">{count}</span>
          <span>View bag</span>
          <span>{ksh(total)}</span>
        </button>
      )}
    </>
  )
}
