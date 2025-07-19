import { AIService, CostCalculation } from '@/types/ai-services'

export function calculateRealTimeCost(service: AIService, currentTime: Date = new Date()): CostCalculation {
  const billingStartDate = new Date(service.billingStartDate)
  
  // Calculate time elapsed since billing started
  const timeElapsedMs = currentTime.getTime() - billingStartDate.getTime()
  
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
  
  // Calculate current consumed cost
  const currentCost = Math.min(totalSeconds * costPerSecond, service.subscriptionPrice)
  
  // Calculate percentage of billing cycle used
  const percentageUsed = Math.min((totalSeconds / billingCycleSeconds) * 100, 100)
  
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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount)
}

export function formatCurrencyPrecise(amount: number): string {
  if (amount < 0.01) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 8,
    }).format(amount)
  }
  return formatCurrency(amount)
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