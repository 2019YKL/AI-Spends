import { AIService } from '@/types/ai-services'

export const aiServices: AIService[] = [
  {
    id: 'claude',
    name: 'Claude',
    icon: 'claude-color.svg',
    color: 'bg-orange-500',
    subscriptionPrice: 20, // $20/month (Pro tier default)
    billingStartDate: '2025-07-15T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'ai-chat',
    pricingTiers: [
      { id: 'pro', name: 'Pro', price: 20 },
      { id: 'team', name: 'Team', price: 100 },
      { id: 'enterprise', name: 'Enterprise', price: 200 }
    ],
    selectedTier: 'pro'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: 'openai.svg',
    color: 'bg-green-500',
    subscriptionPrice: 20, // $20/month (Plus tier default)
    billingStartDate: '2025-07-17T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'ai-chat',
    pricingTiers: [
      { id: 'plus', name: 'Plus', price: 20 },
      { id: 'team', name: 'Team', price: 100 },
      { id: 'enterprise', name: 'Enterprise', price: 200 }
    ],
    selectedTier: 'plus'
  },
  {
    id: 'cursor-pro',
    name: 'Cursor',
    icon: 'cursor.svg',
    color: 'bg-indigo-500',
    subscriptionPrice: 20, // $20/month (Pro plan default)
    billingStartDate: '2025-07-18T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'code-editor',
    pricingTiers: [
      { id: 'pro', name: 'Pro', price: 20 },
      { id: 'ultra', name: 'Ultra', price: 200 }
    ],
    selectedTier: 'pro'
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    icon: 'windsurf.svg',
    color: 'bg-cyan-500',
    subscriptionPrice: 15, // $15/month (Basic tier default)
    billingStartDate: '2025-07-16T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'code-editor',
    pricingTiers: [
      { id: 'basic', name: 'Basic', price: 15 },
      { id: 'pro', name: 'Pro', price: 30 },
      { id: 'ultra', name: 'Ultra', price: 60 }
    ],
    selectedTier: 'basic'
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    icon: 'midjourney.svg',
    color: 'bg-purple-500',
    subscriptionPrice: 10, // $10/month for Basic plan
    billingStartDate: '2025-07-10T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'ai-image',
    pricingTiers: [
      { id: 'basic', name: 'Basic', price: 10 },
      { id: 'standard', name: 'Standard', price: 30 },
      { id: 'pro', name: 'Pro', price: 60 }
    ],
    selectedTier: 'basic'
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    icon: 'githubcopilot.svg',
    color: 'bg-gray-700',
    subscriptionPrice: 10, // $10/month (Individual plan)
    billingStartDate: '2025-07-01T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'code-editor',
    pricingTiers: [
      { id: 'individual', name: 'Individual', price: 10 },
      { id: 'business', name: 'Business', price: 19 },
      { id: 'enterprise', name: 'Enterprise', price: 39 }
    ],
    selectedTier: 'individual'
  },
  {
    id: 'dreamina',
    name: 'Dreamina',
    icon: 'jimeng-color.svg',
    color: 'bg-purple-500',
    subscriptionPrice: 10, // $10/month (Basic tier default, converted from ¥69)
    billingStartDate: '2025-07-19T12:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'ai-image',
    pricingTiers: [
      { id: 'basic', name: 'Basic', price: 10 }, // ¥69 ≈ $10
      { id: 'pro', name: 'Pro', price: 28 }, // ¥199 ≈ $28
      { id: 'ultra', name: 'Ultra', price: 70 } // ¥499 ≈ $70
    ],
    selectedTier: 'basic'
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: 'notion.svg',
    color: 'bg-gray-700',
    subscriptionPrice: 8, // $8/month (Plus plan)
    billingStartDate: '2025-07-10T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'productivity',
    pricingTiers: [
      { id: 'plus', name: 'Plus', price: 8 },
      { id: 'business', name: 'Business', price: 15 },
      { id: 'enterprise', name: 'Enterprise', price: 25 }
    ],
    selectedTier: 'plus'
  },
  {
    id: 'raycast',
    name: 'Raycast',
    icon: 'Raycast.png',
    color: 'bg-orange-500',
    subscriptionPrice: 8, // $8/month (Pro plan)
    billingStartDate: '2025-07-05T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'productivity',
    pricingTiers: [
      { id: 'pro', name: 'Pro', price: 8 },
      { id: 'teams', name: 'Teams', price: 16 }
    ],
    selectedTier: 'pro'
  },
  {
    id: 'figma',
    name: 'Figma',
    icon: 'figma-color.svg',
    color: 'bg-violet-500',
    subscriptionPrice: 12, // $12/month (Professional plan)
    billingStartDate: '2025-07-08T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'productivity',
    pricingTiers: [
      { id: 'professional', name: 'Professional', price: 12 },
      { id: 'organization', name: 'Organization', price: 45 }
    ],
    selectedTier: 'professional'
  },
  {
    id: 'gemini',
    name: 'Gemini Advanced',
    icon: 'gemini-color.svg',
    color: 'bg-blue-500',
    subscriptionPrice: 20, // $20/month (Advanced plan)
    billingStartDate: '2025-07-12T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'ai-chat',
    pricingTiers: [
      { id: 'advanced', name: 'Advanced', price: 20 },
      { id: 'business', name: 'Business', price: 30 }
    ],
    selectedTier: 'advanced'
  },
  {
    id: 'hailuo',
    name: 'Hailuo',
    icon: 'hailuo-color.svg',
    color: 'bg-blue-500',
    subscriptionPrice: 9, // $9/month (Basic tier default, converted from ¥61)
    billingStartDate: '2025-07-20T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'ai-image',
    pricingTiers: [
      { id: 'basic', name: 'Basic', price: 9 }, // ¥61 ≈ $9
      { id: 'pro', name: 'Pro', price: 32 }, // ¥220 ≈ $32
      { id: 'ultra', name: 'Ultra', price: 75 } // ¥521 ≈ $75
    ],
    selectedTier: 'basic'
  },
  {
    id: 'vidu',
    name: 'Vidu',
    icon: 'vidu-color.svg',
    color: 'bg-red-500',
    subscriptionPrice: 9, // $9/month (Basic tier default, converted from ¥59)
    billingStartDate: '2025-07-20T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'ai-image',
    pricingTiers: [
      { id: 'basic', name: 'Basic', price: 9 }, // ¥59 ≈ $9
      { id: 'pro', name: 'Pro', price: 31 }, // ¥219 ≈ $31
      { id: 'ultra', name: 'Ultra', price: 71 } // ¥499 ≈ $71
    ],
    selectedTier: 'basic'
  },
  {
    id: 'kling',
    name: 'Kling',
    icon: 'kling-color.svg',
    color: 'bg-green-600',
    subscriptionPrice: 7, // $7/month (Basic tier default, converted from ¥46)
    billingStartDate: '2025-07-20T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'ai-image',
    pricingTiers: [
      { id: 'basic', name: 'Basic', price: 7 }, // ¥46 ≈ $7
      { id: 'pro', name: 'Pro', price: 27 }, // ¥186 ≈ $27
      { id: 'ultra', name: 'Ultra', price: 67 } // ¥466 ≈ $67
    ],
    selectedTier: 'basic'
  },
  {
    id: 'v0-dev',
    name: 'v0 by Vercel',
    icon: 'v0.svg',
    color: 'bg-black',
    subscriptionPrice: 0, // Free tier default
    billingStartDate: '2025-07-14T00:00:00Z',
    billingCycle: 30,
    isActive: true,
    category: 'code-editor',
    pricingTiers: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'pro', name: 'Pro', price: 20 }
    ],
    selectedTier: 'free'
  }
]