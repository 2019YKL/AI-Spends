'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { AIService } from '@/types/ai-services'
import { aiServices as initialServices } from '@/lib/ai-services-data'

export function useServiceToggle() {
  const [services, setServices] = useState<AIService[]>(initialServices)
  const [isLoaded, setIsLoaded] = useState(false)

  // 从 localStorage 加载状态
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const savedState = localStorage.getItem('aiSpends_serviceState')
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        
        // 合并保存的状态和默认服务配置
        const updatedServices = initialServices.map(service => {
          const savedService = parsedState.find((s: any) => s.id === service.id)
          if (savedService) {
            return {
              ...service,
              isActive: savedService.isActive,
              selectedTier: savedService.selectedTier || service.selectedTier,
              subscriptionPrice: savedService.subscriptionPrice || service.subscriptionPrice
            }
          }
          return service
        })
        
        setServices(updatedServices)
      }
    } catch (error) {
      console.error('Failed to load service state from localStorage:', error)
    }
    
    setIsLoaded(true)
  }, [])

  // 保存状态到 localStorage
  const saveToLocalStorage = useCallback((updatedServices: AIService[]) => {
    if (typeof window === 'undefined' || !isLoaded) return
    
    try {
      const stateToSave = updatedServices.map(service => ({
        id: service.id,
        isActive: service.isActive,
        selectedTier: service.selectedTier,
        subscriptionPrice: service.subscriptionPrice
      }))
      localStorage.setItem('aiSpends_serviceState', JSON.stringify(stateToSave))
    } catch (error) {
      console.error('Failed to save service state to localStorage:', error)
    }
  }, [isLoaded])

  const toggleService = useCallback((serviceId: string) => {
    setServices(prevServices => {
      const updatedServices = prevServices.map(service => 
        service.id === serviceId 
          ? { ...service, isActive: !service.isActive }
          : service
      )
      saveToLocalStorage(updatedServices)
      return updatedServices
    })
  }, [saveToLocalStorage])

  const changeTier = useCallback((serviceId: string, tierId: string) => {
    setServices(prevServices => {
      const updatedServices = prevServices.map(service => {
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
      saveToLocalStorage(updatedServices)
      return updatedServices
    })
  }, [saveToLocalStorage])

  const activeServices = useMemo(() => 
    services.filter(service => service.isActive), 
    [services]
  )

  return {
    services,
    activeServices,
    toggleService,
    changeTier
  }
}