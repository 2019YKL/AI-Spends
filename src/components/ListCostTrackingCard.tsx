'use client'

import { AIService } from '@/types/ai-services'
import { Switch } from '@/components/ui/switch'
import { IconRenderer } from '@/components/IconRenderer'
import { cn } from '@/lib/utils'

interface ListCostTrackingCardProps {
  service: AIService
  className?: string
  onToggle?: (serviceId: string) => void
  onTierChange?: (serviceId: string, tierId: string) => void
}

export function ListCostTrackingCard({ service, className, onToggle, onTierChange }: ListCostTrackingCardProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200",
      !service.isActive && "opacity-60 bg-gray-50 dark:bg-gray-900/50",
      className
    )}>
      {/* Left: Icon + Service Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0",
          service.color,
          !service.isActive && "grayscale"
        )}>
          <IconRenderer name={service.icon} size={24} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {service.name}
          </h3>
          {service.isActive && service.pricingTiers && service.pricingTiers.length > 0 && (
            <div className="mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-500">
                {service.pricingTiers.length} 个计划
              </span>
            </div>
          )}
          {!service.isActive && (
            <div className="mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-500">
                服务已关闭
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Center: Pricing Tiers (if active) */}
      {service.isActive && service.pricingTiers && service.pricingTiers.length > 0 && (
        <div className="flex gap-2 mx-4 flex-shrink-0">
          {service.pricingTiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => onTierChange?.(service.id, tier.id)}
              className={`px-3 py-1 text-xs rounded-md transition-all duration-200 font-medium border whitespace-nowrap ${
                service.selectedTier === tier.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              {tier.name} ${tier.price}
            </button>
          ))}
        </div>
      )}

      {/* Right: Switch */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex flex-col items-end">
          <Switch
            checked={service.isActive}
            onCheckedChange={() => onToggle?.(service.id)}
          />
          <span className="text-xs text-muted-foreground mt-1">
            {service.isActive ? '已启用' : '已关闭'}
          </span>
        </div>
      </div>
    </div>
  )
}