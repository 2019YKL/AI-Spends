'use client'

import { useState, useEffect } from 'react'
import { CostTrackingCard } from '@/components/CostTrackingCard'
import { calculateRealTimeCost, formatCurrency, formatCurrencyPrecise } from '@/lib/cost-calculator'
import { SmoothNumber } from '@/components/SmoothNumber'
import { useServiceToggle } from '@/hooks/useServiceToggle'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { services, activeServices, toggleService } = useServiceToggle()
  const [totalCosts, setTotalCosts] = useState({
    currentTotal: 0,
    monthlyBudget: 0,
    perSecond: 0,
    perMinute: 0,
    perHour: 0,
    perDay: 0
  })

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate total costs (only for active services)
  useEffect(() => {
    const costs = activeServices.map(service => calculateRealTimeCost(service, currentTime))
    const currentTotal = costs.reduce((sum, cost) => sum + cost.currentCost, 0)
    const monthlyBudget = costs.reduce((sum, cost) => sum + cost.totalMonthlyBudget, 0)
    const perSecond = costs.reduce((sum, cost) => sum + cost.costPerSecond, 0)
    const perMinute = costs.reduce((sum, cost) => sum + cost.costPerMinute, 0)
    const perHour = costs.reduce((sum, cost) => sum + cost.costPerHour, 0)
    const perDay = costs.reduce((sum, cost) => sum + cost.costPerDay, 0)

    setTotalCosts({ currentTotal, monthlyBudget, perSecond, perMinute, perHour, perDay })
  }, [currentTime, activeServices])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                AutoBurn
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">
                AI订阅实时费用追踪器
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-bold text-slate-900 dark:text-slate-100">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section - Burning Cost */}
        <div className="mb-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 border-0 shadow-2xl fire-glow-static rounded-lg hover:scale-[1.01] transition-all duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/10 to-yellow-500/20" />
            
            {/* Fire Glow Effect */}
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-red-500/30 rounded-full blur-3xl animate-pulse" />
            
            <div className="relative z-10 p-12 text-center">
              {/* Title */}
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-light text-orange-100/90 mb-2">🔥 实时消费燃烧</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 mx-auto rounded-full" />
              </div>
              
              {/* Main Amount */}
              <div className="mb-8">
                <div className="text-6xl md:text-8xl font-bold text-white font-mono tracking-tight number-fire-static hover:scale-105 transition-transform duration-300">
                  <SmoothNumber
                    value={totalCosts.currentTotal}
                    incrementPerSecond={totalCosts.perSecond}
                    formatFn={formatCurrency}
                    className="text-white drop-shadow-lg"
                  />
                </div>
                <div className="text-lg text-orange-200/80 mt-2">
                  / {formatCurrency(totalCosts.monthlyBudget)} 月度预算
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8 max-w-2xl mx-auto">
                <div className="w-full bg-gray-800/50 rounded-full h-4 backdrop-blur-sm border border-orange-500/30">
                  <div 
                    className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 h-4 rounded-full shadow-lg relative overflow-hidden transition-all duration-1000"
                    style={{ width: `${Math.min((totalCosts.currentTotal / totalCosts.monthlyBudget) * 100, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-orange-300/80 mt-2">
                  <span>0%</span>
                  <span className="font-bold text-orange-200">{((totalCosts.currentTotal / totalCosts.monthlyBudget) * 100).toFixed(1)}%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Rate Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { value: formatCurrencyPrecise(totalCosts.perSecond), label: "每秒", color: "text-red-300" },
                  { value: formatCurrencyPrecise(totalCosts.perMinute), label: "每分钟", color: "text-orange-300" },
                  { value: formatCurrency(totalCosts.perHour), label: "每小时", color: "text-yellow-300" },
                  { value: formatCurrency(totalCosts.perDay), label: "每天", color: "text-red-400" }
                ].map((stat, index) => (
                  <div 
                    key={stat.label}
                    className="text-center hover:scale-110 transition-transform duration-200"
                  >
                    <div className={`text-2xl font-bold ${stat.color} font-mono`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-orange-200/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                开发工具订阅
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <CostTrackingCard
                key={service.id}
                service={service}
                onToggle={toggleService}
                className="h-full"
              />
            ))}
          </div>
        </div>

        {/* Statistics Summary */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
              📊 服务统计总览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {activeServices.length}/{services.length}
                </div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">活跃服务</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totalCosts.monthlyBudget - totalCosts.currentTotal)}
                </div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">剩余预算</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {totalCosts.monthlyBudget > 0 ? Math.round((totalCosts.currentTotal / totalCosts.monthlyBudget) * 100) : 0}%
                </div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">预算使用率</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totalCosts.perDay * 30)}
                </div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">月度预估</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}