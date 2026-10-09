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
    <div className="container-x pt-10">
      <h1 className="font-display text-5xl font-black sm:text-6xl">Deals & combos</h1>
      <p className="mt-2 text-lg text-bean/60">Bundle up and save. Prices drop automatically in your bag.</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {combos.map((c, i) => (
          <motion.article key={c.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-bean/5">
            <div className="relative aspect-[16/11] overflow-hidden bg-cream-200">
              <SmartImage src={c.img} alt={c.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute left-4 top-4 chip bg-chili text-white text-sm"><Tag className="h-3.5 w-3.5" /> Save {ksh(c.save)}</span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h2 className="font-display text-3xl font-black">{c.name}</h2>
              <p className="mt-1 text-bean/60">{c.note}</p>
              <ul className="mt-4 space-y-1.5 text-[15px]">
                {c.items.map((id) => <li key={id} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-chili" />{byId[id].name}</li>)}
              </ul>
              <div className="mt-auto flex items-center justify-between pt-6">
                <div>
                  <div className="text-2xl font-black">{ksh(full(c) - c.save)}</div>
                  <div className="text-sm text-bean/40 line-through">{ksh(full(c))}</div>
                </div>
                <button onClick={() => addCombo(c)} className="btn-primary">Add combo</button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-5 rounded-[2rem] bg-honey p-7">
          <Percent className="h-12 w-12 shrink-0" />
          <div><h3 className="font-display text-2xl font-black">KARIBU20</h3><p className="text-bean/75">20% off your first order. Enter it in your bag.</p></div>
        </div>
        <div className="flex items-center gap-5 rounded-[2rem] bg-bean p-7 text-cream">
          <Clock className="h-12 w-12 shrink-0 text-honey" />
          <div><h3 className="font-display text-2xl font-black">Happy hour, 3–5pm</h3><p className="text-cream/70">Use CHAI10 for 10% off any order, every weekday.</p></div>
        </div>
      </div>
    </div>
  )
}
