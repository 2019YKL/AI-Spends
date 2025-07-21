'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button'
import { Download, Share2, X } from 'lucide-react'
import { AIService } from '@/types/ai-services'
import { formatCurrency } from '@/lib/cost-calculator'
import { IconRenderer } from '@/components/IconRenderer'

interface ShareImageGeneratorProps {
  totalCost: number
  monthlyBudget: number
  activeServices: AIService[]
  currency: 'USD' | 'CNY' | 'ZWL'
  roastMessage?: string
  roastTitle?: string
  username?: string
  onClose: () => void
}

export function ShareImageGenerator({
  totalCost,
  monthlyBudget,
  activeServices,
  currency,
  roastMessage,
  roastTitle,
  username,
  onClose
}: ShareImageGeneratorProps) {
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateImage = async () => {
    if (!shareCardRef.current) return
    
    setIsGenerating(true)
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        width: 800,
        height: 800,
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
      })
      
      // 下载图片
      const link = document.createElement('a')
      link.download = `aispends-${username || 'user'}-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('生成分享图失败:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const shareImage = async () => {
    if (!shareCardRef.current) return
    
    setIsGenerating(true)
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        width: 800,
        height: 800,
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
      })
      
      canvas.toBlob(async (blob) => {
        if (blob && navigator.share) {
          const file = new File([blob], 'aispends-share.png', { type: 'image/png' })
          try {
            await navigator.share({
              files: [file],
              title: 'AI支出锐评',
              text: `${username || '某人'} 的AI订阅消费锐评`
            })
          } catch (error) {
            console.error('分享失败:', error)
            generateImage()
          }
        } else {
          generateImage()
        }
      }, 'image/png')
    } catch (error) {
      console.error('生成分享图失败:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const todayDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">生成分享图</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 分享图预览 - 方形设计 */}
        <div className="mb-6 flex justify-center">
          <div 
            ref={shareCardRef}
            className="w-[400px] h-[400px] bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-6 relative overflow-hidden"
            style={{ fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif' }}
          >
            {/* 背景装饰 */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 right-10 w-32 h-32 bg-red-500 rounded-full"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-pink-500 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-rose-500 rounded-full"></div>
            </div>

            {/* 内容 */}
            <div className="relative z-10 h-full flex flex-col">
              {/* 头部 */}
              <div className="text-center mb-3">
                <div className="text-sm text-gray-600 mb-1">🤖 AI锐评 · AiSpends</div>
                <div className="text-xs text-gray-500">{todayDate}</div>
              </div>

              {/* 用户信息 */}
              <div className="text-center mb-3">
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {username || '匿名用户'}
                </div>
                <div className="text-xs text-gray-600">
                  今日消费 {formatCurrency(totalCost, currency)}
                </div>
              </div>

              {/* 锐评标题 */}
              {roastTitle && (
                <div className="text-center mb-3">
                  <div className="text-sm font-bold text-red-700 bg-red-100 rounded-lg px-3 py-2">
                    {roastTitle}
                  </div>
                </div>
              )}

              {/* 锐评内容 */}
              {roastMessage && (
                <div className="mb-3 flex-1">
                  <div className="bg-white/80 rounded-lg p-3 text-xs text-gray-800 leading-relaxed h-full overflow-hidden">
                    {roastMessage.length > 200 ? `${roastMessage.slice(0, 200)}...` : roastMessage}
                  </div>
                </div>
              )}

              {/* 服务图标 */}
              <div className="mt-auto">
                <div className="text-xs text-gray-600 mb-2 text-center">
                  当前订阅 ({activeServices.length}个)
                </div>
                <div className="flex flex-wrap justify-center gap-1">
                  {activeServices.slice(0, 8).map((service) => (
                    <div
                      key={service.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/60"
                      style={{ backgroundColor: `${service.color.replace('bg-', '')}20` }}
                    >
                      <IconRenderer name={service.icon} size={16} />
                    </div>
                  ))}
                  {activeServices.length > 8 && (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-200 text-xs font-bold text-gray-600">
                      +{activeServices.length - 8}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={generateImage}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? '生成中...' : '下载图片'}
          </Button>
          <Button 
            onClick={shareImage}
            disabled={isGenerating}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            分享
          </Button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          * 图片尺寸 800x800px，适合社交媒体分享
        </div>
      </div>
    </div>
  )
}