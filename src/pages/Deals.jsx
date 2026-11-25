import { motion } from 'framer-motion'
import { Tag, Clock, Percent } from 'lucide-react'
import SmartImage from '../components/SmartImage'
import { combos, byId } from '../data/menu'
import { useCart, useUI } from '../store'
import { ksh, defaultSelection, unitPrice } from '../lib/format'

const full = (c) => c.items.reduce((s, id) => s + unitPrice(byId[id], defaultSelection(byId[id])), 0)

export default function Deals() {
  const add = useCart((s) => s.add)
  const toast = useUI((s) => s.showToast)
  const addCombo = (c) => {
    c.items.forEach((id, i) => add(id, defaultSelection(byId[id]), 1, { comboId: c.id, comboName: c.name, discount: i === 0 ? c.save : 0 }))
    toast(`${c.name} added to your bag`)
  }
  return (
    <div className="container-x pt-8">
      <div className="border-b border-bean/10 pb-6">
        <div className="eyebrow">Bundle up · prices drop in your bag</div>
        <h1 className="mt-2 font-display text-6xl sm:text-8xl">Deals <span className="text-chili">&amp;</span> combos</h1>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {combos.map((c, i) => (
          <motion.article key={c.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card group flex flex-col overflow-hidden">
            <div className="relative aspect-[16/11] overflow-hidden bg-cream-200">
              <SmartImage src={c.img} alt={c.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute left-3 top-3 chip bg-honey py-1.5 text-xs text-bean"><Tag className="h-3.5 w-3.5" /> Save {ksh(c.save)}</span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h2 className="font-display text-4xl">{c.name}</h2>
              <p className="mt-1 text-bean/60">{c.note}</p>
              <ul className="mt-4 space-y-1.5 text-[15px]">
                {c.items.map((id) => <li key={id} className="flex items-center gap-2"><span className="font-mono text-xs text-bean/40">+</span>{byId[id].name}</li>)}
              </ul>
              <div className="mt-auto flex items-center justify-between pt-6">
                <div>
                  <div className="text-2xl font-bold tabular-nums">{ksh(full(c) - c.save)}</div>
                  <div className="text-sm text-bean/40 line-through">{ksh(full(c))}</div>
                </div>
                <button onClick={() => addCombo(c)} className="btn-primary">Add combo</button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-5 rounded-2xl bg-honey p-7">
          <Percent className="h-12 w-12 shrink-0" />
          <div><h3 className="font-display text-4xl">KARIBU20</h3><p className="text-bean/75">20% off your first order. Enter it in your bag.</p></div>
        </div>
        <div className="flex items-center gap-5 rounded-2xl bg-bean p-7 text-white">
          <Clock className="h-12 w-12 shrink-0 text-honey" />
          <div><h3 className="font-display text-4xl">Happy hour, 3–5pm</h3><p className="text-white/65">Use CHAI10 for 10% off any order, every weekday.</p></div>
        </div>
      </div>
    </div>
  )
}
