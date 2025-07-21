'use client'

import { useRef, useState } from 'react'
import * as htmlToImage from 'html-to-image'
import { Button } from '@/components/ui/button'
import { Download, Share2, X, Twitter } from 'lucide-react'
import { AIService } from '@/types/ai-services'
import { formatCurrency } from '@/lib/cost-calculator'

// 格式化货币显示两位小数
const formatCurrencyTwoDecimals = (amount: number, currency: 'USD' | 'CNY' | 'ZWL' = 'USD'): string => {
  const exchangeRates = {
    CNY: 7.3,
    ZWL: 2700000000000,
  }
  
  if (currency === 'CNY') {
    const cnyAmount = amount * exchangeRates.CNY
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cnyAmount)
  }
  
  if (currency === 'ZWL') {
    const zwlAmount = amount * exchangeRates.ZWL
    if (zwlAmount >= 1000000000000) {
      return `Z$${(zwlAmount / 1000000000000).toFixed(2)}T`
    } else if (zwlAmount >= 1000000000) {
      return `Z$${(zwlAmount / 1000000000).toFixed(2)}B`
    } else if (zwlAmount >= 1000000) {
      return `Z$${(zwlAmount / 1000000).toFixed(2)}M`
    }
    return `Z$${zwlAmount.toFixed(2)}`
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
import { IconRenderer } from '@/components/IconRenderer'

interface ShareImageGeneratorProps {
  totalCost: number
  activeServices: AIService[]
  currency: 'USD' | 'CNY' | 'ZWL'
  roastMessage?: string
  roastTitle?: string
  username?: string
  onClose: () => void
}

const backgroundOptions = [
  { name: '青绿渐变', gradient: 'linear-gradient(60deg, #96deda 0%, #50c9c3 100%)' },
  { name: '粉色渐变', gradient: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)' },
  { name: '薄荷渐变', gradient: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)' },
  { name: '天空渐变', gradient: 'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)' },
  { name: '绿色渐变', gradient: 'linear-gradient(to top, #0ba360 0%, #3cba92 100%)' },
  { name: '蓝色渐变', gradient: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)' }
]

export function ShareImageGenerator({
  totalCost,
  activeServices,
  currency,
  roastMessage,
  roastTitle,
  username,
  onClose
}: ShareImageGeneratorProps) {
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState(0)

  const generateImage = async () => {
    if (!shareCardRef.current) return
    
    setIsGenerating(true)
    try {
      const dataUrl = await htmlToImage.toPng(shareCardRef.current, {
        width: 900,
        height: 1200,
        backgroundColor: 'transparent',
        pixelRatio: 1,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left'
        }
      })
      
      // 下载图片
      const link = document.createElement('a')
      link.download = `aispends-${username || 'user'}-${new Date().toISOString().split('T')[0]}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('生成分享图失败:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const shareToX = () => {
    window.open('https://x.com', '_blank')
  }


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">生成分享图</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 分享图预览 - 竖版设计 */}
        <div className="mb-4 sm:mb-6 flex justify-center">
          <div className="relative max-w-full overflow-hidden">
            <div 
              ref={shareCardRef}
              className="relative overflow-hidden mx-auto"
              style={{ 
                width: '450px', 
                height: '600px', 
                padding: '40px',
                backgroundImage: backgroundOptions[selectedBackground].gradient,
                fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
                transform: 'scale(min(calc(100vw - 80px) / 450px, 1))',
                transformOrigin: 'center top'
              }}
            >
            {/* 内部白色卡片 */}
            <div 
              className="w-full h-full bg-white relative overflow-hidden"
              style={{
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.08)',
                backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            >

            {/* 内容 - Tweet Card 样式布局 */}
            <div className="relative z-10 h-full flex flex-col p-4">

              {/* 锐评标题 */}
              {roastTitle && (
                <div className="mb-3">
                  <div className="text-lg font-bold text-gray-800 leading-tight">
                    {roastTitle}
                  </div>
                </div>
              )}

              {/* 锐评内容 */}
              {roastMessage && (
                <div className="mb-3">
                  <div className="text-sm text-gray-800 leading-relaxed text-justify">
                    {roastMessage.length > 180 ? `${roastMessage.slice(0, 180)}...` : roastMessage}
                  </div>
                </div>
              )}

              {/* 锐评下分割线 */}
              {(roastTitle || roastMessage) && (
                <div className="mb-3">
                  <hr className="border-gray-100" />
                </div>
              )}

              {/* 中间金额显示 */}
              <div className="mb-3 flex justify-center">
                <div 
                  className="text-8xl font-bold leading-none"
                  style={{
                    background: 'linear-gradient(to right, rgb(234, 205, 163), rgb(214, 174, 123))',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  {formatCurrencyTwoDecimals(totalCost, currency)}
                </div>
              </div>

              {/* 金额描述文字 */}
              <div className="mb-3 flex justify-end">
                <div className="text-xs text-gray-500">
                  今天，你的数字员工花了这么多诶
                </div>
              </div>

              {/* 金额描述下分割线 */}
              <div className="mb-3">
                <hr className="border-gray-100" />
              </div>

              {/* 服务标题 */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 font-bold">
                  订阅服务 ({activeServices.length}个)
                </div>
              </div>

              {/* 服务图标 */}
              <div>
                <div className="grid grid-cols-8 gap-x-2 gap-y-2 justify-items-center">
                  {(() => {
                    if (activeServices.length <= 16) {
                      // 16个或以下，显示全部
                      return activeServices.map((service) => (
                        <div
                          key={service.id}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-200"
                        >
                          <IconRenderer name={service.icon} size={16} />
                        </div>
                      ));
                    } else {
                      // 超过16个，显示前15个 + "+N"
                      const displayServices = activeServices.slice(0, 15);
                      const remainingCount = activeServices.length - 15;
                      
                      return (
                        <>
                          {displayServices.map((service) => (
                            <div
                              key={service.id}
                              className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-200"
                            >
                              <IconRenderer name={service.icon} size={16} />
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-xs font-medium text-gray-600">
                            +{remainingCount}
                          </div>
                        </>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
            </div>
          </div>
          </div>
        </div>

        {/* 背景色选择器 */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {backgroundOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedBackground(index)}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all ${
                  selectedBackground === index 
                    ? 'border-blue-500 scale-110' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundImage: option.gradient }}
                title={option.name}
              />
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={generateImage}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? '生成中...' : '下载图片'}
          </Button>
          <Button 
            onClick={shareToX}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Twitter className="w-4 h-4" />
            分享到 X
          </Button>
        </div>

      </div>
    </div>
  )
}