import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ChefHat, Bike, PackageCheck, Receipt, Store } from 'lucide-react'
import { useOrders } from '../store'
import { byId, locations } from '../data/menu'
import { ksh, unitPrice, describeOptions } from '../lib/format'

const payLabel = { mpesa: 'M-PESA', airtel: 'Airtel Money', card: 'Card', paypal: 'PayPal', wallet: 'Apple Pay / Google Pay', cash: 'Cash' }

export default function Order() {
  const { id } = useParams()
  const order = useOrders((s) => s.orders.find((o) => o.id === id))
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])

  if (!order) return (
    <div className="container-x py-28 text-center">
      <h1 className="font-display text-4xl font-black">Order not found</h1>
      <Link to="/menu" className="btn-primary mt-6">Back to menu</Link>
    </div>
  )

  const pickup = order.mode === 'pickup'
  const steps = pickup
    ? [{ label: 'Order received', Icon: Receipt, at: 0 }, { label: 'Being prepared', Icon: ChefHat, at: 20 }, { label: 'Ready for pickup', Icon: Store, at: 90 }]
    : [{ label: 'Order received', Icon: Receipt, at: 0 }, { label: 'Being prepared', Icon: ChefHat, at: 20 }, { label: 'On the way', Icon: Bike, at: 90 }, { label: 'Delivered', Icon: PackageCheck, at: 180 }]
  // demo timeline in seconds since order was placed
  const elapsed = (now - order.createdAt) / 1000
  const current = steps.reduce((acc, s, i) => (elapsed >= s.at ? i : acc), 0)
  const branch = locations.find((l) => l.id === order.branch)

  return (
    <div className="container-x pt-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grain overflow-hidden rounded-[2.5rem] bg-bean p-8 text-cream sm:p-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="grid h-16 w-16 place-items-center rounded-full bg-leaf">
          <Check className="h-9 w-9" strokeWidth={3} />
        </motion.div>
        <h1 className="mt-5 font-display text-4xl font-black sm:text-6xl">Asante, {order.contact.name.split(' ')[0]}!</h1>
        <p className="mt-2 text-lg text-cream/70">Order <b className="text-honey">{order.id}</b> · {pickup ? `Pickup at ${branch?.name}` : 'Delivery'} · {order.when}</p>

        <ol className="relative mt-10 grid gap-6" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          <div className="absolute left-0 right-0 top-6 mx-[calc(50%/var(--n))] h-1 rounded-full bg-white/15" style={{ '--n': steps.length }}>
            <motion.div className="h-full rounded-full bg-honey" animate={{ width: `${(current / (steps.length - 1)) * 100}%` }} transition={{ duration: 0.8 }} />
          </div>
          {steps.map((s, i) => (
            <li key={s.label} className="relative flex flex-col items-center text-center">
              <motion.div animate={{ scale: i === current ? [1, 1.12, 1] : 1 }} transition={{ repeat: i === current ? Infinity : 0, duration: 1.6 }}
                className={`grid h-12 w-12 place-items-center rounded-full transition ${i <= current ? 'bg-honey text-bean' : 'bg-bean-700 text-cream/40'}`}>
                <s.Icon className="h-6 w-6" />
              </motion.div>
              <span className={`mt-3 text-sm font-semibold ${i <= current ? 'text-cream' : 'text-cream/40'}`}>{s.label}</span>
            </li>
          ))}
        </ol>
      </motion.div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-[2rem] bg-white p-6 ring-1 ring-bean/5 sm:p-8">
          <h2 className="font-display text-2xl font-black">Your order</h2>
          <ul className="mt-4 divide-y divide-bean/10">
            {order.lines.map((l, i) => { const item = byId[l.id]; if (!item) return null; return (
              <li key={i} className="flex justify-between gap-4 py-3">
                <div><div className="font-semibold">{l.qty}× {item.name}</div><div className="text-sm text-bean/50">{l.comboName || describeOptions(item, l.sel)}</div></div>
                <div className="font-semibold">{ksh((unitPrice(item, l.sel) - l.discount) * l.qty)}</div>
              </li>) })}
          </ul>
          {order.address && <p className="mt-4 rounded-2xl bg-cream p-4 text-sm"><b>Delivering to:</b> {order.address.line}{order.address.notes && ` — ${order.address.notes}`}</p>}
        </div>
        <div className="h-max rounded-[2rem] bg-white p-6 ring-1 ring-bean/5">
          <h2 className="font-display text-2xl font-black">Receipt</h2>
          <dl className="mt-4 space-y-1.5">
            <div className="flex justify-between"><dt className="text-bean/60">Subtotal</dt><dd>{ksh(order.totals.subtotal)}</dd></div>
            {order.totals.discount > 0 && <div className="flex justify-between text-leaf"><dt>Promo</dt><dd>−{ksh(order.totals.discount)}</dd></div>}
            {order.totals.redeemOff > 0 && <div className="flex justify-between text-leaf"><dt>Crumbs</dt><dd>−{ksh(order.totals.redeemOff)}</dd></div>}
            <div className="flex justify-between"><dt className="text-bean/60">{pickup ? 'Pickup' : 'Delivery'}</dt><dd>{order.totals.delivery ? ksh(order.totals.delivery) : 'Free'}</dd></div>
            <div className="flex justify-between border-t border-bean/10 pt-2 text-xl font-black"><dt>Total</dt><dd>{ksh(order.totals.total)}</dd></div>
          </dl>
          <div className="mt-4 rounded-2xl bg-cream p-4 text-sm">
            <div className="font-bold">Paid with {payLabel[order.payment.method]}{order.payment.last4 && ` •••• ${order.payment.last4}`}</div>
            {order.payment.receipt && <div className="text-bean/60">M-PESA ref: {order.payment.receipt}</div>}
            {order.payment.method === 'cash' && <div className="text-bean/60">Pay {ksh(order.totals.total)} on {pickup ? 'collection' : 'delivery'}</div>}
          </div>
          <Link to="/menu" className="btn-ghost mt-5 w-full">Order something else</Link>
        </div>
      </div>
    </div>
  )
}
