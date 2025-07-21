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
      "p-3 sm:p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200",
      !service.isActive && "opacity-60 bg-gray-50 dark:bg-gray-900/50",
      className
    )}>
      {/* Mobile Layout - Stack vertically, Desktop Layout - All in one row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        
        {/* Left: Icon + Service Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0",
            service.color,
            !service.isActive && "grayscale"
          )}>
            <IconRenderer name={service.icon} size={20} className="sm:w-6 sm:h-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {service.name}
            </h3>
            <div className="mt-0.5 sm:hidden">
              <span className="text-xs text-gray-500 dark:text-gray-500">
                ${service.subscriptionPrice}/月
              </span>
            </div>
          </div>
        </div>

        {/* Center: Pricing Tiers (Desktop) / Bottom Row (Mobile) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {service.pricingTiers && service.pricingTiers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {service.pricingTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => service.isActive ? onTierChange?.(service.id, tier.id) : undefined}
                  disabled={!service.isActive}
                  className={`px-2 py-1 sm:px-3 sm:py-1 text-xs rounded-md transition-all duration-200 font-medium border whitespace-nowrap ${
                    !service.isActive 
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-60'
                      : service.selectedTier === tier.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  {tier.name} ${tier.price}
                </button>
              ))}
            </div>
          )}

          {/* Single plan indicator for desktop when no tiers */}
          {(!service.pricingTiers || service.pricingTiers.length === 0) && (
            <div className="hidden sm:block">
              <span className={`text-xs ${
                service.isActive 
                  ? 'text-gray-500 dark:text-gray-500' 
                  : 'text-gray-400 dark:text-gray-600 opacity-60'
              }`}>
                ${service.subscriptionPrice}/月
              </span>
            </div>
          )}

          {/* Right: Switch - Always visible on the right */}
          <div className="flex items-center flex-shrink-0">
            <Switch
              checked={service.isActive}
              onCheckedChange={() => onToggle?.(service.id)}
            />
          </div>
        </div>

        
        {/* Single plan indicator for desktop */}
        {service.isActive && (!service.pricingTiers || service.pricingTiers.length === 0) && (
          <div className="hidden sm:flex sm:items-center sm:min-w-[100px] sm:justify-center">
            <span className="text-xs text-gray-500 dark:text-gray-500">
              ${service.subscriptionPrice}/月
            </span>
          </div>
        )}
      </div>
    </div>
  )
}