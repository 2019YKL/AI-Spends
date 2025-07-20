'use client'

import { useState, useEffect, useRef } from 'react'

interface SimpleAlternatingTextProps {
  texts: string[]
  colors?: string[]
  typingSpeed?: number
  deleteSpeed?: number
  pauseDuration?: number
  className?: string
}

export function SimpleAlternatingText({ 
  texts, 
  colors = [], 
  typingSpeed = 100,
  deleteSpeed = 50,
  pauseDuration = 1000,
  className = "" 
}: SimpleAlternatingTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [mounted, setMounted] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setMounted(true)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted || texts.length === 0) return

    const currentText = texts[currentIndex]
    
    if (isTyping) {
      if (displayText.length < currentText.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        }, typingSpeed)
      } else {
        timeoutRef.current = setTimeout(() => {
          setIsTyping(false)
        }, pauseDuration)
      }
    } else {
      if (displayText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, deleteSpeed)
      } else {
        setCurrentIndex((prev) => (prev + 1) % texts.length)
        setIsTyping(true)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [displayText, currentIndex, isTyping, mounted, texts, typingSpeed, deleteSpeed, pauseDuration])

  const currentColor = colors[currentIndex] || 'inherit'

  if (!mounted) {
    return <span className={className} style={{ color: colors[0] || '#E0BC8E' }}>{texts[0] || ''}</span>
  }

  return (
    <span className={className} style={{ color: currentColor }}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}