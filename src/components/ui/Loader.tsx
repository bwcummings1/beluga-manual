import React from 'react'
import { motion } from 'framer-motion'

interface LoaderProps {
  size?: number
  className?: string
}

export const Loader: React.FC<LoaderProps> = ({ size = 24, className = '' }) => {
  const spinTransition = {
    loop: Infinity,
    ease: "linear",
    duration: 1
  }

  return (
    <motion.div
      className={`rounded-full border-t-2 border-b-2 border-primary ${className}`}
      style={{
        width: size,
        height: size,
      }}
      animate={{ rotate: 360 }}
      transition={spinTransition}
    />
  )
}
