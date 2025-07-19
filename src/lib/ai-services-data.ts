import { AIService } from '@/types/ai-services'

export const aiServices: AIService[] = [
  {
    id: 'cursor-pro',
    name: 'Cursor',
    icon: '🔮',
    color: 'bg-indigo-500',
    subscriptionPrice: 20, // $20/month
    billingStartDate: '2025-07-18T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'code-editor'
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    icon: '🏄‍♂️',
    color: 'bg-cyan-500',
    subscriptionPrice: 15, // $15/month
    billingStartDate: '2025-07-16T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'code-editor'
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    icon: '💬',
    color: 'bg-green-500',
    subscriptionPrice: 20, // $20/month
    billingStartDate: '2025-07-17T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'ai-chat'
  },
  {
    id: 'claude-pro',
    name: 'Claude Pro',
    icon: '🧠',
    color: 'bg-orange-500',
    subscriptionPrice: 20, // $20/month
    billingStartDate: '2025-07-15T00:00:00Z',
    billingCycle: 30,
    isActive: false,
    category: 'ai-chat'
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    icon: '🎨',
    color: 'bg-purple-500',
    subscriptionPrice: 30, // $30/month for Standard plan
    billingStartDate: '2025-07-10T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'ai-image'
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    icon: '🚁',
    color: 'bg-gray-700',
    subscriptionPrice: 10, // $10/month
    billingStartDate: '2025-07-01T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'code-editor'
  },
  {
    id: 'perplexity-pro',
    name: 'Perplexity Pro',
    icon: '🔍',
    color: 'bg-blue-500',
    subscriptionPrice: 20, // $20/month
    billingStartDate: '2025-07-19T12:00:00Z',
    billingCycle: 30,
    isActive: false,
    category: 'ai-chat'
  },
  {
    id: 'v0-dev',
    name: 'v0 by Vercel',
    icon: '🌐',
    color: 'bg-black',
    subscriptionPrice: 20, // $20/month
    billingStartDate: '2025-07-14T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'code-editor'
  },
  {
    id: 'copilot-pro',
    name: 'Copilot Pro',
    icon: '🤖',
    color: 'bg-blue-600',
    subscriptionPrice: 22, // $22/month
    billingStartDate: '2025-07-12T00:00:00Z',
    billingCycle: 30,
    isActive: false,
    category: 'productivity'
  }
]