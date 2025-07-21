'use client'

import { AIService } from '@/types/ai-services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { IconRenderer } from '@/components/IconRenderer'
import { cn } from '@/lib/utils'

interface SimpleCostTrackingCardProps {
  service: AIService
  className?: string
  onToggle?: (serviceId: string) => void
  onTierChange?: (serviceId: string, tierId: string) => void
}

export function SimpleCostTrackingCard({ service, className, onToggle, onTierChange }: SimpleCostTrackingCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
      !service.isActive && "opacity-60 bg-gray-50 dark:bg-gray-900/50",
      className
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center text-white transition-all duration-200",
              service.color,
              !service.isActive && "grayscale"
            )}>
              <IconRenderer name={service.icon} size={24} />
            </div>
            <h3 className="text-lg font-semibold">{service.name}</h3>
          </div>
          <Switch
            checked={service.isActive}
            onCheckedChange={() => onToggle?.(service.id)}
          />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-2">
        {/* 固定高度容器，确保开启关闭状态高度一致 */}
        <div className="min-h-[60px] flex items-center justify-center">
          {service.isActive ? (
            <>
              {/* Pricing Tiers */}
              {service.pricingTiers && service.pricingTiers.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {service.pricingTiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => onTierChange?.(service.id, tier.id)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 font-medium border ${
                        service.selectedTier === tier.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }`}
                    >
                      {tier.name} ${tier.price}
                    </button>
                  ))}
                </div>
              ) : (
                /* 如果没有套餐选项，显示默认价格 */
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  ${service.subscriptionPrice}/month
                </div>
              )}
            </>
          ) : (
            /* Inactive State */
            <span className="text-sm text-muted-foreground">
              服务已关闭
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}