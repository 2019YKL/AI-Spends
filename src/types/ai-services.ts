export interface PricingTier {
  id: string
  name: string
  price: number
}

export interface AIService {
  id: string
  name: string
  icon: string
  color: string
  subscriptionPrice: number // monthly price in USD
  billingStartDate: string // ISO date string when billing cycle started
  billingCycle: number // days in billing cycle (usually 30)
  isActive: boolean // whether the subscription is currently active
  category: 'ai-chat' | 'ai-image' | 'code-editor' | 'productivity' | 'other'
  pricingTiers?: PricingTier[] // optional pricing tiers for services with multiple plans
  selectedTier?: string // currently selected tier id
}

export interface CostCalculation {
  service: string
  currentCost: number // current consumed cost
  totalMonthlyBudget: number // total monthly subscription cost
  costPerSecond: number
  costPerMinute: number
  costPerHour: number
  costPerDay: number
  timeElapsed: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
  percentageUsed: number
}