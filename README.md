# AutoBurn - AI Subscription Cost Tracker

A modern, responsive web application built with Next.js, TypeScript, and Tailwind CSS to track your AI service subscription costs and calculate real-time burn rates.

## Features

- 📊 **Real-time Cost Tracking**: Monitor costs per minute, hour, day, and month
- 🎯 **Multiple Pricing Models**: Support for token-based, subscription, and credit-based AI services
- 🎨 **Modern UI**: Beautiful card-based design with shadcn/ui components
- 📱 **Responsive**: Works perfectly on desktop and mobile devices
- ⚡ **Real-time Updates**: Live clock and cost calculations
- 💰 **Cost Breakdown**: Detailed breakdown of costs by service type

## Supported AI Services

- **ChatGPT** (Token-based pricing)
- **Claude** (Token-based pricing)
- **Midjourney** (Subscription-based)
- **DALL-E** (Credit-based)
- **GitHub Copilot** (Subscription-based)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment Ready**: Vercel-optimized

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd autoburn
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main dashboard page
├── components/
│   ├── ui/                # shadcn/ui components
│   │   ├── button.tsx
│   │   └── card.tsx
│   └── CostTrackingCard.tsx # Main cost tracking card component
├── lib/
│   ├── ai-services-data.ts # Sample AI service data
│   ├── cost-calculator.ts  # Cost calculation utilities
│   └── utils.ts           # Utility functions
└── types/
    └── ai-services.ts     # TypeScript type definitions
```

## Customization

### Adding New AI Services

1. Add the service to `src/lib/ai-services-data.ts`:

```typescript
{
  id: 'new-service',
  name: 'New AI Service',
  icon: '🆕',
  color: 'bg-indigo-500',
  pricingModel: 'token-based', // or 'subscription' or 'credit-based'
  pricing: {
    inputTokenPrice: 0.001,
    outputTokenPrice: 0.002,
  },
  usage: {
    inputTokens: 50000,
    outputTokens: 25000,
    requests: 500,
  }
}
```

### Modifying Pricing Models

Update the `calculateCost` function in `src/lib/cost-calculator.ts` to add new pricing models or modify existing calculations.

### Styling

The app uses Tailwind CSS with CSS custom properties for theming. Modify `src/app/globals.css` to customize colors and styling.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

### Other Platforms

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

If you encounter any issues or have questions, please open an issue on GitHub.