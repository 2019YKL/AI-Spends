import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    // 使用环境变量中的API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    // 调用 OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ai-git-money.vercel.app',
        'X-Title': 'AI-git-money',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.8,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error?.message || 'OpenRouter API request failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json({ error: 'Invalid response from OpenRouter' }, { status: 500 })
    }

    return NextResponse.json({
      message: data.choices[0].message.content,
      usage: data.usage,
    })

  } catch (error) {
    console.error('OpenRouter API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}