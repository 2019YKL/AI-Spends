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
    // 限制最大显示为6位数 (999999.99)
    const limitedNum = Math.min(num, 999999.99)
    return formatFn(limitedNum)
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
        // 限制最大值，防止数字过大
        return Math.min(newValue, 999999.99)
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
      <span className={`font-mono ${className}`} suppressHydrationWarning>
        {formatWithLimit(initialValue)}
      </span>
    )
  }

  return (
    <span className={`font-mono ${className}`} suppressHydrationWarning>
      {formatWithLimit(totalCost)}
    </span>
  )
}