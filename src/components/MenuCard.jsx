import { motion } from 'framer-motion'
import { Plus, Flame, Leaf, Sparkles, Star } from 'lucide-react'
import SmartImage from './SmartImage'
import { ksh } from '../lib/format'

export const tagStyle = {
  popular: { label: 'Bestseller', cls: 'bg-honey text-bean', Icon: Star },
  new: { label: 'New', cls: 'bg-chili text-white', Icon: Sparkles },
  spicy: { label: 'Spicy', cls: 'bg-chili-700 text-white', Icon: Flame },
  veg: { label: 'Veg', cls: 'bg-leaf text-white', Icon: Leaf },
}

export default function MenuCard({ item, onOpen, i = 0, row = false }) {
  if (row) return <MenuRow item={item} onOpen={onOpen} i={i} />
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-soft ring-1 ring-bean/5 transition-shadow hover:shadow-lift"
    >
      <button onClick={() => onOpen(item)} className="relative aspect-[4/3] overflow-hidden bg-cream-100 text-left" aria-label={`View ${item.name}`}>
        <SmartImage src={item.img} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {(item.tags || []).map((t) => { const s = tagStyle[t]; return s && (
            <span key={t} className={`chip ${s.cls}`}><s.Icon className="h-3 w-3" />{s.label}</span>) })}
        </div>
      </button>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold leading-tight">{item.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-[15px] leading-snug text-bean/60">{item.desc}</p>
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <div className="text-xl font-extrabold">{ksh(item.price)}</div>
            <div className="text-xs text-bean/45">{item.kcal} kcal</div>
          </div>
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => onOpen(item)}
            className="grid h-12 w-12 place-items-center rounded-full bg-chili text-white shadow-[0_4px_0_#A93421] transition hover:bg-chili-600"
            aria-label={`Add ${item.name}`}>
            <Plus className="h-6 w-6" strokeWidth={2.75} />
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}

function MenuRow({ item, onOpen, i }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.25), ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-center gap-4 rounded-3xl bg-white p-3 shadow-soft ring-1 ring-bean/5 transition-shadow hover:shadow-lift sm:gap-5"
    >
      <button onClick={() => onOpen(item)} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-cream-100 sm:h-28 sm:w-28" aria-label={`View ${item.name}`}>
        <SmartImage src={item.img} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
      </button>
      <button onClick={() => onOpen(item)} className="min-w-0 flex-1 self-stretch py-1 text-left">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="font-display text-lg font-bold leading-tight">{item.name}</h3>
          {(item.tags || []).map((t) => { const s = tagStyle[t]; return s && (
            <span key={t} className={`chip py-0.5 text-[10px] ${s.cls}`}><s.Icon className="h-3 w-3" />{s.label}</span>) })}
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-bean/60">{item.desc}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-extrabold">{ksh(item.price)}</span>
          <span className="text-xs text-bean/45">{item.kcal} kcal</span>
        </div>
      </button>
      <motion.button whileTap={{ scale: 0.85 }} onClick={() => onOpen(item)}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-chili text-white shadow-[0_4px_0_#A93421] transition hover:bg-chili-600"
        aria-label={`Add ${item.name}`}>
        <Plus className="h-5 w-5" strokeWidth={2.75} />
      </motion.button>
    </motion.article>
  )
}
