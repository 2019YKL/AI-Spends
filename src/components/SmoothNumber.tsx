'use client'

import { useEffect, useState } from 'react'

interface SmoothNumberProps {
  value: number
  incrementPerSecond: number
  formatFn?: (num: number) => string
  className?: string
}

export function SmoothNumber({ 
  value: initialValue, 
  incrementPerSecond, 
  formatFn = (num) => num.toFixed(6),
  className = ""
}: SmoothNumberProps) {
  const [targetValue, setTargetValue] = useState(initialValue)
  const [displayValue, setDisplayValue] = useState(initialValue)

  // 当初始值改变时更新目标值和显示值
  useEffect(() => {
    setTargetValue(initialValue)
    setDisplayValue(initialValue)
  }, [initialValue])

  // 每秒更新目标值
  useEffect(() => {
    const interval = setInterval(() => {
      setTargetValue(current => current + incrementPerSecond)
    }, 1000)

    return () => clearInterval(interval)
  }, [incrementPerSecond])

  // 60fps 平滑滚动到目标值
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue(current => {
        const diff = targetValue - current
        if (Math.abs(diff) < 0.000001) return targetValue
        
        // 每帧移动差值的10%，创建平滑缓动效果
        return current + diff * 0.1
      })
    }, 16) // 16ms ≈ 60fps

    return () => clearInterval(interval)
  }, [targetValue])

  return (
    <span className={`font-mono transition-all duration-75 ${className}`}>
      {formatFn(displayValue)}
    </span>
  )
}