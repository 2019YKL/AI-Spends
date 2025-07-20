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
  }, [])

  // 当初始值改变时更新目标值和显示值
  useEffect(() => {
    setTargetValue(initialValue)
    setDisplayValue(initialValue)
  }, [initialValue])

  // 每秒更新目标值 - 只在客户端执行
  useEffect(() => {
    if (!mounted) return
    
    const interval = setInterval(() => {
      setTargetValue(current => current + incrementPerSecond)
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

  // 避免水合错误，服务端渲染时显示占位符
  if (!mounted) {
    return (
      <span className={`font-mono transition-all duration-75 ${className}`}>
        {formatFn(initialValue)}
      </span>
    )
  }

  return (
    <span className={`font-mono transition-all duration-75 ${className}`}>
      {formatFn(displayValue)}
    </span>
  )
}