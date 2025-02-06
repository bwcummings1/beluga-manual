import React from 'react'
import { motion } from 'framer-motion'

interface TextWaveProps {
  text: string
  className?: string
}

export const TextWave: React.FC<TextWaveProps> = ({ text, className = '' }) => {
  const waveVariants = {
    start: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const letterVariants = {
    start: { y: '0%' },
    end: { y: '-20%' },
  }

  const letterTransition = {
    repeat: Infinity,
    repeatType: 'reverse' as const,
    duration: 0.5,
  }

  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={waveVariants}
      initial="start"
      animate="end"
    >
      {text.split('').map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          transition={letterTransition}
          className="inline-block"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  )
}
