import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey || !apiKey.startsWith('sk-')) {
      return NextResponse.json({ error: 'Invalid API key format' }, { status: 400 })
    }

    // 验证 DeepSeek API Key
    const response = await fetch('https://api.deepseek.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      return NextResponse.json({ valid: true })
    } else {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }
  } catch (error) {
    console.error('API Key validation error:', error)
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 })
  }
}