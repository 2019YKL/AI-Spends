'use client'

import { motion } from "framer-motion"
import React from "react"

interface ScaleEffectProps {
  children: React.ReactNode
  className?: string
  scaleStart?: number
  scaleEnd?: number
  duration?: number
}

export const ScaleEffect: React.FC<ScaleEffectProps> = ({
  children,
  className = "",
  scaleStart = 0.95,
  scaleEnd = 1.05,
  duration = 3,
}) => {
  return (
    <motion.div
      initial={{ scale: scaleStart }}
      animate={{ scale: scaleEnd }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}