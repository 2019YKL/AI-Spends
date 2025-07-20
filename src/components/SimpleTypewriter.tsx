'use client'

import { useState, useEffect } from 'react'

interface SimpleTypewriterProps {
  texts: string[]
  colors?: string[]
  speed?: number
  deleteSpeed?: number
  pauseDuration?: number
  className?: string
}

export function SimpleTypewriter({ 
  texts, 
  colors = [], 
  speed = 200, 
  deleteSpeed = 100,
  pauseDuration = 1000,
  className = "" 
}: SimpleTypewriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting' | 'switching'>('typing')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || texts.length === 0) return
    
    const currentText = texts[currentIndex]
    
    if (phase === 'typing') {
      let index = 0
      const typingTimer = setInterval(() => {
        if (index < currentText.length) {
          setDisplayText(currentText.slice(0, index + 1))
          index++
        } else {
          clearInterval(typingTimer)
          setPhase('pausing')
          
          setTimeout(() => {
            setPhase('deleting')
          }, pauseDuration)
        }
      }, speed)
      
      return () => clearInterval(typingTimer)
    }
    
    if (phase === 'deleting') {
      const deleteTimer = setInterval(() => {
        setDisplayText(prev => {
          if (prev.length > 0) {
            return prev.slice(0, -1)
          } else {
            clearInterval(deleteTimer)
            setPhase('switching')
            
            setTimeout(() => {
              setCurrentIndex((prev) => (prev + 1) % texts.length)
              setPhase('typing')
            }, 200)
            
            return ''
          }
        })
      }, deleteSpeed)
      
      return () => clearInterval(deleteTimer)
    }
    
  }, [phase, currentIndex, texts, speed, deleteSpeed, pauseDuration, mounted])

  const currentColor = colors[currentIndex] || 'inherit'

  if (!mounted || texts.length === 0) {
    return <span className={className}>Loading...</span>
  }

  return (
    <span className={className} style={{ color: currentColor }}>
      {phase !== 'switching' && <span className="animate-pulse">|</span>}
      {displayText}
    </span>
  )
}