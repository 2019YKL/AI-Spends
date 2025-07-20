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
  const [mounted, setMounted] = useState(false)

  // 处理水合错误
  useEffect(() => {
    setMounted(true)
    // 重新设置初始值以确保客户端和服务端一致
    setTargetValue(initialValue)
    setDisplayValue(initialValue)
  }, [])

  // 当初始值改变时更新目标值和显示值
  useEffect(() => {
    if (mounted) {
      setTargetValue(Math.min(initialValue, 999999.99))
      setDisplayValue(Math.min(initialValue, 999999.99))
    }
  }, [initialValue, mounted])

  // 每秒更新目标值 - 只在客户端执行
  useEffect(() => {
    if (!mounted) return
    
    const interval = setInterval(() => {
      setTargetValue(current => {
        const newValue = current + incrementPerSecond
        // 限制最大值为6位数
        return Math.min(newValue, 999999.99)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [incrementPerSecond, mounted])

  // 高频率平滑滚动到目标值 - 只在客户端执行
  useEffect(() => {
    if (!mounted) return
    
    let animationFrame: number

    const animate = () => {
      setDisplayValue(current => {
        const diff = targetValue - current
        if (Math.abs(diff) < 0.000001) return targetValue
        
        // 使用更平滑的缓动算法，每帧移动差值的6%
        const newValue = current + diff * 0.06
        
        // 继续动画
        if (Math.abs(targetValue - newValue) > 0.000001) {
          animationFrame = requestAnimationFrame(animate)
        }
        
        return newValue
      })
    }

    // 启动动画
    if (Math.abs(targetValue - displayValue) > 0.000001) {
      animate()
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [targetValue, displayValue, mounted])

  // 格式化函数，限制显示数字
  const formatWithLimit = (num: number) => {
    const limitedNum = Math.min(num, 999999.99)
    return formatFn(limitedNum)
  }

  // 避免水合错误，服务端渲染时显示占位符
  if (!mounted) {
    return (
      <span className={`font-mono transition-all duration-75 ${className}`} suppressHydrationWarning>
        {formatWithLimit(initialValue)}
      </span>
    )
  }

  return (
    <span className={`font-mono transition-all duration-75 ${className}`} suppressHydrationWarning>
      {formatWithLimit(displayValue)}
    </span>
  )
}