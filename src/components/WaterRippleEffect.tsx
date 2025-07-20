"use client";

import { useEffect, useRef } from "react";

interface WaterRippleEffectProps {
  className?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  backgroundColor?: string;
  lineColor?: string;
  style?: React.CSSProperties;
}

function WaterRippleEffect({
  className = "",
  waveSpeedX = 0.015,
  waveSpeedY = 0.008,
  waveAmpX = 50,
  waveAmpY = 25,
  backgroundColor = "transparent",
  lineColor = "rgba(255, 255, 255, 0.3)", // 设置波纹颜色为更透明
  style = {},
}: WaterRippleEffectProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const boundingRef = useRef<{
    width: number
    height: number
    left: number
    top: number
  }>({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  })
  const linesRef = useRef<
    {
      x: number
      y: number
      wave: { x: number; y: number }
      cursor: { x: number; y: number; vx: number; vy: number }
    }[][]
  >([])
  const mouseRef = useRef({
    x: -10,
    y: 0,
    sx: 0,
    sy: 0,
    v: 0,
    vs: 0,
    a: 0,
    set: false,
  })
  const animationFrameRef = useRef<number | null>(null) // Store requestAnimationFrame ID

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    ctxRef.current = canvas.getContext("2d")

    function setSize() {
      if (container) {
        boundingRef.current = container.getBoundingClientRect()
        if (!canvas || !container) return
        canvas.width = boundingRef.current.width
        canvas.height = boundingRef.current.height
      }
    }

    function setLines() {
      const { width, height } = boundingRef.current
      linesRef.current = []
      const oWidth = width + 200,
        oHeight = height + 30
      const totalLines = Math.ceil(oWidth / 10)
      const totalPoints = Math.ceil(oHeight / 10)
      const xStart = (width - 10 * totalLines) / 2
      const yStart = (height - 10 * totalPoints) / 2
      for (let i = 0; i <= totalLines; i++) {
        const pts: Array<{
          x: number
          y: number
          wave: { x: number; y: number }
          cursor: { x: number; y: number; vx: number; vy: number }
        }> = []
        for (let j = 0; j <= totalPoints; j++) {
          pts.push({
            x: xStart + 10 * i,
            y: yStart + 10 * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          })
        }
        linesRef.current.push(pts)
      }
    }

    function movePoints(time: number) {
      const lines = linesRef.current
      const mouse = mouseRef.current
      lines.forEach((pts) => {
        pts.forEach((p) => {
          const move =
            Math.sin(
              (p.x + time * waveSpeedX) * 0.002 +
                (p.y + time * waveSpeedY) * 0.002
            ) * 12
          p.wave.x = Math.cos(move) * waveAmpX
          p.wave.y = Math.sin(move) * waveAmpY

          const dx = p.x - mouse.sx,
            dy = p.y - mouse.sy
          const dist = Math.hypot(dx, dy),
            l = Math.max(175, mouse.vs)
          if (dist < l) {
            const s = 1 - dist / l
            const f = Math.cos(dist * 0.001) * s
            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065
          }

          p.cursor.vx += (0 - p.cursor.x) * 0.005
          p.cursor.vy += (0 - p.cursor.y) * 0.005
          p.cursor.vx *= 0.92
          p.cursor.vy *= 0.92
          p.cursor.x += p.cursor.vx * 2
          p.cursor.y += p.cursor.vy * 2

          p.cursor.x = Math.min(100, Math.max(-100, p.cursor.x))
          p.cursor.y = Math.min(100, Math.max(-100, p.cursor.y))
        })
      })
    }

    function moved(
      point: {
        x: number
        y: number
        wave: { x: number; y: number }
        cursor: { x: number; y: number; vx: number; vy: number }
      },
      withCursor = true
    ) {
      const x = point.x + point.wave.x + (withCursor ? point.cursor.x : 0)
      const y = point.y + point.wave.y + (withCursor ? point.cursor.y : 0)
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
    }

    function drawLines() {
      const { width, height } = boundingRef.current
      const ctx = ctxRef.current
      if (!ctx) return // Return early if ctx is null

      ctx.clearRect(0, 0, width, height)

      // 设置线条的阴影和模糊效果
      ctx.shadowColor = "rgba(255, 255, 255, 0.2)"
      ctx.shadowBlur = 10

      ctx.beginPath()
      ctx.strokeStyle = lineColor // 波纹的颜色
      ctx.lineWidth = 1.5 // 设置波纹线宽度
      linesRef.current.forEach((points) => {
        let p1 = moved(points[0], false)
        ctx.moveTo(p1.x, p1.y)
        points.forEach((p, idx) => {
          const isLast = idx === points.length - 1
          p1 = moved(p, !isLast)
          const p2 = moved(
            points[idx + 1] || points[points.length - 1],
            !isLast
          )
          ctx.lineTo(p1.x, p1.y)
          if (isLast) ctx.moveTo(p2.x, p2.y)
        })
      })
      ctx.stroke()
    }

    function tick(t: number) {
      const mouse = mouseRef.current

      mouse.sx += (mouse.x - mouse.sx) * 0.1
      mouse.sy += (mouse.y - mouse.sy) * 0.1

      const dx = mouse.x - mouse.sx,
        dy = mouse.y - mouse.sy
      const d = Math.hypot(dx, dy)
      mouse.v = d
      mouse.vs += (d - mouse.vs) * 0.1
      mouse.vs = Math.min(100, mouse.vs)
      mouse.sx = mouse.x
      mouse.sy = mouse.y
      mouse.a = Math.atan2(dy, dx)

      movePoints(t)
      drawLines()
      animationFrameRef.current = requestAnimationFrame(tick)
    }

    function onResize() {
      setSize()
      setLines()
    }

    function onMouseMove(e: MouseEvent) {
      const { left, top } = boundingRef.current
      const mouse = mouseRef.current
      mouse.x = e.pageX - left
      mouse.y = e.pageY - top
    }

    setSize()
    setLines()
    animationFrameRef.current = requestAnimationFrame(tick)
    window.addEventListener("resize", onResize)
    window.addEventListener("mousemove", onMouseMove)

    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current) // Clean up animation frame
      }
    }
  }, [waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, lineColor])

  return (
    <div
      ref={containerRef}
      className={`absolute top-0 left-0 w-full h-full overflow-hidden ${className}`}
      style={{
        backgroundColor: backgroundColor,
        ...style,
      }}
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  )
}

export default WaterRippleEffect