import React, { useMemo } from "react"

import { cn } from "@/lib/utils"

interface DotProps {
  color?: string
  size?: number
  spacing?: number
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /**
   * @description Whether to show the gradient or not
   * @type {boolean}
   * @default false
   */
  gradient?: boolean
  /**
   * @description The width of the gradient on either side
   * @type {number | string}
   * @default 100
   */
  gradientWidth?: number | string

  /**
   * @description The height of the gradient on either side
   * @type {number | string}
   * @default 200
   */
  gradientHeight?: number | string
}

function Placeholder() {
  return (
    <div className="flex h-full min-h-48 w-full min-w-48 items-center justify-center">
      <div
        className={cn(
          "absolute top-0 left-0 h-full w-[var(--gradient-width)] z-2 pointer-events-none",
          "bg-gradient-to-r from-black to-transparent"
        )}
      />
      <div
        className={cn(
          "absolute top-0 right-0 h-full w-[var(--gradient-width)] z-2 pointer-events-none transform rotate-180",
          "bg-gradient-to-r from-black to-transparent"
        )}
      />
    </div>
  )
}

export function Dot({
  color = "#cbd5e1",
  size = 1,
  spacing = 20,
  children,
  className,
  gradient = true,
  gradientWidth = 100,
  gradientHeight = 200,
}: DotProps) {
  const gradientColor = "hsl(var(--background))" // 引用 Tailwind CSS 变量
  const gradientStyle = useMemo(
    () => ({
      ["--gradient-color" as string]: gradientColor,
      ["--gradient-width" as string]:
        typeof gradientWidth === "number"
          ? `${gradientWidth}px`
          : gradientWidth,
      ["--gradient-height" as string]:
        typeof gradientHeight === "number"
          ? `${gradientHeight}px`
          : gradientHeight,
    }),
    [gradientColor, gradientWidth, gradientHeight]
  )
  return (
    <div
      style={{
        backgroundImage: `radial-gradient(${color} ${size}px, transparent ${size}px)`,
        backgroundSize: `calc(${spacing} * ${size}px) calc(${spacing} * ${size}px)`,
        position: "relative",
        zIndex: 1,
      }}
      className={cn("relative", className)}
    >
      <div style={{ position: "relative", zIndex: 4 }}>
        {children ?? <Placeholder />}
      </div>
      {gradient && (
        <div style={gradientStyle}>
          {/* 上方渐变蒙版 */}
          <div
            className={cn(
              "absolute top-0 left-0 h-[var(--gradient-height)] w-full z-2 pointer-events-none",
              "bg-gradient-to-b from-[var(--gradient-color)] to-transparent"
            )}
          />
          {/* 下方渐变蒙版 */}
          <div
            className={cn(
              "absolute bottom-0 left-0 h-[var(--gradient-height)] w-full z-2 pointer-events-none transform rotate-180",
              "bg-gradient-to-b from-[var(--gradient-color)] to-transparent "
            )}
          />
          <div
            className={cn(
              "absolute top-0 left-0 h-full w-[var(--gradient-width)] z-2 pointer-events-none",
              "bg-gradient-to-r from-[var(--gradient-color)] to-transparent ",
              "hidden md:block"
            )}
          />
          <div
            className={cn(
              "absolute top-0 right-0 h-full w-[var(--gradient-width)] z-2 pointer-events-none transform rotate-180",
              "bg-gradient-to-r from-[var(--gradient-color)] to-transparent ",
              "hidden md:block"
            )}
          />
        </div>
      )}
    </div>
  )
}

export function DotDemo() {
  return (
    <div className="size-full border rounded-lg overflow-hidden">
      <Dot gradient={false} />
    </div>
  )
}