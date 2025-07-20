'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface RollingNumberProps {
  value: number
  incrementPerSecond: number
  formatFn?: (num: number) => string
  className?: string
}

export function RollingNumber({ 
  value: initialValue,
  incrementPerSecond, 
  formatFn = (num) => `$${num.toFixed(2)}`,
  className = ""
}: RollingNumberProps) {
  const [totalCost, setTotalCost] = useState(initialValue)
  const [mounted, setMounted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()
  const lastInitialValueRef = useRef(initialValue)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 当 initialValue 改变时重置 totalCost
  useEffect(() => {
    if (lastInitialValueRef.current !== initialValue) {
      setTotalCost(initialValue)
      lastInitialValueRef.current = initialValue
    }
  }, [initialValue])

  const formatWithLimit = useCallback((num: number) => {
    // 移除限制，允许显示完整数字
    return formatFn(num)
  }, [formatFn])

  useEffect(() => {
    if (!mounted || incrementPerSecond === 0) return
    
    // 清除之前的定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    // 每100ms增加一次，实现平滑滚动
    intervalRef.current = setInterval(() => {
      setTotalCost(current => {
        const newValue = current + incrementPerSecond / 10
        // 移除限制，允许数字自然增长
        return newValue
      })
    }, 100)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [incrementPerSecond, mounted])

  // 在服务端渲染或未挂载时显示初始值
  if (!mounted) {
    return (
      <span 
        className={`font-mono whitespace-nowrap ${className}`} 
        suppressHydrationWarning
        style={{ 
          display: 'inline-block',
          whiteSpace: 'nowrap',
          wordBreak: 'keep-all'
        }}
      >
        {formatWithLimit(initialValue)}
      </span>
    )
  }

  return (
    <span 
      className={`font-mono whitespace-nowrap ${className}`} 
      suppressHydrationWarning
      style={{ 
        display: 'inline-block',
        whiteSpace: 'nowrap',
        wordBreak: 'keep-all'
      }}
    >
      {formatWithLimit(totalCost)}
    </span>
  )
}