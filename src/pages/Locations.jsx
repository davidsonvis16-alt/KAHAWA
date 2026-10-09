import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Navigation } from 'lucide-react'
import SmartImage from '../components/SmartImage'
import { locations, heroImages } from '../data/menu'

export default function Locations() {
  return (
    <div className="container-x pt-10">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-bean">
        <SmartImage src={heroImages.interior} alt="Inside our Westlands café" className="h-72 w-full object-cover opacity-60 sm:h-96" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 text-cream sm:p-12">
          <h1 className="font-display text-5xl font-black sm:text-7xl">Come sit with us.</h1>
          <p className="mt-2 max-w-lg text-lg text-cream/80">Five cafés, free Wi-Fi, plug points at every table, and the best seat is always by the window.</p>
        </div>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((l, i) => (
          <motion.div key={l.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-bean/5">
            <h2 className="font-display text-2xl font-black">{l.name}</h2>
            <ul className="mt-4 space-y-2.5 text-bean/70">
              <li className="flex gap-2.5"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-chili" />{l.addr}</li>
              <li className="flex gap-2.5"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-chili" />{l.hours}, daily</li>
              <li className="flex gap-2.5"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-chili" />{l.phone}</li>
            </ul>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.addr)}`} target="_blank" rel="noreferrer" className="btn-ghost mt-6 w-full">
              <Navigation className="h-4 w-4" /> Directions
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
