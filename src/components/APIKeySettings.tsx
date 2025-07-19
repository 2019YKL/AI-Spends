'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon, CheckIcon, XIcon } from 'lucide-react'

interface APIKeySettingsProps {
  onApiKeyChange: (apiKey: string) => void
}

export function APIKeySettings({ onApiKeyChange }: APIKeySettingsProps) {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  // 从本地存储加载API Key
  useEffect(() => {
    const savedApiKey = localStorage.getItem('deepseek_api_key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
      onApiKeyChange(savedApiKey)
      setIsValid(true)
    }
  }, [onApiKeyChange])

  const validateApiKey = async (key: string) => {
    if (!key || !key.startsWith('sk-')) {
      setIsValid(false)
      return false
    }

    setIsValidating(true)
    try {
      // 测试API Key是否有效
      const response = await fetch('/api/deepseek/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key }),
      })

      const isValidKey = response.ok
      setIsValid(isValidKey)
      return isValidKey
    } catch (error) {
      console.error('API Key validation error:', error)
      setIsValid(false)
      return false
    } finally {
      setIsValidating(false)
    }
  }

  const handleSaveApiKey = async () => {
    const trimmedKey = apiKey.trim()
    if (!trimmedKey) {
      setIsValid(false)
      return
    }

    const isValidKey = await validateApiKey(trimmedKey)
    if (isValidKey) {
      localStorage.setItem('deepseek_api_key', trimmedKey)
      onApiKeyChange(trimmedKey)
    }
  }

  const handleClearApiKey = () => {
    setApiKey('')
    setIsValid(null)
    localStorage.removeItem('deepseek_api_key')
    onApiKeyChange('')
  }

  const getStatusIcon = () => {
    if (isValidating) {
      return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    }
    if (isValid === true) {
      return <CheckIcon className="w-4 h-4 text-green-500" />
    }
    if (isValid === false) {
      return <XIcon className="w-4 h-4 text-red-500" />
    }
    return null
  }

  const getStatusMessage = () => {
    if (isValidating) return '验证中...'
    if (isValid === true) return 'API Key 有效'
    if (isValid === false) return 'API Key 无效或格式错误'
    return '请输入你的 DeepSeek API Key'
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
          🔑 DeepSeek API 配置
        </CardTitle>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          配置你的 DeepSeek API Key 来启用 AI 嘲讽功能
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-sm font-medium">
            API Key
          </Label>
          <div className="relative">
            <Input
              id="api-key"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {getStatusIcon()}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowKey(!showKey)}
                className="h-6 w-6 p-0"
              >
                {showKey ? (
                  <EyeOffIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <p className={`text-xs flex items-center gap-1 ${
            isValid === true ? 'text-green-600' : 
            isValid === false ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {getStatusMessage()}
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleSaveApiKey}
            disabled={!apiKey.trim() || isValidating}
            className="flex-1"
          >
            {isValidating ? '验证中...' : '保存并验证'}
          </Button>
          <Button 
            onClick={handleClearApiKey}
            variant="outline"
            disabled={!apiKey}
          >
            清除
          </Button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
            如何获取 DeepSeek API Key：
          </h4>
          <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>1. 访问 <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="underline">platform.deepseek.com</a></li>
            <li>2. 注册账户并登录</li>
            <li>3. 在 API Keys 页面创建新的 API Key</li>
            <li>4. 复制并粘贴到上方输入框</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}