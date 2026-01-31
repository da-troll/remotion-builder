# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Remotion video project for creating AI chat demo videos. It features animated chat interfaces with message bubbles, thinking/reasoning animations, and interactive chart widgets. Videos are composed of React components that render frame-by-frame at 60fps.

## Commands

```bash
npm run dev        # Start the Remotion Studio for preview
npm run build      # Bundle the project
npm run lint       # Run ESLint and TypeScript type checking
npx remotion render <composition-id>  # Render a specific composition to video
npx remotion render ChatSequence-Long --output=out/video.mp4  # Example render
```

## Architecture

### Entry Points
- `src/index.ts` - Registers the root component using `registerRoot()`
- `src/Root.tsx` - Minimal entry that imports all compositions
- `src/compositions/` - All composition definitions (see below)

### Compositions (`src/compositions/`)

| File | Purpose |
|------|---------|
| `index.tsx` | Exports `AllCompositions` component |
| `timing.ts` | Delay calculations (`shortDelays`, `longDelays`, etc.) |
| `messages.ts` | Shared message arrays for all compositions |
| `ChatDemoCompositions.tsx` | ChatDemo variant compositions |
| `ChatSequenceCompositions.tsx` | ChatSequence compositions with desktop/mobile helper |

### Core Components

**ChatSequence** (`src/ChatSequence/`)
- Main chat interface component with animated messages
- `ChatSequence.tsx` - Container component
- `MessageBubble.tsx` - Individual message with typewriter effect, thinking animation, chart expansion
- `schema.ts` - Zod schemas for type-safe props

**Chart Components** (`src/ChatSequence/`)
- `JoinersLeaversChart.tsx` - Turnover line chart (Joiners vs Leavers)
- `EnpsDistributionChart.tsx` - eNPS score distribution bar chart
- `EnpsTrendsAndTurnoverCard.tsx` - Combined eNPS trends + turnover correlation card
- `chartUtils.ts` - Shared utilities: `generateSmoothPath()`, `mixHexColors()`

**ChatDemo** (`src/ChatDemo/`)
- Alternative chat demo format with different message types
- Supports user, AI, loading, and action message types

### Design System

**Theme** (`src/theme.ts`)
- Colors: brand, text, surface, charts, status
- Typography: font families, sizes, weights
- Layout: border radius, gaps, shadows
- Chart styling: `theme.chart.*` (see below)
- Timing constants (see below)

**Fonts** (`src/fonts.ts`)
- Inter (body/heading)
- Source Serif 4 (display)

## Timing System (60fps)

All timing is centralized in `src/theme.ts` under `theme.timing`. Pre-calculated delays are in `src/compositions/timing.ts`.

### Delay Categories

| Category | Frames | Seconds | Usage |
|----------|--------|---------|-------|
| `start` | 30 | 0.5s | Before first message |
| `userToAiText` | 90 | 1.5s | After user msg → AI text response |
| `userToAiThinking` | 30 | 0.5s | After user msg → AI thinking/chart |
| `aiTextToUser` | 220 | 3.67s | After AI text → next user msg |
| `aiChartToUser.base` | 140 | 2.33s | Base viewing time after chart |
| `aiChartToUser.perThinkingStep` | 136 | 2.27s | Per thinking step |

### Animation Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `thinkingDurationPerStep` | 136 | Frames per thinking step |
| `charsPerFrame` | 1.125 | Typewriter speed |
| `shimmerCycle` | 160 | Shimmer animation cycle |

### Helper Function

```typescript
import { getAiChartToUserDelay } from "./theme";
// Calculate delay after AI chart: (steps × 136) + 140
const delay = getAiChartToUserDelay(4); // 684 frames for 4 thinking steps
```

### Pre-calculated Delays

Located in `src/compositions/timing.ts`:

```typescript
import { shortDelays, longDelays, multiTurnDelays, chartDelays } from "./timing";
```

## Chart Styling (`theme.chart`)

| Token Path | Value | Usage |
|------------|-------|-------|
| `chart.line.strokeWidth` | 4 | Primary line thickness |
| `chart.line.strokeWidthSecondary` | 2.5 | Dense multi-line charts |
| `chart.line.tension` | 0.3 | Bezier curve smoothness |
| `chart.line.padding` | `{top:10,right:20,bottom:25,left:30}` | Chart content padding |
| `chart.line.labelOffset` | 5 | Distance to x-axis labels |
| `chart.title.fontSize` | 18 | Chart title size |
| `chart.legend.indicator.pill` | `{width:16,height:4}` | Line chart legend |
| `chart.legend.indicator.square` | `{width:12,height:12}` | Bar chart legend |

Use `theme.chart.compact.*` variants for embedded/smaller charts.

### Line Chart Pattern

```typescript
import { generateSmoothPath } from "./chartUtils";

const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.value) }));
const path = generateSmoothPath(points); // Uses theme.chart.line.tension

<path
  d={path}
  strokeWidth={theme.chart.line.strokeWidth}
  strokeDashoffset={interpolate(progress, [0, 1], [pathLength, 0])}
/>
```

## Available Compositions

| ID | Description | Duration | Dimensions |
|----|-------------|----------|------------|
| `ChatSequence-Short` | 6-message chat ending at eNPS distribution | 1900 frames | 1920×1080 |
| `ChatSequence-Long` | 8-message chat with correlation analysis | 2700 frames | 1920×1080 |
| `ChatSequence-Short-Mobile` | Mobile version of Short | 1900 frames | 1080×1226 |
| `ChatSequence-Long-Mobile` | Mobile version of Long | 2700 frames | 1080×1226 |
| `ChatSequence-MultiTurn` | Text-only multi-turn conversation | 900 frames | 1920×1080 |
| `ChatSequence-Chart` | Single chart response demo | 800 frames | 1920×1080 |
| `Athena-ChatDemo-Ask` | Q&A with search response | 300 frames | 1920×1080 |
| `Athena-ChatDemo-Assign` | Task assignment demo | 300 frames | 1920×1080 |
| `Athena-ChatDemo-Action` | Action card demo | 240 frames | 1920×1080 |
| `ChatSequence-Chart-BarExample` | Chart with bar graph | 360 frames | 1920×1080 |

## Chart Types

There are two ways to add charts to messages:

### Option 1: `chartType` (Simple)
Use a string identifier in the message config. `ChatSequence` maps it to the component automatically via `getChartWidget()`.

```typescript
{ chartType: "enps-distribution", reasoningSteps: ["Analyzing..."] }
```

Available values:
- `"joiners-leavers"` - JoinersLeaversChart
- `"enps-distribution"` - EnpsDistributionChart
- `"enps-trends-turnover"` - EnpsTrendsAndTurnoverCard
- `"enps-vs-turnover"` - EnpsBucketsVsTurnoverChart

### Option 2: `chartWidget` (Advanced)
Pass JSX directly to `MessageBubble` for custom props or components not in the mapping.

```typescript
chartWidget={<JoinersLeaversChart compact={true} hideTitle={true} />}
```

**Flow:** Message config (`chartType`) → `ChatSequence.getChartWidget()` → `MessageBubble` (`chartWidget` prop)

## Key Remotion Hooks

```typescript
useCurrentFrame()     // Current frame number
useVideoConfig()      // { fps, width, height, durationInFrames }
interpolate()         // Map frame ranges to value ranges
spring()              // Physics-based animations
```

## Creating New Compositions

### Adding a ChatSequence composition

1. Add message array to `src/compositions/messages.ts`
2. Add delays to `src/compositions/timing.ts` if needed
3. Add composition in `src/compositions/ChatSequenceCompositions.tsx`:
   - Use `createCompositionPair()` for desktop + mobile variants
   - Or add a single `<Composition>` for desktop-only

### Adding a ChatDemo composition

1. Add message array to `src/compositions/messages.ts`
2. Add `<Composition>` in `src/compositions/ChatDemoCompositions.tsx`

### Desktop + Mobile Helper

```typescript
// In ChatSequenceCompositions.tsx
createCompositionPair({
  id: "MyComposition",
  durationInFrames: 1000,
  messages: myMessages,
  logoPosition: "bottom-left",
  includeMobile: true,  // Generates MyComposition + MyComposition-Mobile
});
```

## Rendering

```bash
# Preview in browser
npm run dev

# Render to MP4
npx remotion render ChatSequence-Long --output=out/video.mp4

# Render at specific resolution
npx remotion render ChatSequence-Long --width=3840 --height=2160
```

## Best Practices

- Use `theme.timing` constants instead of hardcoded frame values
- Use `theme.chart.line.*` tokens for consistent line chart styling
- Use `generateSmoothPath()` from `chartUtils.ts` for bezier curves
- Add shared messages to `messages.ts` to avoid duplication
- Use `createCompositionPair()` for compositions that need mobile variants
- Message bubbles animate with springs for natural feel
- Always test at 60fps for smooth playback
