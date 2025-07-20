'use client'

import { useState, useEffect, useRef } from 'react'

interface NewTypewriterProps {
  className?: string
}

export function NewTypewriter({ className = "" }: NewTypewriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [cursorColor, setCursorColor] = useState('#E0BC8E') // 金色
  const [phase, setPhase] = useState<'typing1' | 'deleting1' | 'typing2' | 'deleting2'>('typing1')
  const [mounted, setMounted] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const text1 = "发家致富 指日可待"
  const text2 = "败家致负 指日可待"
  const typingSpeed = 100
  const deleteSpeed = 50
  const pauseDuration = 2000

  useEffect(() => {
    setMounted(true)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    // 清理之前的 timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const runAnimation = () => {
      switch (phase) {
        case 'typing1':
          // 1. 光标金色，打字 "发家致富 指日可待"
          setCursorColor('#E0BC8E')
          if (displayText.length < text1.length) {
            setDisplayText(text1.slice(0, displayText.length + 1))
            timeoutRef.current = setTimeout(runAnimation, typingSpeed)
          } else {
            // 打字完成，暂停后开始删除
            timeoutRef.current = setTimeout(() => {
              setPhase('deleting1')
            }, pauseDuration)
          }
          break

        case 'deleting1':
          // 2. 开始退格，从"待"往"发"删除
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
            timeoutRef.current = setTimeout(runAnimation, deleteSpeed)
          } else {
            // 删除完成，切换到打字阶段2
            timeoutRef.current = setTimeout(() => {
              setPhase('typing2')
            }, 50)
          }
          break

        case 'typing2':
          // 3. 光标变成绿色，打字 "败家致负 指日可待"
          setCursorColor('#22c55e')
          if (displayText.length < text2.length) {
            setDisplayText(text2.slice(0, displayText.length + 1))
            timeoutRef.current = setTimeout(runAnimation, typingSpeed)
          } else {
            // 打字完成，暂停后开始删除
            timeoutRef.current = setTimeout(() => {
              setPhase('deleting2')
            }, pauseDuration)
          }
          break

        case 'deleting2':
          // 4. 开始删除退格，从"待"往"败"删除
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
            timeoutRef.current = setTimeout(runAnimation, deleteSpeed)
          } else {
            // 删除完成，回到阶段1，进入循环
            timeoutRef.current = setTimeout(() => {
              setPhase('typing1')
            }, 50)
          }
          break
      }
    }

    // 开始动画
    timeoutRef.current = setTimeout(runAnimation, 50)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [displayText, phase, mounted])

  if (!mounted) {
    return (
      <span className={className} style={{ color: '#E0BC8E' }}>
        发家致富 指日可待
      </span>
    )
  }

  return (
    <span className={className}>
      <span style={{ color: phase === 'typing1' || phase === 'deleting1' ? '#E0BC8E' : '#22c55e' }}>
        {displayText}
      </span>
      <span 
        className="animate-pulse ml-0.5" 
        style={{ color: cursorColor }}
      >
        |
      </span>
    </span>
  )
}