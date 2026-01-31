import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const ChatMessageSchema = z.object({
  text: z.string().optional(),
  isAi: z.boolean(),
  delay: z.number(), // Frame delay before this message appears
  userName: z.string().optional(),
  userAvatar: z.string().optional(), // Path to user avatar image (relative to public/)
  reasoningSteps: z.array(z.string()).optional(),
  showChart: z.boolean().optional(), // Flag to show chart widget (legacy, uses joiners-leavers)
  chartType: z.enum([
    // Existing chart types
    "joiners-leavers",
    "enps-distribution",
    "enps-vs-turnover",
    "enps-trends-turnover",
    // Option 1: Burnout/Capacity story
    "capacity-stress-signal",
    "capacity-hotspots-table",
    "burnout-fast-fixes",
    // Option 2: Policy impact story
    "policy-impact-overview",
    "policy-impact-segments",
    // Option 3: Skills coverage story
    "skills-coverage-risk",
    "skills-coverage-gap-next-30",
    "skills-mitigation-plan",
    // Option 4: Manager load story
    "manager-load-signal",
    "manager-outliers-table",
    "manager-load-interventions",
    // Option 5: Reviews to retention story
    "reviews-to-retention-signal",
    "review-gap-by-dept",
    "review-driver-deltas",
  ]).optional(),
});

export const ChatSequenceSchema = z.object({
  backgroundColor: zColor().default("#fffcfb"),
  backgroundImage: z.string().optional(),
  logoPosition: z.enum(["top-left", "top-right", "bottom-left", "bottom-right"]).optional().default("bottom-left"),
  carouselMode: z.boolean().optional().default(false), // When true, older messages fade out as new ones appear
  gradientFade: z.boolean().optional().default(false), // When true, adds gradient overlay that fades messages towards top
  messages: z.array(ChatMessageSchema),
});

export type ChatSequenceProps = z.infer<typeof ChatSequenceSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
