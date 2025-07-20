'use client'

import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  texts: string[]
  colors?: string[]
  interval?: number
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  className?: string
}

export function TypewriterText({ 
  texts, 
  colors = [], 
  interval = 4000,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 1000,
  className = "" 
}: TypewriterTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const targetText = texts[currentIndex]
    
    if (!isDeleting) {
      // 正在打字
      if (currentText.length < targetText.length) {
        const timer = setTimeout(() => {
          setCurrentText(targetText.slice(0, currentText.length + 1))
        }, typingSpeed)
        return () => clearTimeout(timer)
      } else {
        // 打字完成，暂停后开始删除
        const timer = setTimeout(() => {
          setIsDeleting(true)
        }, pauseDuration)
        return () => clearTimeout(timer)
      }
    } else {
      // 正在删除
      if (currentText.length > 0) {
        const timer = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1))
        }, deletingSpeed)
        return () => clearTimeout(timer)
      } else {
        // 删除完成，切换到下一个文本
        setCurrentIndex((prev) => (prev + 1) % texts.length)
        setIsDeleting(false)
      }
    }
  }, [currentText, currentIndex, isDeleting, texts, typingSpeed, deletingSpeed, pauseDuration, mounted])

  const currentColor = colors[currentIndex] || 'inherit'

  if (!mounted) {
    return (
      <span className={`relative inline-block ${className}`}>
        <span style={{ color: colors[0] || 'inherit' }}>
          {texts[0]}
        </span>
      </span>
    )
  }

  return (
    <span className={`relative inline-block ${className}`}>
      <span
        style={{ color: currentColor }}
        className="relative"
      >
        {currentText}
        <span className="animate-pulse ml-1">|</span>
      </span>
    </span>
  )
}