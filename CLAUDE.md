# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-git-money is a real-time AI subscription cost tracker built with Next.js 14, TypeScript, and Tailwind CSS. The name is a programmer pun combining git commands with "给钱" (give money). It calculates and displays live "burn rates" for AI service subscriptions using smooth scrolling animations to show money being spent per second/minute/hour.

## Key Commands

```bash
# Development
npm run dev          # Start development server on localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Architecture & Design Principles

### Core Cost Calculation System
The app uses a **daily consumption model** (NOT monthly billing cycle). Each service has:
- `subscriptionPrice`: Fixed monthly cost in USD
- `billingStartDate`: When the current billing cycle began
- `billingCycle`: Number of days in cycle (typically 30)

**CRITICAL**: Real-time cost calculation works by:
1. **Time base**: Elapsed time since TODAY 00:00:00 (not billing start date)
2. Calculating daily cost rate: `subscriptionPrice / billingCycle`
3. Calculating cost per second: `dailyCost / (24 * 60 * 60)`
4. Current cost = elapsed seconds today × cost per second
5. Capping at daily maximum (not monthly)

### Smooth Number Animation System
Critical UX requirement: Numbers must **scroll smoothly, never jump or twitch**. All dynamic numbers use the `SmoothNumber` component which:
- Uses `requestAnimationFrame` for 60fps performance
- Implements easing with 6% incremental movement per frame
- Handles real-time incrementing based on `incrementPerSecond`
- Formats output with custom formatting functions

### Fire Theme Design
The app uses a "burning money" fire theme with:
- Black-red color palette (NOT purple/blue)
- Raycast-inspired premium gradients and glass morphism
- Advanced CSS utilities in `globals.css` for fire effects
- All numbers should have fire-themed glowing text effects

### Service Toggle Architecture
Services can be toggled on/off using:
- `useServiceToggle` hook manages state
- Only active services (`isActive: true`) contribute to totals
- Real-time recalculation when services are toggled

### AI Roasting Feature
The app includes an AI-powered roasting system that mocks users' subscription habits:
- Uses OpenRouter API with DeepSeek model (`deepseek/deepseek-chat`)
- API key stored in environment variable `DEEPSEEK_API_KEY`
- Generates programmer-culture specific roasts in Chinese "雌小鬼" (bratty little sister) style
- Combines subscription data with tech industry memes and pain points
- Uses specific vocabulary like "杂鱼" (small fry), "🩷", "🤡" emojis

## Key Files & Components

### Data Layer
- `src/types/ai-services.ts`: Core TypeScript interfaces
- `src/lib/ai-services-data.ts`: Preset AI services (Cursor, Windsurf, ChatGPT, etc.)
- `src/lib/cost-calculator.ts`: Real-time cost calculation logic

### UI Components
- `src/components/SmoothNumber.tsx`: Smooth scrolling number animation with hydration error handling
- `src/components/CostTrackingCard.tsx`: Individual service cards with pricing tiers
- `src/components/AIRoastChat.tsx`: AI roasting interface with DeepSeek integration
- `src/components/DotBackground.tsx`: Dot pattern background component
- `src/components/ui/`: shadcn/ui components (Card, Button, Switch)

### API Routes
- `src/app/api/deepseek/chat/route.ts`: OpenRouter API integration for AI roasting
- Uses environment variable `DEEPSEEK_API_KEY` for authentication
- Calls `https://openrouter.ai/api/v1/chat/completions` with `deepseek/deepseek-chat` model

### Styling
- `src/app/globals.css`: Fire theme utilities, advanced gradients
- Uses Tailwind CSS with custom fire-themed utilities
- Glass morphism effects with `fire-glass-card` class

### Main Page
- `src/app/page.tsx`: Dashboard with hero section and service grid
- Real-time clock updates every second
- Hero section uses premium fire gradients with floating orbs

## Development Guidelines

### Adding New Services
Add to `aiServices` array in `src/lib/ai-services-data.ts` with proper category classification:
- `ai-chat`: ChatGPT, Claude, Perplexity
- `ai-image`: Midjourney, DALL-E  
- `code-editor`: Cursor, Windsurf, GitHub Copilot
- `productivity`: General productivity tools

### Number Display Rules
ALL dynamic numbers must use `SmoothNumber` component. Never display raw calculated values directly. Key props:
- `value`: Current value to display
- `incrementPerSecond`: How much to increment per second (0 for static values)
- `formatFn`: Custom formatter (use `formatCurrency` or `formatCurrencyPrecise`)

### Fire Theme Requirements
- Use black-red color scheme throughout
- Apply fire glow effects to important numbers
- Maintain glass morphism aesthetic
- Floating animations should be subtle (6s ease-in-out)

## Technical Constraints

- Next.js 14 with App Router (not Pages Router)
- All components must be client-side (`'use client'`) for real-time updates
- Uses shadcn/ui component system
- No external animation libraries - custom `requestAnimationFrame` implementation
- Responsive design with mobile-first approach