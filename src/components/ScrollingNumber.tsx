'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ScrollingNumberProps {
  value: number
  formatFn?: (num: number) => string
  className?: string
  digits?: number
}

export function ScrollingNumber({ 
  value, 
  formatFn = (num) => num.toFixed(2),
  className = "",
  digits = 8
}: ScrollingNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [prevValue, setPrevValue] = useState(value)

  useEffect(() => {
    if (value !== prevValue) {
      const startValue = displayValue
      const endValue = value
      const startTime = Date.now()
      const duration = 600

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // 缓动函数
        const easeOut = 1 - Math.pow(1 - progress, 2)
        
        const currentValue = startValue + (endValue - startValue) * easeOut
        setDisplayValue(currentValue)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setPrevValue(value)
        }
      }

      animate()
    }
  }, [value, displayValue, prevValue])

  const formattedValue = formatFn(displayValue)
  const characters = formattedValue.split('')

  return (
    <div className={`inline-flex ${className}`}>
      <AnimatePresence mode="popLayout">
        {characters.map((char, index) => (
          <motion.span
            key={`${index}-${char}`}
            initial={{ 
              y: char !== characters[index] ? 20 : 0,
              opacity: char !== characters[index] ? 0 : 1
            }}
            animate={{ 
              y: 0,
              opacity: 1
            }}
            exit={{ 
              y: -20,
              opacity: 0
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              delay: index * 0.02
            }}
            className="inline-block font-mono"
            style={{ minWidth: char === '.' || char === '$' || char === ',' ? 'auto' : '0.6em' }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

interface CounterDigitProps {
  digit: string
  index: number
}

function CounterDigit({ digit, index }: CounterDigitProps) {
  return (
    <motion.div
      key={`${index}-${digit}`}
      className="inline-block relative overflow-hidden"
      style={{ width: '0.6em', height: '1.2em' }}
      initial={{ y: 30 }}
      animate={{ y: 0 }}
      exit={{ y: -30 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: index * 0.03
      }}
    >
      <span className="absolute inset-0 flex items-center justify-center font-mono">
        {digit}
      </span>
    </motion.div>
  )
}

interface SmoothCounterProps {
  value: number
  incrementPerSecond: number
  formatFn?: (num: number) => string
  className?: string
}

export function SmoothCounter({ 
  value: initialValue, 
  incrementPerSecond, 
  formatFn = (num) => num.toFixed(6),
  className = ""
}: SmoothCounterProps) {
  const [targetValue, setTargetValue] = useState(initialValue)
  const [displayValue, setDisplayValue] = useState(initialValue)

  // 每秒更新目标值
  useEffect(() => {
    setTargetValue(initialValue)
    setDisplayValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetValue(current => current + incrementPerSecond)
    }, 1000)

    return () => clearInterval(interval)
  }, [incrementPerSecond])

  // 每16ms(60fps)更新显示值，创建平滑滚动
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue(current => {
        const diff = targetValue - current
        if (Math.abs(diff) < 0.000001) return targetValue
        
        // 每帧移动差值的8%，创建缓动效果
        return current + diff * 0.08
      })
    }, 16)

    return () => clearInterval(interval)
  }, [targetValue])

  return (
    <ScrollingNumber 
      value={displayValue} 
      formatFn={formatFn}
      className={className}
    />
  )
}