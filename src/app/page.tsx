'use client'

import { useState, useEffect, useMemo } from 'react'
import { CostTrackingCard } from '@/components/CostTrackingCard'
import { SimpleCostTrackingCard } from '@/components/SimpleCostTrackingCard'
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
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isSimpleMode, setIsSimpleMode] = useState(false)
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

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    if (!mounted) return
    
    const handleScroll = () => {
      // Show button when scrolled down more than 300px
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
          <div className="flex items-center justify-center sm:justify-end mb-4">
            <div className="relative backdrop-blur-sm rounded-xl p-1 border border-blue-200/30 dark:border-blue-800/30 bg-blue-50/20 dark:bg-blue-900/20">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`relative px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    currency === 'USD'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  <span className="relative z-10">USD $</span>
                </button>
                <button
                  onClick={() => setCurrency('CNY')}
                  className={`relative px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    currency === 'CNY'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  <span className="relative z-10">CNY ¥</span>
                </button>
                <button
                  onClick={() => setCurrency('ZWL')}
                  className={`relative px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
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
        <div className="min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center mb-16 sm:mb-32 md:mb-60 px-4">
          <div className="text-center w-full">
            <div 
              className="hero-number-fit text-[3rem] xs:text-[3.5rem] sm:text-[5rem] md:text-[8rem] lg:text-[12rem] xl:text-[16rem] font-bold text-transparent leading-none tracking-tight mb-4 sm:mb-6 inline-block" 
              style={{
                background: 'linear-gradient(to right, rgb(234, 205, 163), rgb(214, 174, 123))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                whiteSpace: 'nowrap',
                wordBreak: 'keep-all',
                overflowWrap: 'normal'
              }}
            >
              <RollingNumber
                value={totalCosts.currentTotal}
                incrementPerSecond={totalCosts.perSecond}
                formatFn={(amount) => formatCurrency(amount, currency)}
                className="whitespace-nowrap"
              />
            </div>
            <div className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-8">
              <NewTypewriter />
            </div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600/50 dark:text-gray-400/50 font-medium mb-4 animate-fade-in-up px-4">
              实时更新你的数字员工今天花了多少
            </p>
            
            {/* 向下滚动提示箭头 */}
            <div className="flex justify-center mt-8 sm:mt-16">
              <div className="animate-bounce">
                <svg 
                  className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500 animate-pulse" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-6 gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
                AI订阅服务
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {activeServices.length}/{services.length} 服务已启用
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSimpleMode(!isSimpleMode)}
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                {isSimpleMode ? '详细模式' : '简洁模式'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => services.forEach(service => !service.isActive && toggleService(service.id))}
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                全部启用
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => services.forEach(service => service.isActive && toggleService(service.id))}
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                全部关闭
              </Button>
            </div>
          </div>
          
          {/* Group services by category */}
          <div className="space-y-8 sm:space-y-12">
            {Object.entries(groupedServices).map(([category, categoryServices]) => (
              <div key={category}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </h3>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {categoryServices.filter(s => s.isActive).length}/{categoryServices.length} 已启用
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {categoryServices.map((service) => (
                    isSimpleMode ? (
                      <SimpleCostTrackingCard
                        key={service.id}
                        service={service}
                        onToggle={toggleService}
                        onTierChange={changeTier}
                        className="h-full"
                      />
                    ) : (
                      <CostTrackingCard
                        key={service.id}
                        service={service}
                        onToggle={toggleService}
                        onTierChange={changeTier}
                        className="h-full"
                      />
                    )
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

        {/* 回到顶部按钮 - 右侧固定位置，移动端隐藏，滚动到顶部时隐藏 */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hidden sm:flex fixed bottom-8 right-8 items-center justify-center w-12 h-12 bg-gray-400 hover:bg-gray-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 animate-fade-in"
            aria-label="回到顶部"
          >
            <svg 
              className="w-6 h-6 transform group-hover:translate-y-[-2px] transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 10l7-7m0 0l7 7m-7-7v18" 
              />
            </svg>
          </button>
        )}

      </div>
      
      <Footer />
    </Dot>
  )
}