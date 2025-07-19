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

  const activeServices = services.filter(service => service.isActive)

  return {
    services,
    activeServices,
    toggleService
  }
}