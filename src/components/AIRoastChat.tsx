'use client'

import { useState, useEffect } from 'react'
import { AIService } from '@/types/ai-services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { generateRoastPrompt, getRandomProductivitySuggestion, getRandomMoneyRoast } from '@/lib/prompts'
import { APIKeySettings } from '@/components/APIKeySettings'

interface AIRoastChatProps {
  activeServices: AIService[]
  totalMonthlyCost: number
}

export function AIRoastChat({ activeServices, totalMonthlyCost }: AIRoastChatProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [roastMessage, setRoastMessage] = useState('')
  const [isRoasted, setIsRoasted] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [error, setError] = useState('')

  // 从本地存储加载API Key
  useEffect(() => {
    const savedApiKey = localStorage.getItem('deepseek_api_key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  const handleRoast = async () => {
    if (!apiKey) {
      setShowSettings(true)
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const serviceNames = activeServices.map(service => service.name)
      const prompt = generateRoastPrompt(serviceNames, totalMonthlyCost)
      
      // 调用 DeepSeek API
      const response = await fetch('/api/deepseek/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: apiKey,
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

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey)
    if (newApiKey) {
      setShowSettings(false)
    }
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-purple-800 dark:text-purple-200">
          <span className="flex items-center gap-2">
            🤖 AI毒舌助手
          </span>
          {!showSettings && (
            <Button
              onClick={() => setShowSettings(true)}
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700 text-xs"
            >
              {apiKey ? '⚙️' : '设置API'}
            </Button>
          )}
        </CardTitle>
        <p className="text-sm text-purple-600 dark:text-purple-400">
          根据你的{activeServices.length}个订阅(月费${totalMonthlyCost})获得专业AI嘲讽分析，让DeepSeek告诉你哪些钱花得最冤枉
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 简化的API设置 */}
        {showSettings && (
          <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
            <div className="flex gap-2 items-center">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="DeepSeek API Key (sk-...)"
                className="flex-1 text-sm"
              />
              <Button 
                onClick={() => {
                  if (apiKey) {
                    localStorage.setItem('deepseek_api_key', apiKey)
                    setShowSettings(false)
                  }
                }}
                size="sm"
                disabled={!apiKey}
              >
                保存
              </Button>
            </div>
          </div>
        )}

        {/* 主要的对话输出区域 */}
        <div className="min-h-[200px] bg-white/70 dark:bg-gray-800/70 rounded-lg border p-4">
          {roastMessage ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-xl">🤖</div>
                <div className="flex-1">
                  <div className="text-sm text-red-600 dark:text-red-400 font-medium mb-2">
                    AI毒舌助手：
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {roastMessage}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-sm">
                点击下方按钮，让AI来嘲讽你的订阅习惯
              </p>
              {!apiKey && (
                <p className="text-xs mt-2 text-red-500">
                  需要设置DeepSeek API Key
                </p>
              )}
            </div>
          )}
        </div>

        {/* 错误显示 */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 p-3 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* 底部操作区 */}
        <div className="flex gap-2 justify-center pt-2">
          <Button 
            onClick={handleRoast}
            disabled={isLoading || activeServices.length === 0 || !apiKey}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                AI思考中...
              </div>
            ) : (
              '开始嘲讽！'
            )}
          </Button>
          
          {roastMessage && (
            <Button 
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              清空
            </Button>
          )}
        </div>

        {/* 状态提示 */}
        <div className="text-center text-xs text-gray-500">
          {activeServices.length === 0 && "先启用一些服务，AI才有素材嘲讽你"}
          {activeServices.length > 0 && apiKey && `检测到 ${activeServices.length} 个订阅，月费 $${totalMonthlyCost}`}
        </div>
      </CardContent>
    </Card>
  )
}