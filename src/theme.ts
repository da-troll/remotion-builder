// src/theme.ts - Simployer Design System Tokens

export const theme = {
  colors: {
    brand: {
      primary: "#9773ff", // color/brand/primary
      primaryDark: "#2d0c69", // color/brand/primary-dark
      primaryLight: "#ece8ff", // color/brand/primary-light
      secondary: "#ff9573", // color/brand/secondary
      secondaryPurple: "#8955fd", // Former charts.purple (lilac) - preserved for future use
      quinary: "#ff9ed0", // color/brand/quinary (Pink used in charts)
    },
    text: {
      default: "#16141e", // color/text/default
      secondary: "#706e78", // color/text/secondary
      disabled: "#8b8892", // color/text/disabled
      link: "#3f51b5", // color/text/link
      inverted: "#ffffff", // color/brand/on-primary
    },
    surface: {
      main: "#ffffff", // color/brand/surface (Widget backgrounds)
      variant: "#f2f0f7", // color/brand/surface-variant
      viewport: "#fffcfb", // color/system/viewport (Main background)
      outline: "#dddbe4", // color/system/outline
    },
    // Extracted from "color/chips/*" - essential for Charts/Graphs
    charts: {
      purple: "#9773ff", // Now matches brand.primary for consistency
      pink: "#ff9ed0", // color/chips/blossom
      green: "#80e4a6", // color/chips/mint
      orange: "#F2B299", // color/chips/papaya (adjusted)
      blue: "#2380c5", // color/chips/sky
      teal: "#0f6f69", // color/chips/teal
    },
    status: {
      success: "#e6f3ed", // color/system/success
      onSuccess: "#10563a", // color/system/on-success
      error: "#ffdcd9",
      onError: "#920d0d",
    },
  },
  typography: {
    fontFamily: {
      heading: "Inter", // system/typography/family-heading
      body: "Inter", // system/typography/family-body
      display: '"Source Serif 4"', // system/typography/family-display
    },
    // Rem values converted to pixel numbers (assuming 16px root)
    size: {
      h1: 46, // ~2.9rem
      h2: 38, // ~2.4rem
      h3: 30, // ~1.9rem
      body: 16,
      small: 13,
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  layout: {
    borderRadius: {
      card: 16, // size/radius/l (1rem)
      button: 8, // size/radius/button
      small: 4,
      bubble: 20, // Chat bubble corners
      tail: 4, // Sharp corner on bubble "tail" side
    },
    gap: {
      card: 16, // size/gap/card
      section: 24,
    },
    shadow: {
      card: "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
      elevated: "0 4px 12px rgba(0, 0, 0, 0.08)",
    },
  },
  // Chart styling tokens - ensures consistency across all chart components
  chart: {
    // Chart title styling
    title: {
      fontFamily: "Inter", // matches typography.fontFamily.heading
      fontSize: 18,
      fontWeight: 400, // regular - clean, not too bold
      color: "#706e78", // text.secondary
      marginBottom: 16,
    },
    // Axis labels (x-axis, y-axis)
    axisLabel: {
      fontFamily: "Inter", // matches typography.fontFamily.body
      fontSize: 12,
      fontWeight: 400,
      color: "#706e78", // text.secondary
    },
    // Legend text styling
    legend: {
      fontFamily: "Inter",
      fontSize: 12,
      fontWeight: 500, // medium - slightly emphasized
      color: "#706e78", // text.secondary
      gap: 6, // gap between legend items (vertical)
      horizontalGap: 20, // gap between legend items (horizontal layout)
      itemGap: 8, // gap between indicator and text
      // Legend indicator variants
      indicator: {
        // Pill shape - for line charts
        pill: {
          width: 16,
          height: 4,
          borderRadius: 4,
        },
        // Square shape - for bar charts
        square: {
          width: 12,
          height: 12,
          borderRadius: 3,
        },
      },
    },
    // Chart dimensions
    width: 480, // Overall card/component width
    contentWidth: 480, // Width of the chart/graph content (SVG area)
    contentHeight: 220, // Default height for chart content
    // Compact variants (for embedded/smaller charts)
    compact: {
      title: {
        fontSize: 14,
        marginBottom: 8,
      },
      axisLabel: {
        fontSize: 10,
      },
      legend: {
        fontSize: 10,
        gap: 12, // horizontal gap when compact
        itemGap: 4,
        indicator: {
          pill: {
            width: 12,
            height: 3,
          },
          square: {
            width: 10,
            height: 10,
            borderRadius: 2,
          },
        },
      },
      width: 400,
      contentWidth: 400,
      contentHeight: 160,
    },
    // Card container styling
    card: {
      padding: "24px 24px 32px 24px",
      // backgroundColor, borderRadius, boxShadow use layout tokens
    },
    // Line chart specific tokens
    line: {
      strokeWidth: 4, // Primary line thickness
      strokeWidthSecondary: 2.5, // Thinner lines for dense multi-line charts
      tension: 0.3, // Catmull-Rom bezier curve tension (0 = straight, 1 = very curved)
      // Padding around chart content (SVG coordinate space)
      padding: {
        top: 10,
        right: 20,
        bottom: 25,
        left: 30,
      },
      // Distance from last data point to x-axis labels
      labelOffset: 5,
    },
  },
  // Animation timing constants (in frames at 60fps)
  timing: {
    // Message delays by category
    delays: {
      start: 30, // Before first message appears (0.5s)
      userToAiText: 90, // After user message, before AI text response (1.5s)
      userToAiThinking: 30, // After user message, before AI thinking/chart (0.5s - very brief)
      aiTextToUser: 220, // After AI text, before next user message (3.67s)
      aiChartToUser: {
        // After AI chart, before next user message (thinking time + viewing time)
        base: 140, // Base viewing time after chart appears
        perThinkingStep: 136, // Frames per thinking step (2.27s each)
      },
    },
    // Thinking animation
    thinkingDurationPerStep: 136, // Duration of each thinking step (2.27s at 60fps)
    // Typewriter effect
    charsPerFrame: 1.125, // Characters revealed per frame
    // Shimmer animation cycle
    shimmerCycle: 160, // Frames for one shimmer cycle
  },
} as const;

// Helper function to calculate AI chart to user delay
export const getAiChartToUserDelay = (thinkingSteps: number): number => {
  return (thinkingSteps * theme.timing.delays.aiChartToUser.perThinkingStep) +
         theme.timing.delays.aiChartToUser.base;
};

// Helper to get chart colors as an array for ChartCard
export const chartColors = Object.values(theme.colors.charts);

// Type exports for TypeScript
export type Theme = typeof theme;
export type BrandColors = typeof theme.colors.brand;
export type ChartColors = typeof theme.colors.charts;
