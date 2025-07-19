'use client'

import { useEffect, useState, useRef } from 'react'

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

  useEffect(() => {
    setMounted(true)
    setTotalCost(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (!mounted || incrementPerSecond === 0) return
    
    // 清除之前的定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    // 每100ms增加一次，实现平滑滚动
    intervalRef.current = setInterval(() => {
      setTotalCost(current => current + incrementPerSecond / 10)
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
      <span className={`font-mono ${className}`}>
        {formatFn(initialValue)}
      </span>
    )
  }

  return (
    <span className={`font-mono ${className}`}>
      {formatFn(totalCost)}
    </span>
  )
}