import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Coffee, Cake, Gift, Crown } from 'lucide-react'
import { useAuth } from '../store'

const tiers = [
  { pts: 250, Icon: Cake, title: 'Free pastry', text: 'Any croissant, doughnut or slice of cake.' },
  { pts: 500, Icon: Coffee, title: 'Free coffee', text: 'Any hot or iced coffee, any size, any milk.' },
  { pts: 1200, Icon: Gift, title: 'Free breakfast', text: 'The Big Kahawa Breakfast or a pancake stack.' },
  { pts: 3000, Icon: Crown, title: 'Gold status', text: 'Double Crumbs on every order for a year.' },
]

export default function Rewards() {
  const user = useAuth((s) => s.user)
  return (
    <div className="container-x pt-8">
      <div className="rounded-3xl bg-honey px-6 py-12 sm:px-14 sm:py-16">
        <div className="eyebrow text-bean/60">Crumbs rewards</div>
        <h1 className="mt-4 max-w-4xl font-display text-6xl sm:text-8xl lg:text-9xl">Spend KSh 10.<br />Earn 1 Crumb.</h1>
        <p className="mt-6 max-w-xl text-lg text-bean/70">Crumbs never expire while you order at least once every 6 months. Redeem them at checkout, online or in-store.</p>
        {user ? (
          <div className="mt-8 inline-flex items-center gap-3 rounded-xl bg-bean px-6 py-3 text-lg text-white">You have <b className="font-display text-4xl text-honey">{user.points}</b> Crumbs</div>
        ) : (
          <Link to="/signup" className="btn-primary mt-8 px-8 py-4 text-lg">Join & get 50 Crumbs</Link>
        )}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((t, i) => (
          <motion.div key={t.pts} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card p-7">
            <div className="flex items-center justify-between"><span className="font-mono text-xs text-bean/40">Tier {String(i + 1).padStart(2, '0')}</span><t.Icon className="h-6 w-6" /></div>
            <div className="mt-6 font-display text-6xl">{t.pts.toLocaleString()}</div>
            <div className="eyebrow mt-1">Crumbs</div>
            <h3 className="mt-5 border-t border-bean/10 pt-4 text-lg font-bold">{t.title}</h3>
            <p className="mt-1 text-bean/60">{t.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
