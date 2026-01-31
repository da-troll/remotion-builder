# AI Chat Demo Video Project

A Remotion-based video project for creating animated AI chat demo videos with message bubbles, thinking animations, and data visualization charts.

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

## Installation

```bash
# Install dependencies
npm install

# Start the development preview
npm run dev

# Run linting and type checking
npm run lint
```

## Project Structure

```
src/
├── Root.tsx              # Composition definitions with timing configurations
├── theme.ts              # Design system tokens (colors, typography, timing)
├── fonts.ts              # Font configuration
├── index.ts              # Entry point
├── index.css             # Global styles (TailwindCSS v4)
└── ChatSequence/
    ├── ChatSequence.tsx          # Main chat container component
    ├── MessageBubble.tsx         # Animated message bubble with typing effect
    ├── EnpsTrendsAndTurnoverCard.tsx  # Combined eNPS + Turnover charts
    ├── JoinersLeaversChart.tsx   # Animated line chart for turnover
    └── BrandLogo.tsx             # Avatar/logo component
```

## Component Reference

### Container & Layout Components

| Component | File | What It Does |
|-----------|------|--------------|
| **ChatSequence** | `ChatSequence.tsx` | The overall video canvas that holds all chat messages. Sets the background (color or image), positions the company logo (corners), and renders messages in sequence. Think of it as the "chat app screen" the viewer sees. |
| **MessageBubble** | `MessageBubble.tsx` | The container around each message in the conversation. Handles bubble styling (user = purple, AI = gray), avatar/logo, entrance animations. Can contain plain text (with typewriter reveal) or a "thinking" state followed by charts. |

### Avatar & Branding Components

| Component | File | What It Does |
|-----------|------|--------------|
| **BrandLogo** | `BrandLogo.tsx` | The AI assistant's avatar next to AI messages. Defaults to Simployer symbol but can be customized to any brand logo. |
| **SiaLogo** | `BrandLogo.tsx` | A code-generated sparkle icon as fallback when no image is provided. Useful for quick prototyping. |

### Chart Components

| Component | File | What It Does |
|-----------|------|--------------|
| **JoinersLeaversChart** | `JoinersLeaversChart.tsx` | Line chart showing employee turnover—two animated lines for "Joiners" and "Leavers" over 12 months. Can be standalone or embedded. |
| **EnpsTrendsAndTurnoverCard** | `EnpsTrendsAndTurnoverCard.tsx` | Combined insight card with two stacked charts: eNPS score trends (9-10s vs 6-7s) on top, turnover below. Includes insight callout explaining correlation. |
| **EnpsDistributionChart** | `EnpsDistributionChart.tsx` | Bar chart showing eNPS score distribution (0-10). Bars grow with staggered animation. Color-coded for promoters, passives, and detractors. |
| **EnpsBucketsVsTurnoverChart** | `EnpsBucketsVsTurnoverChart.tsx` | Advanced analytics chart with two sections: 5 score trend lines (6-10) on top, joiners/leavers below. Includes Pearson correlation callout. |

### Adding Charts to Messages

There are two ways to add charts:

**Option 1: `chartType` (Simple)** — Use a string identifier. `ChatSequence` maps it to the component automatically.
```typescript
{ chartType: "enps-distribution", reasoningSteps: ["Analyzing..."], isAi: true }
```

| `chartType` Value | Component | Use Case |
|-------------------|-----------|----------|
| `"enps-distribution"` | EnpsDistributionChart | Score breakdown as bar chart |
| `"enps-trends-turnover"` | EnpsTrendsAndTurnoverCard | eNPS + turnover comparison (stacked) |
| `"enps-vs-turnover"` | EnpsBucketsVsTurnoverChart | Detailed correlation with multiple lines |
| `"joiners-leavers"` | JoinersLeaversChart | Simple turnover visualization |

**Option 2: `chartWidget` (Advanced)** — Pass JSX directly for custom props or unlisted components.
```typescript
chartWidget={<JoinersLeaversChart compact={true} hideTitle={true} />}
```

The flow: `chartType` in message config → `ChatSequence.getChartWidget()` converts to JSX → `MessageBubble` receives `chartWidget` prop.

### Animation Effects

| Effect | Where Used | Description |
|--------|------------|-------------|
| **Spring entrance** | MessageBubble | Messages scale up and fade in with natural "pop" feel |
| **Height expansion** | MessageBubble | Smooth height animation prevents layout jumps |
| **Typewriter text** | MessageBubble | Text reveals character-by-character with ghost text maintaining layout |
| **Shimmer loading** | MessageBubble | Gradient sweep on "Thinking..." text while AI processes |
| **Line drawing** | All charts | SVG paths animate using `strokeDashoffset` to "draw" themselves |
| **Staggered bars** | EnpsDistributionChart | Each bar animates with slight delay after the previous |

## Available Compositions

| Composition ID | Description | Duration (frames @ 60fps) |
|----------------|-------------|---------------------------|
| `ChatSequence-Short` | 6-message demo with chart | 1800 |
| `ChatSequence-Short-Light` | Light theme variant | 1800 |
| `ChatSequence-Long` | 8-message extended demo | 2700 |
| `ChatSequence-Long-Light` | Light theme variant | 2700 |
| `ChatSequence-MultiTurn` | Multi-turn conversation | 2700 |
| `ChatSequence-MultiTurn-Light` | Light theme variant | 2700 |
| `ChatSequence-ChartOnly` | Chart-focused demo | 2700 |
| `ChatSequence-ChartOnly-Light` | Light theme variant | 2700 |

## Configuration

### Theme System (`src/theme.ts`)

The theme file contains all design tokens:

#### Colors
```typescript
theme.colors.brand.primary      // #9773ff - Main brand purple
theme.colors.brand.secondary    // #ff9573 - Accent orange
theme.colors.charts.purple      // #9773ff - Chart line color
theme.colors.charts.orange      // #F2B299 - Secondary chart color
theme.colors.surface.main       // #ffffff - Card backgrounds
theme.colors.surface.variant    // #f2f0f7 - AI bubble background
```

#### Typography
```typescript
theme.typography.fontFamily.heading  // "Inter"
theme.typography.fontFamily.body     // "Inter"
theme.typography.fontFamily.display  // "Source Serif 4"
```

### Timing System

All animation timing is centralized in `theme.timing` for easy adjustment:

```typescript
theme.timing = {
  delays: {
    start: 30,                    // Frames before first message (0.5s)
    userToAiText: 90,             // After user → AI text response (1.5s)
    userToAiThinking: 30,         // After user → AI thinking/chart (0.5s)
    aiTextToUser: 220,            // After AI text → next user (3.67s)
    aiChartToUser: {
      base: 140,                  // Base viewing time after chart
      perThinkingStep: 136,       // Frames per thinking step (2.27s)
    },
  },
  thinkingDurationPerStep: 136,   // Each "thinking" step duration
  charsPerFrame: 1.125,           // Typewriter speed
  shimmerCycle: 160,              // Shimmer animation cycle
}
```

#### Delay Calculation Helper
```typescript
import { getAiChartToUserDelay } from "./theme";

// Calculate delay after chart with 4 thinking steps:
const delay = getAiChartToUserDelay(4); // Returns 684 frames
```

## Creating New Videos

### 1. Define Message Content

In `src/Root.tsx`, create your messages array:

```typescript
const myMessages = [
  { text: "User question here", isAi: false },
  { text: "AI response here", isAi: true },
  {
    isAi: true,
    reasoningSteps: ["Analyzing data...", "Finding patterns...", "Generating chart..."],
    chartWidget: <MyChartComponent />,
  },
];
```

### 2. Calculate Delays

Use the timing system to calculate message delays:

```typescript
const t = theme.timing.delays;

const delays = {
  msg1: t.start,
  msg2: t.start + t.userToAiText,
  msg3: delays.msg2 + t.aiTextToUser,
  msg4: delays.msg3 + t.userToAiThinking,
  msg5: delays.msg4 + getAiChartToUserDelay(3), // 3 thinking steps
};
```

### 3. Create Composition

Add to `src/Root.tsx`:

```tsx
<Composition
  id="MyNewVideo"
  component={ChatSequence}
  durationInFrames={2000}
  fps={60}
  width={1080}
  height={1920}
  schema={chatSequenceSchema}
  defaultProps={{
    messages: myMessages,
    brandName: "My Brand",
    // ... other props
  }}
/>
```

## Message Types

### Text Message
```typescript
{ text: "Hello, how can I help?", isAi: true }
```

### Message with Thinking + Chart
```typescript
{
  isAi: true,
  reasoningSteps: [
    "Analyzing your data...",
    "Identifying trends...",
    "Preparing visualization..."
  ],
  chartWidget: <EnpsTrendsAndTurnoverCard />
}
```

### User Message with Avatar
```typescript
{
  text: "Show me the analytics",
  isAi: false,
  userName: "John",
  userAvatar: "/path/to/avatar.png"
}
```

## Rendering

### Preview in Studio
```bash
npm run dev
```

### Render Single Composition
```bash
npx remotion render ChatSequence-Short
```

### Render with Custom Output
```bash
npx remotion render ChatSequence-Short --output=out/my-video.mp4
```

### Render All Compositions
```bash
npx remotion render
```

### Render Options
```bash
# Custom codec
npx remotion render ChatSequence-Short --codec=h264

# Custom quality (CRF 0-51, lower = better)
npx remotion render ChatSequence-Short --crf=18

# Custom resolution scale
npx remotion render ChatSequence-Short --scale=0.5
```

## Customization

### Changing Brand Colors
Edit `src/theme.ts`:
```typescript
brand: {
  primary: "#your-color",
  primaryDark: "#darker-variant",
  primaryLight: "#lighter-variant",
}
```

### Adjusting Animation Speed
Modify timing values in `src/theme.ts`:
```typescript
timing: {
  charsPerFrame: 2.0,        // Faster typing (was 1.125)
  thinkingDurationPerStep: 100,  // Faster thinking (was 136)
}
```

### Custom Chart Components
Create new chart components in `src/ChatSequence/` using Remotion's animation hooks:
```typescript
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export const MyChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 15 } });

  return <svg>{/* Animated chart */}</svg>;
};
```

## Troubleshooting

### Fonts Not Loading
Ensure fonts are properly loaded in `src/fonts.ts` and the font files exist in `public/fonts/`.

### Timing Issues After FPS Change
All timing values are in frames. If you change FPS (e.g., 30 → 60), multiply all delay values by 2.

### Chart Animations Not Syncing
Charts use local `frame` from `useCurrentFrame()`. They start animating when their parent MessageBubble appears. The MessageBubble's `delay` prop controls when this happens.

## Links

- [Remotion Documentation](https://www.remotion.dev/docs/the-fundamentals)
- [Remotion Discord](https://discord.gg/6VzzNDwUwV)
- [Report Issues](https://github.com/remotion-dev/remotion/issues/new)

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
