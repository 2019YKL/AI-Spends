import { AIService, CostCalculation } from '@/types/ai-services'

export function calculateRealTimeCost(service: AIService, currentTime: Date = new Date()): CostCalculation {
  // Calculate from today 00:00:00 instead of billing start date
  const todayStart = new Date(currentTime)
  todayStart.setHours(0, 0, 0, 0)
  
  // Calculate time elapsed since today started
  const timeElapsedMs = currentTime.getTime() - todayStart.getTime()
  
  // Convert to different time units
  const totalSeconds = Math.max(0, Math.floor(timeElapsedMs / 1000))
  const totalMinutes = Math.floor(totalSeconds / 60)
  const totalHours = Math.floor(totalMinutes / 60)
  const totalDays = Math.floor(totalHours / 24)
  
  const remainingHours = totalHours % 24
  const remainingMinutes = totalMinutes % 60
  const remainingSeconds = totalSeconds % 60
  
  // Calculate billing cycle duration in seconds
  const billingCycleSeconds = service.billingCycle * 24 * 60 * 60
  
  // Calculate cost rates
  const costPerSecond = service.subscriptionPrice / billingCycleSeconds
  const costPerMinute = costPerSecond * 60
  const costPerHour = costPerMinute * 60
  const costPerDay = costPerHour * 24
  
  // Calculate current consumed cost (today's consumption)
  const currentCost = Math.min(totalSeconds * costPerSecond, costPerDay)
  
  // Calculate percentage of daily usage
  const dailySeconds = 24 * 60 * 60
  const percentageUsed = Math.min((totalSeconds / dailySeconds) * 100, 100)
  
  return {
    service: service.name,
    currentCost,
    totalMonthlyBudget: service.subscriptionPrice,
    costPerSecond,
    costPerMinute,
    costPerHour,
    costPerDay,
    timeElapsed: {
      days: totalDays,
      hours: remainingHours,
      minutes: remainingMinutes,
      seconds: remainingSeconds
    },
    percentageUsed
  }
}

export function formatCurrency(amount: number, currency: 'USD' | 'CNY' | 'ZWL' = 'USD'): string {
  const exchangeRates = {
    CNY: 7.3, // 1 USD = 7.3 CNY
    ZWL: 2700000000000, // 1 USD = 2.7 trillion ZWL (approximate, highly volatile)
  }
  
  if (currency === 'CNY') {
    const cnyAmount = amount * exchangeRates.CNY
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(cnyAmount)
  }
  
  if (currency === 'ZWL') {
    const zwlAmount = amount * exchangeRates.ZWL
    // For very large numbers, use scientific notation or simplified format
    if (zwlAmount >= 1000000000000) {
      return `Z$${(zwlAmount / 1000000000000).toFixed(2)}T`
    } else if (zwlAmount >= 1000000000) {
      return `Z$${(zwlAmount / 1000000000).toFixed(2)}B`
    } else if (zwlAmount >= 1000000) {
      return `Z$${(zwlAmount / 1000000).toFixed(2)}M`
    }
    return `Z$${zwlAmount.toFixed(0)}`
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount)
}

export function formatCurrencyPrecise(amount: number, currency: 'USD' | 'CNY' | 'ZWL' = 'USD'): string {
  const exchangeRates = {
    CNY: 7.3,
    ZWL: 2700000000000,
  }
  
  if (currency === 'CNY') {
    const cnyAmount = amount * exchangeRates.CNY
    if (cnyAmount < 0.01) {
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
        minimumFractionDigits: 6,
        maximumFractionDigits: 8,
      }).format(cnyAmount)
    }
    return formatCurrency(amount, currency)
  }
  
  if (currency === 'ZWL') {
    const zwlAmount = amount * exchangeRates.ZWL
    if (zwlAmount >= 1000000000000) {
      return `Z$${(zwlAmount / 1000000000000).toFixed(6)}T`
    } else if (zwlAmount >= 1000000000) {
      return `Z$${(zwlAmount / 1000000000).toFixed(6)}B`
    } else if (zwlAmount >= 1000000) {
      return `Z$${(zwlAmount / 1000000).toFixed(6)}M`
    }
    return `Z$${zwlAmount.toFixed(2)}`
  }
  
  if (amount < 0.01) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 8,
    }).format(amount)
  }
  return formatCurrency(amount, currency)
}

export function formatTimeElapsed(timeElapsed: { days: number, hours: number, minutes: number, seconds: number }): string {
  const { days, hours, minutes, seconds } = timeElapsed
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}