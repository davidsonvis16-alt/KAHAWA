import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Navigation } from 'lucide-react'
import SmartImage from '../components/SmartImage'
import { locations, heroImages } from '../data/menu'

export default function Locations() {
  return (
    <div className="container-x pt-8">
      <div className="relative overflow-hidden rounded-3xl bg-bean">
        <SmartImage src={heroImages.interior} alt="Inside our Westlands café" className="h-80 w-full object-cover opacity-50 sm:h-[28rem]" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-12">
          <div className="eyebrow text-white/60">{locations.length} cafés · Nairobi &amp; Mombasa</div>
          <h1 className="mt-3 font-display text-6xl sm:text-9xl">Come sit <span className="text-honey">with us.</span></h1>
          <p className="mt-3 max-w-lg text-lg text-white/75">Five cafés, free Wi-Fi, plug points at every table, and the best seat is always by the window.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((l, i) => (
          <motion.div key={l.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="card flex flex-col p-6">
            <div className="flex items-center justify-between"><span className="font-mono text-xs text-bean/40">{String(i + 1).padStart(2, '0')}</span><span className="chip bg-leaf/10 text-leaf">Open daily</span></div>
            <h2 className="mt-3 font-display text-4xl">{l.name}</h2>
            <ul className="mb-6 mt-4 space-y-2.5 text-[15px] text-bean/70">
              <li className="flex gap-2.5"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-bean/40" />{l.addr}</li>
              <li className="flex gap-2.5"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-bean/40" />{l.hours}, daily</li>
              <li className="flex gap-2.5"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-bean/40" />{l.phone}</li>
            </ul>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.addr)}`} target="_blank" rel="noreferrer" className="btn-primary mt-auto w-full">
              <Navigation className="h-4 w-4" /> Directions
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
