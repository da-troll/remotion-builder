import type { ChatMessage } from "../ChatSequence/schema";
import type { ChatDemoProps } from "../ChatDemo/schema";
import { shortDelays, longDelays, multiTurnDelays, chartDelays } from "./timing";

// =============================================================================
// ChatSequence Messages
// =============================================================================

// Short sequence messages (6 messages) - shared between desktop and mobile
export const shortMessages: ChatMessage[] = [
  {
    text: "Can you summarize the headcount turnover?",
    isAi: false,
    delay: shortDelays.msg1,
    userName: "Kai",
  },
  {
    text: "Certainly. The employee turnover is currently at 12%, which is a 2% decrease from last quarter. This improvement is primarily driven by better retention in the Engineering and Product teams.",
    isAi: true,
    delay: shortDelays.msg2,
  },
  {
    text: "Create a chart of the joiners and leavers over the last 12 months.",
    isAi: false,
    delay: shortDelays.msg3,
    userName: "Kai",
  },
  {
    isAi: true,
    delay: shortDelays.msg4,
    reasoningSteps: [
      "Thinking...",
      "Counting joiners...",
      "1 leaver, 2 leavers...",
      "Building chart...",
    ],
    showChart: true,
  },
  {
    text: "What's our latest eNPS—and can you show the 0–10 score distribution as a chart?",
    isAi: false,
    delay: shortDelays.msg5,
    userName: "Kai",
  },
  {
    isAi: true,
    delay: shortDelays.msg6,
    reasoningSteps: [
      "Pulling the latest eNPS pulse…",
      "Sorting responses into promoters, passives, and spicy feedback…",
      "Building chart",
    ],
    chartType: "enps-distribution",
  },
];

// Long sequence messages (8 messages) - extends short with 2 more
export const longMessages: ChatMessage[] = [
  ...shortMessages.map((msg, i) => ({
    ...msg,
    delay: [
      longDelays.msg1,
      longDelays.msg2,
      longDelays.msg3,
      longDelays.msg4,
      longDelays.msg5,
      longDelays.msg6,
    ][i],
  })),
  {
    text: "Sia—can you plot how the 6s, 7s, 8s, 9s, and 10s have shifted month-by-month over the last 12 months? And… do those shifts look related to our joiners/leavers trend in the same period?",
    isAi: false,
    delay: longDelays.msg7,
    userName: "Kai",
  },
  {
    isAi: true,
    delay: longDelays.msg8,
    reasoningSteps: [
      "Pulling the last 12 months of survey slices…",
      "Overlaying joiners/leavers to see what moves together…",
      "Building chart",
    ],
    chartType: "enps-trends-turnover",
  },
];

// MultiTurn sequence messages (4 text-only messages)
export const multiTurnMessages: ChatMessage[] = [
  {
    text: "What's our current training budget?",
    isAi: false,
    delay: multiTurnDelays.msg1,
    userName: "Tom",
  },
  {
    text: "Your learning & development budget is $5,000 per employee per year. Would you like me to show you how it's been utilized this quarter?",
    isAi: true,
    delay: multiTurnDelays.msg2,
  },
  {
    text: "Yes please, break it down by department.",
    isAi: false,
    delay: multiTurnDelays.msg3,
    userName: "Tom",
  },
  {
    text: "Here's the breakdown: Engineering used 45%, Design 28%, Marketing 15%, and Sales 12%. Engineering's higher usage is due to cloud certification programs.",
    isAi: true,
    delay: multiTurnDelays.msg4,
  },
];

// Chart sequence messages (2 messages)
export const chartMessages: ChatMessage[] = [
  {
    text: "Create a chart of the joiners and leavers over the last 12 months.",
    isAi: false,
    delay: chartDelays.msg1,
    userName: "Sarah",
  },
  {
    isAi: true,
    delay: chartDelays.msg2,
    reasoningSteps: [
      "Thinking...",
      "Counting joiners...",
      "1 leaver, 2 leavers...",
      "Building chart...",
    ],
    showChart: true,
  },
];

// =============================================================================
// ChatDemo Messages
// =============================================================================

export const chatDemoAskMessages: ChatDemoProps["messages"] = [
  {
    message: {
      type: "user" as const,
      userName: "Tom",
      text: "Do we have a training budget?",
    },
    startFrame: 0,
    durationFrames: 120,
    fadeToBackground: true,
  },
  {
    message: {
      type: "loading" as const,
      text: "Searching...",
      icon: "search" as const,
    },
    startFrame: 30,
    durationFrames: 60,
  },
  {
    message: {
      type: "ai" as const,
      text: "Yes, we do! Our learning & development budget is $5,000 per employee per year.",
    },
    startFrame: 90,
    durationFrames: 210,
  },
];

export const chatDemoChartMessages: ChatDemoProps["messages"] = [
  {
    message: {
      type: "user" as const,
      userName: "Sarah",
      text: "Show me team performance metrics",
    },
    startFrame: 0,
    durationFrames: 150,
    fadeToBackground: true,
  },
  {
    message: {
      type: "loading" as const,
      text: "Analyzing data...",
      icon: "process" as const,
    },
    startFrame: 30,
    durationFrames: 60,
  },
  {
    message: {
      type: "ai" as const,
      text: "Here are the team performance metrics for Q4:",
      showChart: true,
      chartData: [
        { label: "Engineering", value: 92 },
        { label: "Design", value: 88 },
        { label: "Marketing", value: 76 },
        { label: "Sales", value: 95 },
      ],
    },
    startFrame: 90,
    durationFrames: 270,
  },
];

export const chatDemoAssignMessages: ChatDemoProps["messages"] = [
  {
    message: {
      type: "user" as const,
      userName: "Jake",
      text: "I need help with an expense report",
    },
    startFrame: 0,
    durationFrames: 120,
    fadeToBackground: true,
  },
  {
    message: {
      type: "loading" as const,
      text: "Assigning request...",
      icon: "assign" as const,
    },
    startFrame: 30,
    durationFrames: 60,
  },
  {
    message: {
      type: "ai" as const,
      text: "Sure thing, I opened a case and assigned to Finance team to look into it.",
      assignee: {
        name: "Kristin Bale",
      },
    },
    startFrame: 90,
    durationFrames: 210,
  },
];

export const chatDemoActionMessages: ChatDemoProps["messages"] = [
  {
    message: {
      type: "action" as const,
      text: "Merging teams",
      integrationBadge: {
        name: "Hibob",
        color: "#E84855",
      },
    },
    startFrame: 0,
    durationFrames: 120,
  },
  {
    message: {
      type: "action" as const,
      text: "Sending out notifications",
      integrationBadge: {
        name: "Slack",
        color: "#4A154B",
      },
    },
    startFrame: 90,
    durationFrames: 150,
  },
];
