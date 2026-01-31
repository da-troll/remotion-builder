# Remotion Video Project

A Remotion-based video project template for creating animated videos with React components.

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
├── theme.ts                 # Design tokens (colors, typography, timing)
├── fonts.ts                 # Font configuration
├── index.css                # Global styles (TailwindCSS v4)
│
├── compositions/            # All composition definitions
│   ├── index.tsx            # Exports AllCompositions component
│   ├── timing.ts            # Pre-calculated delay values
│   ├── messages.ts          # Shared content/props for compositions
│   └── [Category]Compositions.tsx  # Grouped compositions by category
│
└── [ComponentName]/         # Feature-specific components
    ├── ComponentName.tsx    # Main component
    ├── schema.ts            # Zod schemas for type-safe props
    └── ...                  # Supporting components
```

## Organizing Compositions with Folders

Use `<Folder>` to group compositions in the Studio sidebar:

```tsx
import { Composition, Folder } from "remotion";

export const MyCompositions: React.FC = () => (
  <Folder name="Marketing">
    <Folder name="Desktop">
      <Composition id="promo-video" ... />
      <Composition id="explainer" ... />
    </Folder>
    <Folder name="Mobile">
      <Composition id="promo-video-mobile" ... />
    </Folder>
  </Folder>
);
```

**Folder naming rules:**
- Only letters, numbers, and `-` (no spaces or underscores)
- Can be nested arbitrarily deep

## Creating Compositions

### Step 1: Define your content in `compositions/messages.ts`

```typescript
export const myVideoContent = {
  title: "Welcome",
  subtitle: "Getting Started Guide",
  items: ["Step 1", "Step 2", "Step 3"],
};
```

### Step 2: Create composition in the appropriate file

```tsx
// compositions/MarketingCompositions.tsx
import { Composition, Folder } from "remotion";
import { MyComponent, MyComponentSchema } from "../MyComponent";
import { myVideoContent } from "./messages";

export const MarketingCompositions: React.FC = () => (
  <Folder name="Marketing">
    <Composition
      id="my-video"
      component={MyComponent}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      schema={MyComponentSchema}
      defaultProps={myVideoContent}
    />
  </Folder>
);
```

### Step 3: Export from `compositions/index.tsx`

```tsx
import { MarketingCompositions } from "./MarketingCompositions";

export const AllCompositions: React.FC = () => (
  <>
    <MarketingCompositions />
    {/* Add more composition groups here */}
  </>
);
```

## Theme System

Centralize design tokens in `theme.ts`:

```typescript
export const theme = {
  colors: {
    brand: {
      primary: "#9773ff",
      secondary: "#ff9573",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#666666",
    },
    surface: {
      main: "#ffffff",
      variant: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: {
      heading: "Inter",
      body: "Inter",
    },
    fontSize: {
      sm: 14,
      md: 16,
      lg: 24,
      xl: 32,
    },
  },
  timing: {
    // Frame-based timing at 60fps
    fadeIn: 30,      // 0.5s
    stagger: 10,     // delay between items
  },
};
```

## Animation Patterns

### Spring animations

```typescript
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  return <div style={{ transform: `scale(${scale})` }}>Hello</div>;
};
```

### Interpolated values

```typescript
import { interpolate, useCurrentFrame } from "remotion";

const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: "clamp",
});
```

### Staggered animations

```typescript
const items = ["A", "B", "C"];

items.map((item, i) => {
  const delay = i * 10; // 10 frames between each
  const itemOpacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity: itemOpacity }}>{item}</div>;
});
```

## Rendering

### Preview in Studio
```bash
npm run dev
```

### Render single composition
```bash
npx remotion render my-video
```

### Render with options
```bash
# Custom output path
npx remotion render my-video --output=out/my-video.mp4

# Custom codec
npx remotion render my-video --codec=h264

# Custom quality (CRF 0-51, lower = better)
npx remotion render my-video --crf=18

# Scale resolution
npx remotion render my-video --scale=0.5
```

### Render all compositions
```bash
npx remotion render
```

## Best Practices

1. **Centralize timing** - Use `theme.timing` constants instead of magic numbers
2. **Share content** - Put reusable props in `messages.ts` to avoid duplication
3. **Group compositions** - Use `<Folder>` to organize by category, platform, or project
4. **Type your props** - Use Zod schemas for type-safe composition props
5. **Use springs** - Prefer `spring()` over linear interpolation for natural motion
6. **Test at target FPS** - Always preview at your target frame rate (30 or 60fps)

## Troubleshooting

### Fonts not loading
Ensure fonts are loaded in `fonts.ts` and files exist in `public/fonts/`.

### Timing issues after FPS change
All timing values are in frames. Changing FPS (e.g., 30 → 60) requires multiplying delays by 2.

### Animations not syncing
Components use local `frame` from `useCurrentFrame()`. Use a `delay` prop to offset when animations start.

## Links

- [Remotion Documentation](https://www.remotion.dev/docs/the-fundamentals)
- [Remotion Discord](https://discord.gg/6VzzNDwUwV)
- [Report Issues](https://github.com/remotion-dev/remotion/issues/new)

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
