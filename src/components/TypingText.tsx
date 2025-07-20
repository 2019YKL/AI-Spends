'use client'

import { useState, useEffect } from 'react'

interface TypingTextProps {
  texts: string[]
  colors?: string[]
  delay?: number
  className?: string
}

export function TypingText({ 
  texts, 
  colors = [], 
  delay = 150,
  className = "" 
}: TypingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[currentIndex] || ''
    
    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentText.length) {
        // 正在打字
        setDisplayText(currentText.substring(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      } else if (!isDeleting && charIndex === currentText.length) {
        // 打字完成，开始删除
        setTimeout(() => setIsDeleting(true), 1000)
      } else if (isDeleting && charIndex > 0) {
        // 正在删除
        setDisplayText(currentText.substring(0, charIndex - 1))
        setCharIndex(charIndex - 1)
      } else if (isDeleting && charIndex === 0) {
        // 删除完成，切换文本
        setIsDeleting(false)
        setCurrentIndex((currentIndex + 1) % texts.length)
        setCharIndex(0)
      }
    }, isDeleting ? delay / 2 : delay)

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, currentIndex, texts, delay])

  const currentColor = colors[currentIndex] || 'inherit'

  return (
    <span className={className} style={{ color: currentColor }}>
      <span className="animate-pulse">|</span>
      {displayText}
    </span>
  )
}