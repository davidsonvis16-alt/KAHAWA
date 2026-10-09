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
  useEffect(() => window.scrollTo({ top: 0, behavior: 'instant' }), [pathname])
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main key={pathname} className="flex-1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <ItemModal />
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-bean px-5 py-3 font-semibold text-cream shadow-lift" role="status">
            <CheckCircle2 className="h-5 w-5 text-honey" /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
