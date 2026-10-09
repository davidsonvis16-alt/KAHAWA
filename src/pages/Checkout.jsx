import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bike, Store, Clock, Check, Loader2, Smartphone, CreditCard, Banknote, Lock, Gift, ShieldCheck } from 'lucide-react'
import SmartImage from '../components/SmartImage'
import { MpesaLogo, AirtelLogo, VisaLogo, MastercardLogo, PaypalLogo, ApplePayLogo, GooglePayLogo } from '../components/PaymentLogos'
import { useCart, useAuth, useOrders, cartTotals } from '../store'
import { byId, locations } from '../data/menu'
import { ksh, unitPrice, describeOptions } from '../lib/format'

// Payments are simulated in the browser. Wire these to Safaricom Daraja (STK Push),
// Airtel Money, and a card processor (Paystack / Flutterwave / Stripe) server-side to go live.
export const TEST_MODE = true

const REDEEM_PTS = 500
const REDEEM_VALUE = 350

const methods = [
  { id: 'mpesa', name: 'M-PESA', sub: 'Pay with an STK push to your phone', logos: [<MpesaLogo key="m" className="h-7" />] },
  { id: 'airtel', name: 'Airtel Money', sub: 'Approve on your Airtel line', logos: [<AirtelLogo key="a" className="h-7" />] },
  { id: 'card', name: 'Debit / credit card', sub: 'Visa and Mastercard', logos: [<VisaLogo key="v" className="h-5" />, <MastercardLogo key="mc" className="h-7" />] },
  { id: 'paypal', name: 'PayPal', sub: 'Pay with your PayPal balance or card', logos: [<PaypalLogo key="p" className="h-6" />] },
  { id: 'wallet', name: 'Apple Pay / Google Pay', sub: 'One-tap on supported devices', logos: [<ApplePayLogo key="ap" className="h-8" />, <GooglePayLogo key="g" className="h-8" />] },
  { id: 'cash', name: 'Cash', sub: 'Pay the rider or at the counter', logos: [<Banknote key="c" className="h-7 w-7 text-leaf" />] },
]

const brandOf = (n) => (/^4/.test(n) ? 'visa' : /^(5[1-5]|2[2-7])/.test(n) ? 'mastercard' : null)
const luhn = (n) => { let s = 0; [...n].reverse().forEach((d, i) => { let x = +d; if (i % 2) { x *= 2; if (x > 9) x -= 9 } s += x }); return n.length >= 13 && s % 10 === 0 }
const normPhone = (p) => p.replace(/\s|-/g, '').replace(/^\+?254/, '0')
const validPhone = (p) => /^0[17]\d{8}$/.test(normPhone(p))

function Section({ n, title, children }) {
  return (
    <section className="rounded-[2rem] bg-white p-6 ring-1 ring-bean/5 sm:p-8">
      <h2 className="flex items-center gap-3 font-display text-2xl font-black">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-bean text-base text-cream">{n}</span>{title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export default function Checkout() {
  const { lines, promo, clear } = useCart()
  const user = useAuth((s) => s.user)
  const place = useOrders((s) => s.place)
  const nav = useNavigate()

  const [mode, setMode] = useState('delivery')
  const [branch, setBranch] = useState(locations[0].id)
  const [when, setWhen] = useState('asap')
  const [slot, setSlot] = useState('')
  const [contact, setContact] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' })
  const [address, setAddress] = useState({ line: user?.addresses?.[0]?.line || '', notes: '' })
  const [method, setMethod] = useState('mpesa')
  const [payPhone, setPayPhone] = useState(user?.phone || '')
  const [card, setCard] = useState({ number: '', exp: '', cvc: '', name: '' })
  const [redeem, setRedeem] = useState(false)
  const [errors, setErrors] = useState({})
  const [stage, setStage] = useState(null) // null | 'processing' | 'push' | 'done'

  const t = cartTotals(lines, promo, mode)
  const canRedeem = user && user.points >= REDEEM_PTS
  const redeemOff = redeem && canRedeem ? Math.min(REDEEM_VALUE, t.total) : 0
  const total = t.total - redeemOff

  const slots = useMemo(() => {
    const out = []; const d = new Date(); d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15 + 45, 0, 0)
    for (let i = 0; i < 12; i++) { out.push(d.toLocaleTimeString('en-KE', { hour: 'numeric', minute: '2-digit' })); d.setMinutes(d.getMinutes() + 15) }
    return out
  }, [])

  const cardDigits = card.number.replace(/\D/g, '')
  const brand = brandOf(cardDigits)

  if (lines.length === 0 && stage !== 'done') {
    return (
      <div className="container-x py-28 text-center">
        <h1 className="font-display text-5xl font-black">Your bag is empty</h1>
        <p className="mt-2 text-bean/60">Add something delicious first.</p>
        <Link to="/menu" className="btn-primary mt-8">Go to the menu</Link>
      </div>
    )
  }

  const validate = () => {
    const e = {}
    if (!contact.name.trim()) e.name = 'Enter your name'
    if (!validPhone(contact.phone)) e.phone = 'Enter a valid Kenyan number'
    if (mode === 'delivery' && address.line.trim().length < 6) e.address = 'Enter your delivery address'
    if (when === 'later' && !slot) e.slot = 'Pick a time'
    if ((method === 'mpesa' || method === 'airtel') && !validPhone(payPhone)) e.payPhone = 'Enter the number to charge'
    if (method === 'card') {
      if (!luhn(cardDigits) || !brand) e.card = 'Enter a valid Visa or Mastercard number'
      const [mm, yy] = card.exp.split('/').map((x) => parseInt(x, 10))
      const now = new Date(); const exp = new Date(2000 + (yy || 0), mm || 0)
      if (!mm || mm > 12 || exp <= now) e.exp = 'Invalid expiry'
      if (!/^\d{3,4}$/.test(card.cvc)) e.cvc = 'Invalid CVC'
    }
    setErrors(e)
    if (Object.keys(e).length) document.getElementById('checkout-top')?.scrollIntoView({ behavior: 'smooth' })
    return !Object.keys(e).length
  }

  const submit = async () => {
    if (!validate()) return
    setStage(method === 'mpesa' || method === 'airtel' ? 'push' : 'processing')
    await new Promise((r) => setTimeout(r, method === 'mpesa' || method === 'airtel' ? 4200 : 2200))
    const receipt = method === 'mpesa' ? 'S' + Math.random().toString(36).slice(2, 11).toUpperCase() : null
    const order = place({
      userId: user?.id || null,
      lines: lines.map(({ id, sel, qty, discount, comboName }) => ({ id, sel, qty, discount: discount || 0, comboName })),
      totals: { ...t, redeemOff, total },
      mode, branch: mode === 'pickup' ? branch : null, when: when === 'asap' ? 'ASAP' : slot,
      contact, address: mode === 'delivery' ? address : null,
      payment: { method, receipt, last4: method === 'card' ? cardDigits.slice(-4) : null, brand: method === 'card' ? brand : null, phone: ['mpesa', 'airtel'].includes(method) ? normPhone(payPhone) : null },
    })
    // Crumbs are now owned by the server: the browser can't set its own balance.
    // They'll be awarded server-side once orders + payment confirmation live on the server too.
    setStage('done'); clear()
    nav(`/order/${order.id}`)
  }

  const err = (k) => errors[k] && <p className="mt-1.5 text-sm font-semibold text-chili-700">{errors[k]}</p>

  return (
    <div className="container-x pt-10" id="checkout-top">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-5xl font-black">Checkout</h1>
        {TEST_MODE && <span className="chip bg-honey/30 text-bean">Test mode · no real charges</span>}
      </div>
      {!user && <p className="mt-2 text-bean/60">Checking out as a guest. <Link to="/login?next=/checkout" className="font-bold text-chili">Sign in</Link> to earn Crumbs on this order.</p>}

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Section n="1" title="How do you want it?">
            <div className="grid grid-cols-2 gap-3">
              {[{ id: 'delivery', label: 'Delivery', sub: '25–35 min', Icon: Bike }, { id: 'pickup', label: 'Pickup', sub: 'Ready in ~15 min', Icon: Store }].map((o) => (
                <button key={o.id} onClick={() => setMode(o.id)} className={`relative flex items-center gap-3 rounded-2xl p-4 text-left ring-1 transition ${mode === o.id ? 'bg-cream ring-2 ring-chili' : 'ring-bean/10 hover:bg-cream/50'}`}>
                  <o.Icon className={`h-7 w-7 ${mode === o.id ? 'text-chili' : 'text-bean/50'}`} />
                  <div><div className="font-bold">{o.label}</div><div className="text-sm text-bean/55">{o.sub}</div></div>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {mode === 'delivery' ? (
                <motion.div key="d" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-5 space-y-4 overflow-hidden">
                  {user?.addresses?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {user.addresses.map((a, i) => (
                        <button key={i} onClick={() => setAddress({ ...address, line: a.line })} className={`chip py-1.5 normal-case tracking-normal text-sm ${address.line === a.line ? 'bg-bean text-cream' : 'bg-cream-200'}`}>{a.label}</button>
                      ))}
                    </div>
                  )}
                  <div><label className="label">Delivery address</label><input value={address.line} onChange={(e) => setAddress({ ...address, line: e.target.value })} className="field bg-cream" placeholder="Apartment, street and area — e.g. Riverside Dr, Westlands" autoComplete="street-address" />{err('address')}</div>
                  <div><label className="label">Notes for the rider <span className="font-normal text-bean/40">(optional)</span></label><input value={address.notes} onChange={(e) => setAddress({ ...address, notes: e.target.value })} className="field bg-cream" placeholder="Gate code, floor, landmark…" /></div>
                </motion.div>
              ) : (
                <motion.div key="p" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-5 overflow-hidden">
                  <label className="label">Pick up from</label>
                  <select value={branch} onChange={(e) => setBranch(e.target.value)} className="field bg-cream">
                    {locations.map((l) => <option key={l.id} value={l.id}>{l.name} — {l.addr}</option>)}
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Clock className="h-5 w-5 text-bean/50" />
              <button onClick={() => setWhen('asap')} className={`chip py-2 normal-case tracking-normal text-sm ${when === 'asap' ? 'bg-bean text-cream' : 'bg-cream-200'}`}>As soon as possible</button>
              <button onClick={() => setWhen('later')} className={`chip py-2 normal-case tracking-normal text-sm ${when === 'later' ? 'bg-bean text-cream' : 'bg-cream-200'}`}>Schedule for later</button>
              {when === 'later' && (
                <select value={slot} onChange={(e) => setSlot(e.target.value)} className="field w-auto bg-cream py-2"><option value="">Choose a time</option>{slots.map((s) => <option key={s}>{s}</option>)}</select>
              )}
            </div>
            {err('slot')}
          </Section>

          <Section n="2" title="Your details">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Full name</label><input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="field bg-cream" autoComplete="name" />{err('name')}</div>
              <div><label className="label">Phone</label><input type="tel" value={contact.phone} onChange={(e) => { setContact({ ...contact, phone: e.target.value }); if (!payPhone) setPayPhone(e.target.value) }} className="field bg-cream" placeholder="0712 345 678" autoComplete="tel" />{err('phone')}</div>
              <div className="sm:col-span-2"><label className="label">Email for your receipt <span className="font-normal text-bean/40">(optional)</span></label><input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="field bg-cream" autoComplete="email" /></div>
            </div>
          </Section>

          <Section n="3" title="Payment">
            <div className="space-y-3" role="radiogroup" aria-label="Payment method">
              {methods.map((m) => {
                const on = method === m.id
                return (
                  <div key={m.id} className={`overflow-hidden rounded-2xl ring-1 transition ${on ? 'bg-cream ring-2 ring-chili' : 'ring-bean/10'}`}>
                    <button role="radio" aria-checked={on} onClick={() => setMethod(m.id)} className="flex w-full items-center gap-4 p-4 text-left">
                      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${on ? 'bg-chili text-white' : 'ring-2 ring-bean/20'}`}>{on && <Check className="h-4 w-4" strokeWidth={3} />}</span>
                      <div className="min-w-0 flex-1"><div className="font-bold">{m.name}</div><div className="text-sm text-bean/55">{m.sub}</div></div>
                      <div className="flex shrink-0 items-center gap-2">{m.logos.map((l, i) => <span key={i} className="grid h-10 min-w-[3.5rem] place-items-center rounded-lg bg-white px-2 ring-1 ring-bean/10">{l}</span>)}</div>
                    </button>
                    <AnimatePresence>
                      {on && (m.id === 'mpesa' || m.id === 'airtel') && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-4 pb-4 sm:pl-14">
                            <label className="label">{m.name} number to charge</label>
                            <div className="relative"><Smartphone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-bean/40" /><input type="tel" value={payPhone} onChange={(e) => setPayPhone(e.target.value)} className="field pl-12" placeholder={m.id === 'mpesa' ? '0712 345 678' : '0733 345 678'} /></div>
                            {err('payPhone')}
                            <p className="mt-2 text-sm text-bean/55">You’ll get a prompt on your phone. Enter your PIN to pay {ksh(total)}.</p>
                          </div>
                        </motion.div>
                      )}
                      {on && m.id === 'card' && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2 sm:pl-14">
                            <div className="sm:col-span-2">
                              <label className="label">Card number</label>
                              <div className="relative">
                                <CreditCard className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-bean/40" />
                                <input inputMode="numeric" autoComplete="cc-number" value={card.number}
                                  onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ') })}
                                  className="field pl-12 pr-20 tracking-wider" placeholder="1234 5678 9012 3456" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2">{brand === 'visa' ? <VisaLogo className="h-5" /> : brand === 'mastercard' ? <MastercardLogo className="h-6" /> : null}</span>
                              </div>
                              {err('card')}
                            </div>
                            <div><label className="label">Expiry</label><input inputMode="numeric" autoComplete="cc-exp" value={card.exp} onChange={(e) => { const d = e.target.value.replace(/\D/g, '').slice(0, 4); setCard({ ...card, exp: d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d }) }} className="field" placeholder="MM/YY" />{err('exp')}</div>
                            <div><label className="label">CVC</label><input inputMode="numeric" autoComplete="cc-csc" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} className="field" placeholder="123" />{err('cvc')}</div>
                            <p className="flex items-center gap-1.5 text-sm text-bean/50 sm:col-span-2"><Lock className="h-4 w-4" /> Card details are encrypted and never stored on our servers.</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </Section>
        </div>

        {/* ---------------- SUMMARY ---------------- */}
        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-[2rem] bg-white p-6 ring-1 ring-bean/5">
            <h2 className="font-display text-2xl font-black">Order summary</h2>
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {lines.map((l) => { const item = byId[l.id]; if (!item) return null; return (
                <li key={l.key} className="flex gap-3">
                  <SmartImage src={item.img.replace('w=900', 'w=160')} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold leading-tight">{l.qty}× {item.name}</div>
                    <div className="truncate text-xs text-bean/50">{l.comboName || describeOptions(item, l.sel)}</div>
                  </div>
                  <div className="font-semibold">{ksh((unitPrice(item, l.sel) - (l.discount || 0)) * l.qty)}</div>
                </li>) })}
            </ul>
            {canRedeem && (
              <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl bg-honey/20 p-3.5">
                <input type="checkbox" checked={redeem} onChange={(e) => setRedeem(e.target.checked)} className="h-5 w-5 accent-chili" />
                <Gift className="h-5 w-5 text-chili" />
                <span className="text-sm font-semibold">Use {REDEEM_PTS} Crumbs for {ksh(REDEEM_VALUE)} off <span className="font-normal text-bean/50">({user.points} available)</span></span>
              </label>
            )}
            <dl className="mt-5 space-y-1.5 border-t border-bean/10 pt-4">
              <div className="flex justify-between"><dt className="text-bean/60">Subtotal</dt><dd>{ksh(t.subtotal)}</dd></div>
              {t.discount > 0 && <div className="flex justify-between text-leaf"><dt>{promo.code}</dt><dd>−{ksh(t.discount)}</dd></div>}
              {redeemOff > 0 && <div className="flex justify-between text-leaf"><dt>Crumbs</dt><dd>−{ksh(redeemOff)}</dd></div>}
              <div className="flex justify-between"><dt className="text-bean/60">{mode === 'delivery' ? 'Delivery' : 'Pickup'}</dt><dd>{t.delivery ? ksh(t.delivery) : 'Free'}</dd></div>
              <div className="flex justify-between pt-2 text-2xl font-black"><dt>Total</dt><dd>{ksh(total)}</dd></div>
              {user && <p className="text-right text-sm text-bean/50">You’ll earn {Math.floor(total / 10)} Crumbs</p>}
            </dl>
            <button onClick={submit} disabled={!!stage} className="btn-primary mt-5 w-full py-4 text-lg">
              {method === 'cash' ? 'Place order' : `Pay ${ksh(total)}`}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-bean/45"><ShieldCheck className="h-4 w-4" /> Secure checkout</p>
          </div>
        </aside>
      </div>

      {/* ---------------- PAYMENT OVERLAY ---------------- */}
      <AnimatePresence>
        {(stage === 'push' || stage === 'processing') && (
          <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-bean/70 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-sm rounded-[2rem] bg-cream p-8 text-center">
              {stage === 'push' ? (
                <>
                  <div className="mx-auto flex h-16 items-center justify-center">{method === 'mpesa' ? <MpesaLogo className="h-12" /> : <AirtelLogo className="h-12" />}</div>
                  <motion.div animate={{ rotate: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="mx-auto mt-6 grid h-20 w-14 place-items-center rounded-2xl border-4 border-bean">
                    <span className="h-1.5 w-6 rounded-full bg-chili" />
                  </motion.div>
                  <h3 className="mt-6 font-display text-2xl font-black">Check your phone</h3>
                  <p className="mt-2 text-bean/65">We’ve sent a payment request of <b>{ksh(total)}</b> to <b>{normPhone(payPhone)}</b>. Enter your PIN to confirm.</p>
                </>
              ) : (
                <>
                  <Loader2 className="mx-auto h-14 w-14 animate-spin text-chili" />
                  <h3 className="mt-6 font-display text-2xl font-black">Processing payment</h3>
                  <p className="mt-2 text-bean/65">Hang tight — this only takes a moment.</p>
                </>
              )}
              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-cream-200">
                <motion.div className="h-full bg-chili" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: stage === 'push' ? 4.2 : 2.2, ease: 'linear' }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
