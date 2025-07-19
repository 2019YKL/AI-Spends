'use client'

import Image from 'next/image'

interface IconRendererProps {
  name: string
  size?: number
  className?: string
}

export function IconRenderer({ name, size = 24, className = "" }: IconRendererProps) {
  return (
    <Image
      src={`/icon/${name}`}
      alt={name}
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  )
}