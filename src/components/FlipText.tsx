'use client'

import { useState, useEffect } from 'react'

interface FlipTextProps {
  words: string[]
  colors?: string[]
  interval?: number
  className?: string
}

export function FlipText({ words, colors = [], interval = 2000, className = "" }: FlipTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length)
        setIsFlipping(false)
      }, 300) // Half of animation duration
    }, interval)

    return () => clearInterval(timer)
  }, [words.length, interval])

  const currentColor = colors[currentIndex] || 'inherit'

  return (
    <span className={`relative inline-block ${className}`}>
      <span
        className={`inline-block transition-transform duration-600 ease-in-out ${
          isFlipping ? 'rotate-y-180' : 'rotate-y-0'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          color: currentColor
        }}
      >
        {words[currentIndex]}
      </span>
    </span>
  )
}