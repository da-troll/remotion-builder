import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const ChatMessageSchema = z.object({
  text: z.string().optional(),
  isAi: z.boolean(),
  delay: z.number(), // Frame delay before this message appears
  userName: z.string().optional(),
  userAvatar: z.string().optional(),
  reasoningSteps: z.array(z.string()).optional(),
  showChart: z.boolean().optional(), // Flag to show chart widget (legacy, uses joiners-leavers)
  chartType: z.enum(["joiners-leavers", "enps-distribution", "enps-vs-turnover", "enps-trends-turnover"]).optional(),
});

export const ChatSequenceSchema = z.object({
  brandName: z.string().default("Sia"),
  logoSrc: z.string().optional(),
  backgroundColor: zColor().default("#fffcfb"),
  backgroundImage: z.string().optional(),
  logoPosition: z.enum(["top-left", "top-right", "bottom-left", "bottom-right"]).optional().default("bottom-left"),
  messages: z.array(ChatMessageSchema),
});

export type ChatSequenceProps = z.infer<typeof ChatSequenceSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
