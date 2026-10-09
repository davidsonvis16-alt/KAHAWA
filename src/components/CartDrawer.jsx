import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { X, Minus, Plus, Trash2, ShoppingBag, Bike, Tag } from 'lucide-react'
import SmartImage from './SmartImage'
import { useCart, cartTotals, FREE_DELIVERY_OVER } from '../store'
import { byId } from '../data/menu'
import { ksh, unitPrice, describeOptions } from '../lib/format'

export default function CartDrawer() {
  const { lines, open, setOpen, setQty, remove, promo, applyPromo, removePromo } = useCart()
  const t = cartTotals(lines, promo)
  const nav = useNavigate()
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const toFree = Math.max(0, FREE_DELIVERY_OVER - (t.subtotal - t.discount))

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const k = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [open, setOpen])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div className="absolute inset-0 bg-bean/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl" aria-label="Your bag">
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="font-display text-2xl font-black">Your bag <span className="text-bean/40">({t.count})</span></h2>
              <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white" aria-label="Close bag"><X /></button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-cream-200"><ShoppingBag className="h-10 w-10 text-bean/40" /></div>
                <h3 className="mt-5 font-display text-2xl font-bold">Your bag is empty</h3>
                <p className="mt-1 text-bean/60">A cappuccino and a croissant would look great in here.</p>
                <button className="btn-primary mt-6" onClick={() => { setOpen(false); nav('/menu') }}>Browse the menu</button>
              </div>
            ) : (
              <>
                <div className="mx-6 rounded-2xl bg-white p-3.5 ring-1 ring-bean/5">
                  <div className="flex items-center gap-2 text-sm font-semibold"><Bike className="h-4 w-4 text-chili" />
                    {toFree > 0 ? <>Add {ksh(toFree)} more for <b>free delivery</b></> : <>You’ve unlocked <b>free delivery</b></>}
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream-200">
                    <motion.div className="h-full rounded-full bg-chili" animate={{ width: `${Math.min(100, ((t.subtotal - t.discount) / FREE_DELIVERY_OVER) * 100)}%` }} />
                  </div>
                </div>
                <ul className="mt-3 flex-1 space-y-3 overflow-y-auto px-6 py-2">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => { const item = byId[l.id]; if (!item) return null; const opts = describeOptions(item, l.sel)
                      return (
                        <motion.li key={l.key} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30, height: 0 }}
                          className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-bean/5">
                          <SmartImage src={item.img.replace('w=900', 'w=200')} alt={item.name} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold leading-tight">{item.name}</h4>
                              <button onClick={() => remove(l.key)} className="text-bean/30 hover:text-chili" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                            </div>
                            {l.comboName && <p className="text-xs font-bold text-chili">{l.comboName}</p>}
                            {opts && <p className="mt-0.5 line-clamp-2 text-xs text-bean/50">{opts}</p>}
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center rounded-full ring-1 ring-bean/10">
                                <button onClick={() => setQty(l.key, l.qty - 1)} className="grid h-8 w-8 place-items-center" aria-label="Less"><Minus className="h-3.5 w-3.5" /></button>
                                <span className="w-5 text-center text-sm font-bold">{l.qty}</span>
                                <button onClick={() => setQty(l.key, l.qty + 1)} className="grid h-8 w-8 place-items-center" aria-label="More"><Plus className="h-3.5 w-3.5" /></button>
                              </div>
                              <span className="font-bold">{ksh((unitPrice(item, l.sel) - (l.discount || 0)) * l.qty)}</span>
                            </div>
                          </div>
                        </motion.li>
                      ) })}
                  </AnimatePresence>
                </ul>
                <div className="space-y-3 border-t border-bean/10 bg-white/60 px-6 py-5">
                  {promo ? (
                    <div className="flex items-center justify-between rounded-xl bg-leaf/10 px-3 py-2 text-sm font-semibold text-leaf">
                      <span className="flex items-center gap-2"><Tag className="h-4 w-4" />{promo.code} · {promo.label}</span>
                      <button onClick={removePromo} className="underline">Remove</button>
                    </div>
                  ) : (
                    <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setErr(applyPromo(code) ? '' : 'That code isn’t valid.') }}>
                      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" className="field py-2.5" />
                      <button className="btn-dark px-5 py-2.5">Apply</button>
                    </form>
                  )}
                  {err && <p className="text-sm text-chili">{err}</p>}
                  <dl className="space-y-1 text-[15px]">
                    <div className="flex justify-between"><dt className="text-bean/60">Subtotal</dt><dd>{ksh(t.subtotal)}</dd></div>
                    {t.discount > 0 && <div className="flex justify-between text-leaf"><dt>Discount</dt><dd>−{ksh(t.discount)}</dd></div>}
                    <div className="flex justify-between"><dt className="text-bean/60">Delivery</dt><dd>{t.delivery ? ksh(t.delivery) : 'Free'}</dd></div>
                    <div className="flex justify-between pt-1 text-xl font-black"><dt>Total</dt><dd>{ksh(t.total)}</dd></div>
                  </dl>
                  <button className="btn-primary w-full py-4 text-lg" onClick={() => { setOpen(false); nav('/checkout') }}>Checkout</button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
