'use client'

import { useState, useCallback } from 'react'
import { AIService } from '@/types/ai-services'
import { aiServices as initialServices } from '@/lib/ai-services-data'

export function useServiceToggle() {
  const [services, setServices] = useState<AIService[]>(initialServices)

  const toggleService = useCallback((serviceId: string) => {
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === serviceId 
          ? { ...service, isActive: !service.isActive }
          : service
      )
    )
  }, [])

  const changeTier = useCallback((serviceId: string, tierId: string) => {
    setServices(prevServices => 
      prevServices.map(service => {
        if (service.id === serviceId && service.pricingTiers) {
          const selectedTier = service.pricingTiers.find(tier => tier.id === tierId)
          if (selectedTier) {
            return {
              ...service,
              selectedTier: tierId,
              subscriptionPrice: selectedTier.price
            }
          }
        }
        return service
      })
    )
  }, [])

  const activeServices = services.filter(service => service.isActive)

  return {
    services,
    activeServices,
    toggleService,
    changeTier
  }
}