import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="font-display text-[120px] font-bold leading-none text-gradient md:text-[160px]"
        >
          404
        </motion.p>
        <p className="mt-2 text-lg font-medium">Lost in the aurora</p>
        <p className="mt-1 text-sm text-muted">The page you're looking for drifted away.</p>
        <Link to="/" className="btn-primary mt-6">
          <ArrowLeft className="size-4" /> Back to dashboard
        </Link>
      </div>
    </div>
  )
}
