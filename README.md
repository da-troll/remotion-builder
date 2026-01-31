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
├── index.ts                 # Entry point (registerRoot)
├── Root.tsx                 # Minimal root - imports AllCompositions
├── theme.ts                 # Design tokens (colors, typography, timing, charts)
├── fonts.ts                 # Font configuration
├── index.css                # Global styles (TailwindCSS v4)
│
├── compositions/            # All composition definitions
│   ├── index.tsx            # Exports AllCompositions component
│   ├── timing.ts            # Pre-calculated delay values
│   ├── messages.ts          # Shared message arrays
│   ├── ChatDemoCompositions.tsx      # ChatDemo variants
│   └── ChatSequenceCompositions.tsx  # ChatSequence variants (with desktop/mobile helper)
│
├── ChatSequence/            # Main chat interface components
│   ├── ChatSequence.tsx     # Container component
│   ├── MessageBubble.tsx    # Animated message bubble
│   ├── schema.ts            # Zod schemas
│   ├── chartUtils.ts        # Shared chart utilities
│   ├── BrandLogo.tsx        # Avatar/logo component
│   ├── JoinersLeaversChart.tsx
│   ├── EnpsDistributionChart.tsx
│   ├── EnpsTrendsAndTurnoverCard.tsx
│   └── EnpsBucketsVsTurnoverChart.tsx
│
└── ChatDemo/                # Alternative chat demo format
    ├── index.ts
    ├── ChatDemo.tsx
    └── schema.ts
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

### ChatSequence Compositions (60fps)

| Composition ID | Description | Duration | Dimensions |
|----------------|-------------|----------|------------|
| `ChatSequence-Short` | 6-message chat ending at eNPS distribution | 1900 frames | 1920×1080 |
| `ChatSequence-Short-Mobile` | Mobile version of Short | 1900 frames | 1080×1226 |
| `ChatSequence-Long` | 8-message chat with correlation analysis | 2700 frames | 1920×1080 |
| `ChatSequence-Long-Mobile` | Mobile version of Long | 2700 frames | 1080×1226 |
| `ChatSequence-MultiTurn` | Text-only multi-turn conversation | 900 frames | 1920×1080 |
| `ChatSequence-Chart` | Single chart response demo | 800 frames | 1920×1080 |

### ChatDemo Compositions (30fps)

| Composition ID | Description | Duration | Dimensions |
|----------------|-------------|----------|------------|
| `Athena-ChatDemo-Ask` | Q&A with search response | 300 frames | 1920×1080 |
| `Athena-ChatDemo-Assign` | Task assignment demo | 300 frames | 1920×1080 |
| `Athena-ChatDemo-Action` | Action card demo | 240 frames | 1920×1080 |
| `ChatSequence-Chart-BarExample` | Chart with bar graph | 360 frames | 1920×1080 |

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

#### Chart Styling Tokens

All chart styling is centralized in `theme.chart` for consistency across components.

**Title, Legend, and Axis Labels:**
```typescript
theme.chart.title.fontSize          // 18
theme.chart.title.fontWeight        // 400
theme.chart.title.color             // "#706e78"
theme.chart.title.marginBottom      // 16

theme.chart.legend.fontSize         // 12
theme.chart.legend.fontWeight       // 500
theme.chart.legend.gap              // 6 (vertical gap between items)
theme.chart.legend.horizontalGap    // 20 (horizontal layout gap)
theme.chart.legend.itemGap          // 8 (gap between indicator and text)
theme.chart.legend.indicator.pill   // { width: 16, height: 4, borderRadius: 4 }
theme.chart.legend.indicator.square // { width: 12, height: 12, borderRadius: 3 }

theme.chart.axisLabel.fontSize      // 12
theme.chart.axisLabel.color         // "#706e78"
```

**Line Chart Tokens** (`theme.chart.line`):
```typescript
theme.chart.line.strokeWidth          // 4 - Primary line thickness
theme.chart.line.strokeWidthSecondary // 2.5 - For dense multi-line charts
theme.chart.line.tension              // 0.3 - Bezier curve smoothness (0=straight, 1=very curved)
theme.chart.line.padding              // { top: 10, right: 20, bottom: 25, left: 30 }
theme.chart.line.labelOffset          // 5 - Distance from content to x-axis labels
```

**Compact Variants** (for embedded/smaller charts):
```typescript
theme.chart.compact.title.fontSize           // 14
theme.chart.compact.legend.fontSize          // 10
theme.chart.compact.axisLabel.fontSize       // 10
theme.chart.compact.contentWidth             // 400
theme.chart.compact.contentHeight            // 160
```

### Chart Utilities (`chartUtils.ts`)

Shared utilities for creating consistent chart visualizations.

**generateSmoothPath** - Creates smooth Bezier curves from data points using Catmull-Rom interpolation:
```typescript
import { generateSmoothPath } from "./ChatSequence/chartUtils";

const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.value) }));
const path = generateSmoothPath(points); // Uses theme.chart.line.tension by default
const customPath = generateSmoothPath(points, 0.5); // Custom tension
```

**mixHexColors** - Blend two hex colors by ratio:
```typescript
import { mixHexColors } from "./ChatSequence/chartUtils";

const blended = mixHexColors("#ff0000", "#0000ff", 0.5); // 50% mix → purple
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

#### Pre-calculated Delays

Located in `src/compositions/timing.ts`:

```typescript
import { shortDelays, longDelays, multiTurnDelays, chartDelays } from "./compositions/timing";

// shortDelays: { msg1, msg2, msg3, msg4, msg5, msg6 }
// longDelays:  { ...shortDelays, msg7, msg8 }
// multiTurnDelays: { msg1, msg2, msg3, msg4 }
// chartDelays: { msg1, msg2 }
```

## Creating New Videos

### Adding a ChatSequence Composition

#### Step 1: Add messages to `src/compositions/messages.ts`

```typescript
// Add new message array
export const myNewMessages: ChatMessage[] = [
  {
    text: "User question here",
    isAi: false,
    delay: myDelays.msg1,
    userName: "Alex",
  },
  {
    text: "AI response here",
    isAi: true,
    delay: myDelays.msg2,
  },
  {
    isAi: true,
    delay: myDelays.msg3,
    reasoningSteps: ["Analyzing data...", "Building chart..."],
    chartType: "enps-distribution",
  },
];
```

#### Step 2: Add delays to `src/compositions/timing.ts` (if needed)

```typescript
export const myDelays = {
  msg1: calcDelays.start,
  msg2: calcDelays.start + t.userToAiText,
  msg3: calcDelays.start + t.userToAiText + t.aiTextToUser + t.userToAiThinking,
};
```

#### Step 3: Add composition in `src/compositions/ChatSequenceCompositions.tsx`

**For desktop only:**
```typescript
{createCompositionPair({
  id: "MyNewVideo",
  durationInFrames: 1200,
  messages: myNewMessages,
  logoPosition: "bottom-left",
})}
```

**For desktop + mobile variants:**
```typescript
{createCompositionPair({
  id: "MyNewVideo",
  durationInFrames: 1200,
  messages: myNewMessages,
  logoPosition: "bottom-left",
  includeMobile: true,  // Generates MyNewVideo + MyNewVideo-Mobile
})}
```

### Adding a ChatDemo Composition

#### Step 1: Add messages to `src/compositions/messages.ts`

```typescript
export const myDemoMessages: ChatDemoProps["messages"] = [
  {
    message: { type: "user", userName: "Tom", text: "Question here" },
    startFrame: 0,
    durationFrames: 120,
    fadeToBackground: true,
  },
  {
    message: { type: "loading", text: "Searching...", icon: "search" },
    startFrame: 30,
    durationFrames: 60,
  },
  {
    message: { type: "ai", text: "Response here" },
    startFrame: 90,
    durationFrames: 210,
  },
];
```

#### Step 2: Add composition in `src/compositions/ChatDemoCompositions.tsx`

```typescript
<Composition
  id="MyDemo"
  component={ChatDemo}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
  schema={ChatDemoSchema}
  defaultProps={{
    brandName: BRAND_NAME,
    backgroundColor: BACKGROUND_COLOR,
    messages: myDemoMessages,
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
  chartType: "enps-trends-turnover"
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

Create new chart components in `src/ChatSequence/` using Remotion's animation hooks and theme tokens.

**Basic Chart Template:**
```typescript
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../theme";
import { generateSmoothPath } from "./chartUtils";

export const MyLineChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation progress (0 → 1)
  const progress = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });

  // Use theme tokens for dimensions
  const chartWidth = theme.chart.contentWidth;  // 480
  const chartHeight = 140;
  const padding = theme.chart.line.padding;     // { top: 10, right: 20, bottom: 25, left: 30 }
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Scale functions
  const xScale = (i: number) => padding.left + (i / (data.length - 1)) * innerWidth;
  const yScale = (val: number) => padding.top + innerHeight - (val / maxValue) * innerHeight;

  // Generate smooth path from data
  const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.value) }));
  const path = generateSmoothPath(points); // Uses theme.chart.line.tension

  const pathLength = 600;

  return (
    <svg width={chartWidth} height={chartHeight}>
      <path
        d={path}
        fill="none"
        stroke={theme.colors.brand.primary}
        strokeWidth={theme.chart.line.strokeWidth}  // 4
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={interpolate(progress, [0, 1], [pathLength, 0])}
      />
      {/* X-axis labels */}
      {labels.map((label, i) => (
        <text
          key={label}
          x={xScale(i)}
          y={chartHeight - theme.chart.line.labelOffset}  // 5px from bottom
          fill={theme.chart.axisLabel.color}
          fontSize={theme.chart.axisLabel.fontSize}
          textAnchor="middle"
        >
          {label}
        </text>
      ))}
    </svg>
  );
};
```

**Multi-line Chart (use secondary stroke width):**
```typescript
// For charts with 3+ lines, use thinner strokes to avoid visual clutter
strokeWidth={theme.chart.line.strokeWidthSecondary}  // 2.5
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
