'use client'

import { useState, useEffect, useMemo } from 'react'
import { CostTrackingCard } from '@/components/CostTrackingCard'
import { calculateRealTimeCost, formatCurrency, formatCurrencyPrecise } from '@/lib/cost-calculator'
import { SmoothNumber } from '@/components/SmoothNumber'
import { RollingNumber } from '@/components/RollingNumber'
import { ScaleEffect } from '@/components/ScaleEffect'
import { useServiceToggle } from '@/hooks/useServiceToggle'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AIRoastChat } from '@/components/AIRoastChat'
import { Dot } from '@/components/DotBackground'
import { Footer } from '@/components/Footer'
import { NewTypewriter } from '@/components/NewTypewriter'

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [currency, setCurrency] = useState<'USD' | 'CNY' | 'ZWL'>('USD')
  const { services, activeServices, toggleService, changeTier } = useServiceToggle()
  // Check if component is mounted to avoid hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update time every second
  useEffect(() => {
    if (!mounted) return
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [mounted])

  // Calculate total costs (only for active services)
  const totalCosts = useMemo(() => {
    if (!mounted) {
      return {
        currentTotal: 0,
        monthlyBudget: 0,
        perSecond: 0,
        perMinute: 0,
        perHour: 0,
        perDay: 0
      }
    }
    
    const costs = activeServices.map(service => calculateRealTimeCost(service, currentTime))
    const currentTotal = costs.reduce((sum, cost) => sum + cost.currentCost, 0)
    const monthlyBudget = costs.reduce((sum, cost) => sum + cost.totalMonthlyBudget, 0)
    const perSecond = costs.reduce((sum, cost) => sum + cost.costPerSecond, 0)
    const perMinute = costs.reduce((sum, cost) => sum + cost.costPerMinute, 0)
    const perHour = costs.reduce((sum, cost) => sum + cost.costPerHour, 0)
    const perDay = costs.reduce((sum, cost) => sum + cost.costPerDay, 0)

    return { currentTotal, monthlyBudget, perSecond, perMinute, perHour, perDay }
  }, [currentTime, activeServices, mounted])

  // Calculate today's time progress
  const getTodayProgress = () => {
    if (!mounted) return 0
    const now = new Date()
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    const elapsed = now.getTime() - todayStart.getTime()
    const totalDayMs = 24 * 60 * 60 * 1000
    return Math.min((elapsed / totalDayMs) * 100, 100)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Group services by category
  const categoryLabels = {
    'ai-chat': '🤖 AI对话助手',
    'code-editor': '💻 编程开发工具', 
    'ai-image': '🎨 AI绘图/视频',
    'productivity': '⚡ 生产力工具'
  }

  const groupedServices = services.reduce((groups, service) => {
    const category = service.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(service)
    return groups
  }, {} as Record<string, typeof services>)

  return (
    <Dot 
      color="rgba(59, 130, 246, 0.15)"
      size={1}
      spacing={30}
      gradient={true}
      gradientWidth={150}
      gradientHeight={150}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
            </div>
            <div className="relative backdrop-blur-sm rounded-xl p-1 border border-blue-200/30 dark:border-blue-800/30 bg-blue-50/20 dark:bg-blue-900/20">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    currency === 'USD'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  <span className="relative z-10">USD $</span>
                </button>
                <button
                  onClick={() => setCurrency('CNY')}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    currency === 'CNY'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  <span className="relative z-10">CNY ¥</span>
                </button>
                <button
                  onClick={() => setCurrency('ZWL')}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    currency === 'ZWL'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  <span className="relative z-10">ZWL Z$</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section - Hero Card */}
        <div className="h-[70vh] flex items-center justify-center mb-60">
          <div className="text-center">
            <div className="text-[10rem] md:text-[14rem] lg:text-[18rem] font-bold text-transparent leading-none tracking-tight mb-6" style={{
              background: 'linear-gradient(to right, rgb(234, 205, 163), rgb(214, 174, 123))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text'
            }}>
              <RollingNumber
                value={totalCosts.currentTotal}
                incrementPerSecond={totalCosts.perSecond}
                formatFn={(amount) => formatCurrency(amount, currency)}
              />
            </div>
            <div className="text-8xl font-bold text-slate-900 dark:text-slate-100 mb-8">
              <NewTypewriter />
            </div>
            <p className="text-xl md:text-2xl text-gray-600/50 dark:text-gray-400/50 font-medium mb-4 animate-fade-in-up">
              实时刷新你的数字员工每天有多烧钱
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                AI订阅服务
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {activeServices.length}/{services.length} 服务已启用
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => services.forEach(service => !service.isActive && toggleService(service.id))}
              >
                全部启用
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => services.forEach(service => service.isActive && toggleService(service.id))}
              >
                全部关闭
              </Button>
            </div>
          </div>
          
          {/* Group services by category */}
          <div className="space-y-12">
            {Object.entries(groupedServices).map(([category, categoryServices]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {categoryServices.filter(s => s.isActive).length}/{categoryServices.length} 已启用
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryServices.map((service) => (
                    <CostTrackingCard
                      key={service.id}
                      service={service}
                      onToggle={toggleService}
                      onTierChange={changeTier}
                      className="h-full"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Roast Chat */}
        <div className="mt-8">
          <AIRoastChat 
            activeServices={activeServices}
            totalMonthlyCost={totalCosts.monthlyBudget}
          />
        </div>

      </div>
      
      <Footer />
    </Dot>
  )
}