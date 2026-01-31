# Remotion Video Engine

A Remotion-based video project for creating animated AI chat demo videos with React components.

## Quick Start

```bash
npm install      # Install dependencies
npm run dev      # Start Remotion Studio
npm run lint     # Run ESLint + TypeScript checks
```

## Project Structure

```
src/
├── index.ts                 # Entry point
├── Root.tsx                 # Root component
├── theme.ts                 # Design tokens (colors, typography, timing)
├── fonts.ts                 # Font configuration
│
├── compositions/            # Composition definitions
│   ├── index.tsx            # Exports AllCompositions
│   ├── timing.ts            # Pre-calculated delays
│   ├── messages.ts          # Message content for compositions
│   └── *Compositions.tsx    # Grouped compositions
│
├── ChatSequence/            # Main chat interface + charts
│   ├── ChatSequence.tsx     # Container with getChartWidget()
│   ├── MessageBubble.tsx    # Message with animations
│   ├── schema.ts            # Zod schemas
│   └── *Chart.tsx           # Chart components
│
└── ChatDemo/                # Alternative chat format
```

## Available Compositions

### Desktop (1920×1080)
- `ChatSequence-EnpsTurnover` - eNPS + turnover analysis
- `ChatSequence-BurnoutCapacity` - Burnout/capacity stress
- `ChatSequence-PolicyImpact` - Policy impact analysis
- `ChatSequence-SkillsCoverage` - Skills coverage risk
- `ChatSequence-MultiTurn` - Text-only conversation
- `ChatSequence-Chart` - Single chart demo

### Mobile (1080×1226)
- `ChatSequence-Short-Mobile`
- `ChatSequence-Long-Mobile`

## Rendering

```bash
# Preview
npm run dev

# Render to MP4
npx remotion render ChatSequence-EnpsTurnover --output=out/video.mp4

# Custom resolution
npx remotion render ChatSequence-EnpsTurnover --width=3840 --height=2160
```

## Adding New Compositions

1. Add message array to `src/compositions/messages.ts`
2. Add composition in `src/compositions/ChatSequenceCompositions.tsx`:

```typescript
{createComposition({
  id: "ChatSequence-MyStory",
  durationInFrames: 2000,
  messages: myMessages,
  ...DESKTOP,
  backgroundImage: DESKTOP_BG,
})}
```

## Adding New Charts

1. Create component in `src/ChatSequence/MyChart.tsx`
2. Add to schema enum in `src/ChatSequence/schema.ts`
3. Add mapping in `ChatSequence.tsx` `getChartWidget()`
4. Use: `{ chartType: "my-chart", reasoningSteps: [...] }`

## Links

- [Remotion Docs](https://www.remotion.dev/docs)
- [Remotion Discord](https://discord.gg/6VzzNDwUwV)
