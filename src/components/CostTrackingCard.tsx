'use client'

import { useEffect, useState } from 'react'
import { AIService, PricingTier } from '@/types/ai-services'
import { calculateRealTimeCost, formatCurrency, formatCurrencyPrecise, formatTimeElapsed } from '@/lib/cost-calculator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { SmoothNumber } from '@/components/SmoothNumber'
import { IconRenderer } from '@/components/IconRenderer'
import { cn } from '@/lib/utils'

interface CostTrackingCardProps {
  service: AIService
  className?: string
  onToggle?: (serviceId: string) => void
  onTierChange?: (serviceId: string, tierId: string) => void
}

export function CostTrackingCard({ service, className, onToggle, onTierChange }: CostTrackingCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const cost = calculateRealTimeCost(service, currentTime)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [mounted])

  const getCategoryBadge = (category: string) => {
    const badges = {
      'code-editor': '💻 编辑器',
      'ai-chat': '💬 AI对话',
      'ai-image': '🎨 AI图像',
      'productivity': '⚡ 生产力',
      'other': '🔧 其他'
    }
    return badges[category as keyof typeof badges] || '🔧 其他'
  }

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
      !service.isActive && "opacity-60 bg-gray-50 dark:bg-gray-900/50",
      className
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-16 h-16 rounded-xl flex items-center justify-center text-white transition-all duration-200",
              service.color,
              !service.isActive && "grayscale"
            )}>
              <IconRenderer name={service.icon} size={32} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{service.name}</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(service.subscriptionPrice)}/month
                </p>
                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                  {getCategoryBadge(service.category)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Switch
              checked={service.isActive}
              onCheckedChange={() => onToggle?.(service.id)}
            />
            <span className="text-xs text-muted-foreground">
              {service.isActive ? '已启用' : '已关闭'}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {service.isActive ? (
          <>
            {/* Pricing Tiers */}
            {service.pricingTiers && service.pricingTiers.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {service.pricingTiers.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => onTierChange?.(service.id, tier.id)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 font-semibold border-2 ${
                      service.selectedTier === tier.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    {tier.name} ${tier.price}
                  </button>
                ))}
              </div>
            )}

            {/* Current Cost (Real-time) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Today&apos;s Consumption</span>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono" style={{ color: '#DBB685' }}>
                    <SmoothNumber
                      value={cost.currentCost}
                      incrementPerSecond={cost.costPerSecond}
                      formatFn={formatCurrency}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {mounted ? `${cost.percentageUsed.toFixed(2)}% of today` : '--% of today'}
                  </div>
                </div>
              </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-1000 shadow-sm"
              style={{ 
                width: mounted ? `${Math.min(cost.percentageUsed, 100)}%` : '0%',
                backgroundColor: '#DBB685'
              }}
              suppressHydrationWarning
            />
          </div>


            </div>
          </>
        ) : (
          /* Inactive State */
          <div className="text-center py-8">
            <div className="text-4xl mb-2 grayscale">😴</div>
            <div className="text-lg font-medium text-muted-foreground mb-1">服务已暂停</div>
            <div className="text-sm text-muted-foreground">
              启用以开始追踪费用
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground">月费</div>
              <div className="text-xl font-bold">{formatCurrency(service.subscriptionPrice)}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}