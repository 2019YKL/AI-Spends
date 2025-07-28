'use client'

import { useRef, useState } from 'react'
import * as htmlToImage from 'html-to-image'
import { Button } from '@/components/ui/button'
import { Download, Share2, X, Twitter } from 'lucide-react'
import { AIService } from '@/types/ai-services'
import { formatCurrency } from '@/lib/cost-calculator'
import { IconRenderer } from '@/components/IconRenderer'

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

interface DesktopShareImageGeneratorProps {
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

export function DesktopShareImageGenerator({
  totalCost,
  activeServices,
  currency,
  roastMessage,
  roastTitle,
  username,
  onClose
}: DesktopShareImageGeneratorProps) {
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState(0)

  const generateImage = async () => {
    if (!shareCardRef.current) return
    
    setIsGenerating(true)
    try {
      const dataUrl = await htmlToImage.toPng(shareCardRef.current, {
        width: 450,
        height: 600,
        backgroundColor: 'transparent',
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      })
      
      // 下载图片
      const link = document.createElement('a')
      link.download = `aispends-desktop-${username || 'user'}-${new Date().toISOString().split('T')[0]}.png`
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">生成分享图 (桌面版)</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：分享图预览 */}
          <div className="flex justify-center">
            <div 
              ref={shareCardRef}
              className="relative overflow-hidden w-[450px] h-[600px]"
              style={{ 
                padding: '32px',
                backgroundImage: backgroundOptions[selectedBackground].gradient,
                fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif'
              }}
            >
              {/* 内部白色卡片 */}
              <div 
                className="w-full h-full bg-white relative overflow-hidden"
                style={{
                  borderRadius: '20px',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)',
                  backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              >
                {/* 内容 */}
                <div className="relative z-10 h-full flex flex-col p-8">
                  
                  {/* 锐评标题 */}
                  {roastTitle && (
                    <div className="mb-4">
                      <div className="font-bold text-gray-800 leading-tight" style={{ fontSize: '16px' }}>
                        {roastTitle.length > 60 ? `${roastTitle.slice(0, 60)}...` : roastTitle}
                      </div>
                    </div>
                  )}

                  {/* 锐评内容 */}
                  {roastMessage && (
                    <div className="mb-6 flex-shrink-0">
                      <div 
                        className="text-gray-800 leading-relaxed text-justify overflow-hidden"
                        style={{ 
                          fontSize: '13px',
                          display: '-webkit-box',
                          WebkitLineClamp: 6,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: '1.5'
                        }}
                      >
                        {roastMessage.length > 240 ? `${roastMessage.slice(0, 240)}...` : roastMessage}
                      </div>
                    </div>
                  )}

                  {/* 锐评下分割线 */}
                  {(roastTitle || roastMessage) && (
                    <div className="mb-6">
                      <hr className="border-gray-200" />
                    </div>
                  )}

                  {/* 中间金额显示 */}
                  <div className="flex-1 flex flex-col justify-center min-h-[120px]">
                    <div className="mb-4 text-center">
                      <div 
                        className="font-bold leading-none"
                        style={{
                          fontSize: '100px',
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
                    <div className="mb-3 text-center">
                      <div className="text-gray-500" style={{ fontSize: '16px' }}>
                        今天，你的数字员工花了这么多诶
                      </div>
                    </div>
                  </div>

                  {/* 底部固定区域 */}
                  <div className="flex-shrink-0">
                    {/* 分割线 */}
                    <div className="mb-3">
                      <hr className="border-gray-200" />
                    </div>

                    {/* 服务标题 */}
                    <div className="mb-3">
                      <div className="text-gray-500 font-bold" style={{ fontSize: '12px' }}>
                        订阅服务 ({activeServices.length}个)
                      </div>
                    </div>

                    {/* 服务图标 - 桌面端优化布局 */}
                    <div className="grid grid-cols-8 gap-2 justify-items-center">
                      {(() => {
                        if (activeServices.length <= 16) {
                          // 20个或以下，显示全部
                          return activeServices.map((service) => (
                            <div
                              key={service.id}
                              className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-200"
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
                                  className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-200"
                                >
                                  <IconRenderer name={service.icon} size={16} />
                                </div>
                              ))}
                              <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-100 font-medium text-gray-600" style={{ fontSize: '10px' }}>
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

          {/* 右侧：控制面板 */}
          <div className="space-y-8">
            {/* 背景色选择器 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">选择背景</h3>
              <div className="grid grid-cols-3 gap-4">
                {backgroundOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedBackground(index)}
                    className={`w-full h-16 rounded-lg border-4 transition-all ${
                      selectedBackground === index 
                        ? 'border-blue-500 scale-105' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundImage: option.gradient }}
                    title={option.name}
                  >
                    <span className="sr-only">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-4">
              <Button 
                onClick={generateImage}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-3 h-12 text-base"
              >
                <Download className="w-5 h-5" />
                {isGenerating ? '生成中...' : '下载高清图片'}
              </Button>
              <Button 
                onClick={shareToX}
                variant="outline"
                className="w-full flex items-center justify-center gap-3 h-12 text-base"
              >
                <Twitter className="w-5 h-5" />
                分享到 X
              </Button>
            </div>

            {/* 提示信息 */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">桌面版特性</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 更大的显示区域，信息更丰富</li>
                <li>• 高分辨率输出 (1200x1600)</li>
                <li>• 支持更多服务图标展示</li>
                <li>• 优化的字体和间距</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}