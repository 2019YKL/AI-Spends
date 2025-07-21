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
        width: 900,
        height: 1200,
        scale: 1,
        backgroundColor: 'transparent',
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
        width: 900,
        height: 1200,
        scale: 1,
        backgroundColor: 'transparent',
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

        {/* 分享图预览 - 竖版设计 */}
        <div className="mb-6 flex justify-center">
          <div 
            ref={shareCardRef}
            className="relative overflow-hidden"
            style={{ 
              width: '450px', 
              height: '600px', 
              padding: '40px',
              backgroundImage: 'linear-gradient(60deg, #96deda 0%, #50c9c3 100%)',
              fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif' 
            }}
          >
            {/* 内部白色卡片 */}
            <div 
              className="w-full h-full bg-white relative overflow-hidden"
              style={{
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.08)'
              }}
            >

            {/* 内容 - Tweet Card 样式布局 */}
            <div className="relative z-10 h-full flex flex-col p-4">

              {/* 大金额显示 - 静态 */}
              <div className="mb-6">
                <div 
                  className="text-8xl font-bold leading-none"
                  style={{
                    background: 'linear-gradient(to right, rgb(234, 205, 163), rgb(214, 174, 123))',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  {formatCurrency(totalCost, currency).slice(0, -3)}
                </div>
              </div>

              {/* 锐评标题 */}
              {roastTitle && (
                <div className="mb-3">
                  <div className="text-lg font-bold text-black leading-tight">
                    {roastTitle}
                  </div>
                </div>
              )}

              {/* 锐评内容 */}
              {roastMessage && (
                <div className="flex-1 mb-4">
                  <div className="text-sm text-gray-800 leading-relaxed text-justify">
                    {roastMessage.length > 180 ? `${roastMessage.slice(0, 180)}...` : roastMessage}
                  </div>
                </div>
              )}

              {/* 底部 - 服务图标 */}
              <div className="mt-auto pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-2">
                  订阅服务 ({activeServices.length}个)
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeServices.map((service) => (
                    <div
                      key={service.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-200"
                    >
                      <IconRenderer name={service.icon} size={16} />
                    </div>
                  ))}
                </div>
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
          * 图片尺寸 900x1200px，适合社交媒体分享
        </div>
      </div>
    </div>
  )
}