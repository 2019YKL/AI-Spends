'use client'

import { useState } from 'react'
import { AIService } from '@/types/ai-services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { generateRoastPrompt } from '@/lib/prompts'
import { Input } from '@/components/ui/input'
import { IconRenderer } from '@/components/IconRenderer'
import { ImageIcon, Send } from 'lucide-react'

interface AIRoastChatProps {
  activeServices: AIService[]
  totalMonthlyCost: number
}

export function AIRoastChat({ activeServices, totalMonthlyCost }: AIRoastChatProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [roastMessage, setRoastMessage] = useState('')
  const [isRoasted, setIsRoasted] = useState(false)
  const [error, setError] = useState('')

  const handleRoast = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const serviceNames = activeServices.map(service => service.name)
      const serviceCategories = activeServices.reduce((acc, service) => {
        acc[service.name] = service.category
        return acc
      }, {} as Record<string, string>)
      const prompt = generateRoastPrompt(serviceNames, totalMonthlyCost, serviceCategories)
      
      // 调用 DeepSeek API
      const response = await fetch('/api/deepseek/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'API调用失败')
      }

      const data = await response.json()
      setRoastMessage(data.message)
      setIsRoasted(true)
      
    } catch (error) {
      console.error('DeepSeek API error:', error)
      setError(error instanceof Error ? error.message : 'AI罢工了，可能是被你的订阅账单吓到了... 🤯')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setRoastMessage('')
    setIsRoasted(false)
    setError('')
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-blue-800 dark:text-blue-200">
          <span className="flex items-center gap-2">
            🤖 AI 锐评你的订阅情况
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 当前订阅服务 */}
        {activeServices.length > 0 && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">
                当前订阅 ({activeServices.length}个)
              </h3>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                月费 ${totalMonthlyCost}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-blue-200 dark:border-blue-700"
                >
                  <IconRenderer name={service.icon} size={20} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {service.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ${service.subscriptionPrice}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 输入框行 */}
        <div className="flex mb-3">
          <Input
            placeholder={activeServices.length > 0 ? 
              `根据你的${activeServices.length}个订阅(月费$${totalMonthlyCost})获得专业的嘲讽输出，让AI告诉你自己是一条什么杂鱼` : 
              "请先启用一些订阅服务"}
            className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            disabled
          />
        </div>

        {/* 按钮行 - 移动端优先 */}
        <div className="flex gap-2">
          <Button 
            onClick={handleRoast}
            disabled={isLoading || activeServices.length === 0}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">测测我的水平</span>
                <span className="sm:hidden">测水平</span>
              </>
            )}
          </Button>
          <Button 
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 flex items-center justify-center gap-2"
            disabled={activeServices.length === 0}
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">分享图片</span>
            <span className="sm:hidden">分享</span>
          </Button>
        </div>

        {/* 错误显示 */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 p-3 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* 对话输出区域 */}
        {roastMessage && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                AI
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
                  {roastMessage}
                </div>
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  )
}