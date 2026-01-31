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
- `src/Root.tsx` - Defines all compositions and timing calculations

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

**ChatDemo** (`src/ChatDemo/`)
- Alternative chat demo format with different message types
- Supports user, AI, loading, and action message types

### Design System

**Theme** (`src/theme.ts`)
- Colors: brand, text, surface, charts, status
- Typography: font families, sizes, weights
- Layout: border radius, gaps, shadows
- **Timing constants** (see below)

**Fonts** (`src/fonts.ts`)
- Inter (body/heading)
- Source Serif 4 (display)

## Timing System (60fps)

All timing is centralized in `src/theme.ts` under `theme.timing`. This enables easy tweaking and template creation.

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

### Pre-calculated Delays in Root.tsx

```typescript
const shortDelays = { msg1, msg2, msg3, msg4, msg5, msg6 };
const longDelays = { ...shortDelays, msg7, msg8 };
const multiTurnDelays = { msg1, msg2, msg3, msg4 };
const chartDelays = { msg1, msg2 };
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
| `ChatDemo-*` | Alternative chat demo variants | varies | 1920×1080 |

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

1. Define timing using `theme.timing.delays` constants
2. Calculate cumulative delays for each message
3. Add `<Composition>` in `Root.tsx` with proper schema
4. Use existing message types and chart components

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
- Charts use smooth Bezier curves for "marketing smoothness"
- Message bubbles animate with springs for natural feel
- Thinking states use shimmer effect with gradient text
- Always test at 60fps for smooth playback
