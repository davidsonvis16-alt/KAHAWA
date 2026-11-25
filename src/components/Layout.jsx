import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import ItemModal from './ItemModal'
import { useUI } from '../store'

export default function Layout() {
  const { pathname } = useLocation()
  const toast = useUI((s) => s.toast)
  // Braces matter: newer browsers return a Promise from scrollTo, and React would
  // treat a returned value as the effect's cleanup function and crash calling it.
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ItemModal />
      <AnimatePresence>
        {toast && (
          // Centred by the wrapper, not a translate: framer-motion owns `transform` on the toast.
          <div key={toast.id} className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-3">
            <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }}
              className="flex max-w-full items-center gap-2 rounded-xl bg-bean px-5 py-3 font-semibold text-white shadow-lift" role="status">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-honey" /> {toast.msg}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
