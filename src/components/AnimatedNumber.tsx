'use client'

import { useEffect, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  formatFn?: (num: number) => string
  className?: string
  duration?: number
}

export function AnimatedNumber({ 
  value, 
  formatFn = (num) => num.toFixed(6), 
  className = "",
  duration = 1000 
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (Math.abs(value - displayValue) < 0.000001) return

    setIsAnimating(true)
    
    const startValue = displayValue
    const endValue = value
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      const currentValue = startValue + (endValue - startValue) * easeOut
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    animate()
  }, [value, displayValue, duration])

  return (
    <span className={`${className} ${isAnimating ? 'animate-pulse' : ''}`}>
      {formatFn(displayValue)}
    </span>
  )
}

interface RealTimeNumberProps {
  initialValue: number
  incrementPerSecond: number
  formatFn?: (num: number) => string
  className?: string
}

export function RealTimeNumber({ 
  initialValue, 
  incrementPerSecond, 
  formatFn = (num) => num.toFixed(6),
  className = ""
}: RealTimeNumberProps) {
  const [value, setValue] = useState(initialValue)
  const [displayValue, setDisplayValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
    setDisplayValue(initialValue)
  }, [initialValue])

  // 每秒更新目标值
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(current => current + incrementPerSecond)
    }, 1000)

    return () => clearInterval(interval)
  }, [incrementPerSecond])

  // 平滑滚动到目标值
  useEffect(() => {
    const startValue = displayValue
    const endValue = value
    const difference = endValue - startValue
    
    if (Math.abs(difference) < 0.000001) return

    const duration = 800 // 800ms 平滑过渡
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // 使用缓动函数让滚动更自然
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      
      const currentValue = startValue + (difference * easeProgress)
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [value, displayValue])

  return (
    <span className={`font-mono ${className}`}>
      {formatFn(displayValue)}
    </span>
  )
}