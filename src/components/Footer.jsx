import { Link } from 'react-router-dom'
import { Phone, Mail } from 'lucide-react'
import { siInstagram, siFacebook, siX, siTiktok } from 'simple-icons'
import Logo from './Logo'
import PaymentStrip from './PaymentLogos'

export default function Footer() {
  return (
    <footer className="mt-24 bg-bean text-cream/80">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs leading-relaxed">Kenyan coffee, all-day breakfast and proper comfort food. Brewing in Nairobi since 2019.</p>
          <div className="mt-6 flex gap-2">
            {[siInstagram, siTiktok, siFacebook, siX].map((si) => (
              <a key={si.slug} href="#" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-chili" aria-label={si.title}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><path d={si.path} /></svg>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 font-display text-lg font-bold text-cream">Order</h4>
          <ul className="space-y-2.5">
            <li><Link to="/menu" className="hover:text-white">Full menu</Link></li>
            <li><Link to="/deals" className="hover:text-white">Deals & combos</Link></li>
            <li><Link to="/rewards" className="hover:text-white">Crumbs rewards</Link></li>
            <li><Link to="/account" className="hover:text-white">Track an order</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-display text-lg font-bold text-cream">Visit</h4>
          <ul className="space-y-2.5">
            <li><Link to="/locations" className="hover:text-white">Our cafés</Link></li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0700 100 200</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@kahawacrumb.co.ke</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-display text-lg font-bold text-cream">We accept</h4>
          <PaymentStrip />
          <p className="mt-4 text-sm text-cream/50">M-PESA Till 5 123 456 · Paybill 400 200</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col justify-between gap-2 py-6 text-sm text-cream/50 sm:flex-row">
          <span>© {new Date().getFullYear()} Kahawa & Crumb Ltd. All rights reserved.</span>
          <span>Prices in Kenya Shillings, inclusive of VAT.</span>
        </div>
      </div>
    </footer>
  )
}
