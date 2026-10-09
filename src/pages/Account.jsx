import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Package, Gift, User, MapPin, RotateCcw, ChevronRight, Plus, Trash2, MailWarning, Loader2, KeyRound } from 'lucide-react'
import { useAuth, useOrders, useCart, useUI } from '../store'
import { byId } from '../data/menu'
import { ksh } from '../lib/format'

const tabs = [
  { id: 'orders', label: 'Orders', Icon: Package },
  { id: 'rewards', label: 'Crumbs', Icon: Gift },
  { id: 'addresses', label: 'Addresses', Icon: MapPin },
  { id: 'profile', label: 'Profile', Icon: User },
]

export default function Account() {
  const { user, logout, update, resendVerify, changePassword } = useAuth()
  const orders = useOrders((s) => s.orders).filter((o) => o.userId === user.id)
  const add = useCart((s) => s.add)
  const setOpen = useCart((s) => s.setOpen)
  const toast = useUI((s) => s.showToast)
  const nav = useNavigate()
  const [tab, setTab] = useState('orders')
  const [p, setP] = useState({ name: user.name, phone: user.phone })
  const [addr, setAddr] = useState({ label: '', line: '' })
  const [pw, setPw] = useState({ current: '', next: '' })
  const [busy, setBusy] = useState('')

  // Every change goes to the server first; the screen only updates if it was accepted.
  const save = async (key, patch, okMsg, after) => {
    setBusy(key)
    try { await update(patch); toast(okMsg); after?.() } catch (x) { toast(x.message) } finally { setBusy('') }
  }
  const resend = async () => {
    setBusy('verify')
    try { await resendVerify(); toast('Confirmation link sent — check your inbox') } catch (x) { toast(x.message) } finally { setBusy('') }
  }
  const submitPassword = async (e) => {
    e.preventDefault(); setBusy('pw')
    try { await changePassword(pw.current, pw.next); setPw({ current: '', next: '' }); toast('Password changed. Other devices were signed out.') }
    catch (x) { toast(x.message) } finally { setBusy('') }
  }

  const reorder = (o) => { o.lines.forEach((l) => byId[l.id] && add(l.id, l.sel, l.qty)); toast('Order added to your bag'); setOpen(true) }
  const nextReward = 500 - (user.points % 500)

  return (
    <div className="container-x pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-chili font-display text-2xl font-black text-white">{user.name[0]}</div>
          <div>
            <h1 className="font-display text-4xl font-black">Hey, {user.name.split(' ')[0]}</h1>
            <p className="text-bean/55">{user.email}</p>
          </div>
        </div>
        <button onClick={async () => { await logout(); nav('/') }} className="btn-ghost"><LogOut className="h-4 w-4" /> Sign out</button>
      </div>

      {!user.emailVerified && (
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-[1.5rem] bg-honey/20 p-5 ring-1 ring-honey/40">
          <MailWarning className="h-6 w-6 shrink-0 text-bean" />
          <p className="min-w-0 flex-1 font-semibold">Confirm your email — we sent a link to <span className="break-all">{user.email}</span>.</p>
          <button onClick={resend} disabled={busy === 'verify'} className="btn-dark px-5 py-2.5 text-sm">{busy === 'verify' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Resend link'}</button>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${tab === t.id ? 'bg-bean text-cream' : 'hover:bg-white'}`}>
              <t.Icon className="h-5 w-5" />{t.label}
            </button>
          ))}
        </nav>

        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-w-0">
          {tab === 'orders' && (
            orders.length === 0 ? (
              <div className="rounded-[2rem] bg-white p-10 text-center ring-1 ring-bean/5">
                <Package className="mx-auto h-12 w-12 text-bean/25" />
                <h2 className="mt-4 font-display text-2xl font-bold">No orders yet</h2>
                <Link to="/menu" className="btn-primary mt-6">Start an order</Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {orders.map((o) => (
                  <li key={o.id} className="flex flex-wrap items-center gap-4 rounded-[1.5rem] bg-white p-5 ring-1 ring-bean/5">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold">{o.id} <span className="ml-2 text-sm font-normal text-bean/50">{new Date(o.createdAt).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}</span></div>
                      <p className="truncate text-sm text-bean/60">{o.lines.map((l) => `${l.qty}× ${byId[l.id]?.name}`).join(', ')}</p>
                    </div>
                    <div className="font-extrabold">{ksh(o.totals.total)}</div>
                    <button onClick={() => reorder(o)} className="btn-ghost px-4 py-2 text-sm"><RotateCcw className="h-4 w-4" /> Reorder</button>
                    <Link to={`/order/${o.id}`} className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream" aria-label="View order"><ChevronRight /></Link>
                  </li>
                ))}
              </ul>
            )
          )}

          {tab === 'rewards' && (
            <div className="grain rounded-[2rem] bg-bean p-8 text-cream">
              <div className="text-sm font-bold uppercase tracking-wide text-cream/50">Your balance</div>
              <div className="font-display text-7xl font-black text-honey">{user.points}</div>
              <div className="text-cream/70">Crumbs</div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-honey" initial={{ width: 0 }} animate={{ width: `${((user.points % 500) / 500) * 100}%` }} transition={{ duration: 1 }} />
              </div>
              <p className="mt-3 text-cream/70">{nextReward} more Crumbs to your next free coffee. Redeem 500 Crumbs for KSh 350 off at checkout.</p>
            </div>
          )}

          {tab === 'addresses' && (
            <div className="space-y-3">
              {(user.addresses || []).map((a, i) => (
                <div key={i} className="flex items-center gap-4 rounded-[1.5rem] bg-white p-5 ring-1 ring-bean/5">
                  <MapPin className="h-5 w-5 text-chili" />
                  <div className="flex-1"><div className="font-bold">{a.label}</div><div className="text-sm text-bean/60">{a.line}</div></div>
                  <button onClick={() => save('addr', { addresses: user.addresses.filter((_, j) => j !== i) }, 'Address removed')} className="text-bean/30 hover:text-chili" aria-label="Delete address"><Trash2 className="h-5 w-5" /></button>
                </div>
              ))}
              <form onSubmit={(e) => { e.preventDefault(); save('addr', { addresses: [...(user.addresses || []), addr] }, 'Address saved', () => setAddr({ label: '', line: '' })) }}
                className="grid gap-3 rounded-[1.5rem] bg-white p-5 ring-1 ring-bean/5 sm:grid-cols-[160px_1fr_auto]">
                <input required maxLength={30} value={addr.label} onChange={(e) => setAddr({ ...addr, label: e.target.value })} className="field" placeholder="Home, Office…" />
                <input required maxLength={200} value={addr.line} onChange={(e) => setAddr({ ...addr, line: e.target.value })} className="field" placeholder="Apartment, street, area" />
                <button disabled={busy === 'addr'} className="btn-dark"><Plus className="h-4 w-4" /> Add</button>
              </form>
            </div>
          )}

          {tab === 'profile' && (
            <div className="max-w-lg space-y-6">
            <form onSubmit={(e) => { e.preventDefault(); save('profile', p, 'Profile updated') }} className="space-y-4 rounded-[2rem] bg-white p-7 ring-1 ring-bean/5">
              <div><label className="label">Full name</label><input required value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} className="field bg-cream" /></div>
              <div><label className="label">Phone (for M-PESA)</label><input required value={p.phone} onChange={(e) => setP({ ...p, phone: e.target.value })} className="field bg-cream" /></div>
              <div><label className="label">Email</label><input disabled value={user.email} className="field bg-cream opacity-60" /></div>
              <button disabled={busy === 'profile'} className="btn-primary">{busy === 'profile' ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save changes'}</button>
            </form>
            <form onSubmit={submitPassword} className="space-y-4 rounded-[2rem] bg-white p-7 ring-1 ring-bean/5">
              <h2 className="flex items-center gap-2 font-display text-2xl font-bold"><KeyRound className="h-5 w-5 text-chili" /> Change password</h2>
              <div><label className="label">Current password</label><input type="password" required autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className="field bg-cream" /></div>
              <div><label className="label">New password</label><input type="password" required minLength={8} maxLength={128} autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className="field bg-cream" placeholder="At least 8 characters" /></div>
              <button disabled={busy === 'pw'} className="btn-dark">{busy === 'pw' ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Update password'}</button>
            </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
