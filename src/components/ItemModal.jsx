import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Check } from 'lucide-react'
import SmartImage from './SmartImage'
import { tagStyle } from './MenuCard'
import { useCart, useUI } from '../store'
import { ksh, unitPrice, defaultSelection } from '../lib/format'

export default function ItemModal() {
  const item = useUI((s) => s.item)
  const close = useUI((s) => s.closeItem)
  const toast = useUI((s) => s.showToast)
  const add = useCart((s) => s.add)
  const [sel, setSel] = useState({})
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (!item) return
    setSel(defaultSelection(item)); setQty(1)
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [item, close])

  const price = useMemo(() => (item ? unitPrice(item, sel) : 0), [item, sel])

  const toggle = (g, c) => setSel((s) => {
    if (g.type === 'single') return { ...s, [g.id]: c.id }
    const cur = new Set(s[g.id] || [])
    if (cur.has(c.id)) cur.delete(c.id)
    else cur.add(c.id)
    return { ...s, [g.id]: [...cur] }
  })

  const submit = () => {
    add(item.id, sel, qty)
    toast(`${qty} × ${item.name} added to your bag`)
    close()
  }

  return (
    <AnimatePresence>
      {item && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-bean/60 backdrop-blur-sm" onClick={close} />
          <motion.div
            role="dialog" aria-modal="true" aria-label={item.name}
            initial={{ y: 80, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl md:flex-row"
          >
            <button onClick={close} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white shadow-lift" aria-label="Close"><X className="h-5 w-5" /></button>
            <div className="relative h-56 shrink-0 bg-cream-200 sm:h-72 md:h-auto md:w-[45%]">
              <SmartImage src={item.img.replace('w=900', 'w=1000')} alt={item.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                <div className="flex flex-wrap gap-1.5">
                  {(item.tags || []).map((t) => { const s = tagStyle[t]; return s && <span key={t} className={`chip ${s.cls}`}><s.Icon className="h-3 w-3" />{s.label}</span> })}
                </div>
                <h2 className="mt-3 font-display text-5xl">{item.name}</h2>
                <p className="mt-2 leading-relaxed text-bean/65">{item.desc}</p>
                <p className="mt-3 font-mono text-xs uppercase tracking-wider text-bean/45">{item.kcal} kcal · from {ksh(item.price)}</p>

                {(item.options || []).map((g) => (
                  <fieldset key={g.id} className="mt-7 border-t border-bean/10 pt-5">
                    <legend className="mb-2.5 flex w-full items-center justify-between font-bold">
                      {g.name}
                      <span className="rounded-md bg-cream-100 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-bean/55">{g.required ? 'Required' : 'Optional'}</span>
                    </legend>
                    <div className="space-y-2">
                      {g.choices.map((c) => {
                        const on = [].concat(sel[g.id] || []).includes(c.id)
                        return (
                          <button key={c.id} type="button" onClick={() => toggle(g, c)}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ring-1 transition ${on ? 'bg-cream-100 ring-2 ring-bean' : 'bg-white ring-bean/10 hover:ring-bean/30'}`}>
                            <span className={`grid h-5 w-5 shrink-0 place-items-center ${g.type === 'single' ? 'rounded-full' : 'rounded-md'} ${on ? 'bg-bean text-honey' : 'ring-2 ring-bean/20'}`}>
                              {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                            </span>
                            <span className="flex-1 font-medium">{c.name}</span>
                            {c.price > 0 && <span className="text-sm font-semibold text-bean/60">+{ksh(c.price)}</span>}
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
              <div className="flex items-center gap-3 border-t border-bean/10 bg-white p-4 sm:p-6">
                <div className="flex items-center rounded-xl bg-cream-100">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-12 w-12 place-items-center" aria-label="Less"><Minus className="h-4 w-4" /></button>
                  <span className="w-6 text-center text-lg font-bold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="grid h-12 w-12 place-items-center" aria-label="More"><Plus className="h-4 w-4" /></button>
                </div>
                <button onClick={submit} className="btn-primary flex-1 justify-between py-3.5 text-lg">
                  <span>Add to bag</span><span className="tabular-nums">{ksh(price * qty)}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
