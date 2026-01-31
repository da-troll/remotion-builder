import type { ChatMessage } from "../ChatSequence/schema";
import type { ChatDemoProps } from "../ChatDemo/schema";
import { shortDelays, longDelays, multiTurnDelays, chartDelays, storyDelays } from "./timing";

// =============================================================================
// User Avatar Paths
// =============================================================================

const avatars = {
  // AI assistant
  sia: "simployer-assets/Simployer Symbol/Symbol - Purple.svg",
  // Human users
  robert: "user-avatars/Persona=Reluctant Robert, Photo=True.png",
  robertMemoji: "user-avatars/Persona=Reluctant Robert, Photo=False.png",
  maria: "user-avatars/Persona=Multitasking Maria, Photo=True.png",
  mariaMemoji: "user-avatars/Persona=Multitasking Maria, Photo=False.png",
  olivia: "user-avatars/Persona=Overwhelmed Olivia, Photo=True.png",
  oliviaMemoji: "user-avatars/Persona=Overwhelmed Olivia, Photo=False.png",
};

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
    userAvatar: avatars.robert,
  },
  {
    text: "Certainly. The employee turnover is currently at 12%, which is a 2% decrease from last quarter. This improvement is primarily driven by better retention in the Engineering and Product teams.",
    isAi: true,
    delay: shortDelays.msg2,
    userName: "Sia",
    userAvatar: avatars.sia,
  },
  {
    text: "Create a chart of the joiners and leavers over the last 12 months.",
    isAi: false,
    delay: shortDelays.msg3,
    userName: "Kai",
    userAvatar: avatars.robert,
  },
  {
    isAi: true,
    delay: shortDelays.msg4,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Thinking",
      "Counting joiners",
      "1 leaver, 2 leavers",
      "Building chart",
    ],
    showChart: true,
  },
  {
    text: "What's our latest eNPS—and can you show the 0–10 score distribution as a chart?",
    isAi: false,
    delay: shortDelays.msg5,
    userName: "Kai",
    userAvatar: avatars.robert,
  },
  {
    isAi: true,
    delay: shortDelays.msg6,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Pulling the latest eNPS pulse",
      "Sorting responses into promoters, passives, and spicy feedback",
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
    userAvatar: avatars.robert,
  },
  {
    isAi: true,
    delay: longDelays.msg8,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Pulling the last 12 months of survey slices",
      "Overlaying joiners/leavers to see what moves together",
      "Building chart",
    ],
    chartType: "enps-trends-turnover",
    chartInsight: "9–10s dip when leavers spike (Oct–Nov), while 6–7s rise. Correlation looks strong (illustrative) — worth slicing by team next. Correlation ≠ causation.",
  },
];

// MultiTurn sequence messages (4 text-only messages)
export const multiTurnMessages: ChatMessage[] = [
  {
    text: "What's our current training budget?",
    isAi: false,
    delay: multiTurnDelays.msg1,
    userName: "Tom",
    userAvatar: avatars.maria,
  },
  {
    text: "Your learning & development budget is $5,000 per employee per year. Would you like me to show you how it's been utilized this quarter?",
    isAi: true,
    delay: multiTurnDelays.msg2,
    userName: "Sia",
    userAvatar: avatars.sia,
  },
  {
    text: "Yes please, break it down by department.",
    isAi: false,
    delay: multiTurnDelays.msg3,
    userName: "Tom",
    userAvatar: avatars.maria,
  },
  {
    text: "Here's the breakdown: Engineering used 45%, Design 28%, Marketing 15%, and Sales 12%. Engineering's higher usage is due to cloud certification programs.",
    isAi: true,
    delay: multiTurnDelays.msg4,
    userName: "Sia",
    userAvatar: avatars.sia,
  },
];

// Chart sequence messages (2 messages)
export const chartMessages: ChatMessage[] = [
  {
    text: "Create a chart of the joiners and leavers over the last 12 months.",
    isAi: false,
    delay: chartDelays.msg1,
    userName: "Sarah",
    userAvatar: avatars.olivia,
  },
  {
    isAi: true,
    delay: chartDelays.msg2,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Thinking",
      "Counting joiners",
      "1 leaver, 2 leavers",
      "Building chart",
    ],
    showChart: true,
  },
];

// =============================================================================
// Burnout/Capacity Story Messages (8 messages)
// =============================================================================
export const burnoutCapacityMessages: ChatMessage[] = [
  {
    text: "Sia—I'm hearing burnout in 1:1s. Is it real, or just loud anecdotes? Show me something concrete.",
    isAi: false,
    delay: storyDelays.msg1,
    userName: "Maria",
    userAvatar: avatars.maria,
  },
  {
    text: "Let's ground it in signals: workload sentiment, sick leave, and whether people are actually taking time off. If those move together, it's capacity—not vibes.",
    isAi: true,
    delay: storyDelays.msg2,
    userName: "Sia",
    userAvatar: avatars.sia,
  },
  {
    text: "Okay. Give me the last 12 months. Keep it simple.",
    isAi: false,
    delay: storyDelays.msg3,
    userName: "Maria",
    userAvatar: avatars.maria,
  },
  {
    isAi: true,
    delay: storyDelays.msg4,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Pulling workload sentiment trends",
      "Overlaying sick leave and vacation usage",
      "Building chart",
    ],
    chartType: "capacity-stress-signal",
    chartInsight: "Workload drops → sick leave rises ~4 weeks later. Vacation usage dips at the same time.",
  },
  {
    text: "Where is it concentrated? I need the top hotspots I should act on this week.",
    isAi: false,
    delay: storyDelays.msg5,
    userName: "Maria",
    userAvatar: avatars.maria,
  },
  {
    isAi: true,
    delay: storyDelays.msg6,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Ranking teams by workload drop + sick leave rise",
      "Filtering for reliable response rates",
      "Building chart",
    ],
    chartType: "capacity-hotspots-table",
    chartInsight: "Sorted by workload drop + sick leave rise. Vacation backlog = % with >10 days remaining.",
  },
  {
    text: "And what's the fastest intervention that actually helps?",
    isAi: false,
    delay: storyDelays.msg7,
    userName: "Maria",
    userAvatar: avatars.maria,
  },
  {
    isAi: true,
    delay: storyDelays.msg8,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Checking manager approval/task bottlenecks",
      "Finding the quickest operational levers",
      "Building chart",
    ],
    chartType: "burnout-fast-fixes",
    chartInsight: {
      heading: "Recommended interventions:",
      items: [
        "Delegate approvals for top managers for 2 weeks",
        "Pre-approve vacation blocks for hotspot teams",
        "Run a 3-question pulse on workload & recovery",
      ],
    },
  },
];

// =============================================================================
// Policy Impact Story Messages (8 messages)
// =============================================================================
export const policyImpactMessages: ChatMessage[] = [
  {
    text: "Sia, we updated our remote work policy. Did it actually change anything—or did we just write nicer words?",
    isAi: false,
    delay: storyDelays.msg1,
    userName: "Kai",
    userAvatar: avatars.robert,
  },
  {
    text: "We can measure it. I'll compare behavior (remote work entries) and sentiment (a relevant survey driver) before and after the policy change.",
    isAi: true,
    delay: storyDelays.msg2,
    userName: "Sia",
    userAvatar: avatars.sia,
  },
  {
    text: "Show me before vs after. One clean chart.",
    isAi: false,
    delay: storyDelays.msg3,
    userName: "Kai",
    userAvatar: avatars.robert,
  },
  {
    isAi: true,
    delay: storyDelays.msg4,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Finding the policy update date",
      "Comparing behavior and sentiment before/after",
      "Building chart",
    ],
    chartType: "policy-impact-overview",
    chartInsight: "Adoption increased immediately; clarity improved gradually.",
  },
  {
    text: "Nice. Where did it improve—and where didn't it move at all?",
    isAi: false,
    delay: storyDelays.msg5,
    userName: "Kai",
    userAvatar: avatars.robert,
  },
  {
    isAi: true,
    delay: storyDelays.msg6,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Segmenting by department and team",
      "Checking response rates for confidence",
      "Building chart",
    ],
    chartType: "policy-impact-segments",
    chartInsight: "Marketing and Sales show flat adoption — may need targeted manager guidance.",
  },
  {
    text: "So what's the move—what should we do next?",
    isAi: false,
    delay: storyDelays.msg7,
    userName: "Kai",
    userAvatar: avatars.robert,
  },
  {
    text: "Behavior moved fast—sentiment lags unless we make it consistent.",
    isAi: true,
    delay: storyDelays.msg8,
    userName: "Sia",
    userAvatar: avatars.sia,
    chartInsight: {
      heading: "Two quick wins:",
      items: [
        "Tighten manager guidance where adoption stayed flat",
        "Run a 3-question pulse on clarity + fairness",
      ],
    },
  },
];

// =============================================================================
// Skills Coverage Story Messages (8 messages)
// =============================================================================
export const skillsCoverageMessages: ChatMessage[] = [
  {
    text: "Sia—do we have any single points of failure? Like critical skills where one absence would break coverage.",
    isAi: false,
    delay: storyDelays.msg1,
    userName: "Kai",
    userAvatar: avatars.robert,
  },
  {
    text: "Yes. I'll map skill/cert coverage and then check upcoming leave so we can spot where coverage could hit zero.",
    isAi: true,
    delay: storyDelays.msg2,
    userName: "Sia",
    userAvatar: avatars.sia,
  },
  {
    text: "Show me the risk areas. Keep it high signal.",
    isAi: false,
    delay: storyDelays.msg3,
    userName: "Kai",
    userAvatar: avatars.robert,
  },
  {
    isAi: true,
    delay: storyDelays.msg4,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Scanning skill and certificate coverage",
      "Finding single-owner and low-coverage areas",
      "Building chart",
    ],
    chartType: "skills-coverage-risk",
    chartInsight: "4 critical skills have 1–2 person coverage — single point of failure risk.",
  },
  {
    text: "Now overlay planned leave. What could go to zero coverage in the next 30 days?",
    isAi: false,
    delay: storyDelays.msg5,
    userName: "Kai",
    userAvatar: avatars.robert,
  },
  {
    isAi: true,
    delay: storyDelays.msg6,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Checking planned leave for skill holders",
      "Flagging weeks with coverage gaps",
      "Building chart",
    ],
    chartType: "skills-coverage-gap-next-30",
    chartInsight: "16 total gap days across 3 critical skills. Week 3 is highest risk.",
  },
  {
    text: "Give me a mitigation plan I can actually execute this month.",
    isAi: false,
    delay: storyDelays.msg7,
    userName: "Kai",
    userAvatar: avatars.robert,
  },
  {
    isAi: true,
    delay: storyDelays.msg8,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Choosing best backup candidates",
      "Drafting a 30–60–90 plan with tasks",
      "Building chart",
    ],
    chartType: "skills-mitigation-plan",
    chartInsight: "Priority: AWS and SOC 2 coverage gaps are most urgent — both have approved leave in Week 2–3.",
  },
];

// =============================================================================
// Manager Load Story Messages (8 messages) - Option 4
// =============================================================================
export const managerLoadMessages: ChatMessage[] = [
  {
    text: "Sia—are our managers overloaded right now? I keep hearing \"everything is stuck\" and \"no one has time.\"",
    isAi: false,
    delay: storyDelays.msg1,
    userName: "Maria",
    userAvatar: avatars.maria,
  },
  {
    text: "I can quantify it. I'll combine manager task backlog, span of control, and the survey signal for manager support—and sanity-check it against sick leave.",
    isAi: true,
    delay: storyDelays.msg2,
    userName: "Sia",
    userAvatar: avatars.sia,
  },
  {
    text: "Perfect. Give me a clean view for the last 12 months.",
    isAi: false,
    delay: storyDelays.msg3,
    userName: "Maria",
    userAvatar: avatars.maria,
  },
  {
    isAi: true,
    delay: storyDelays.msg4,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Pulling manager backlog trends",
      "Overlaying manager support and sick leave",
      "Building chart",
    ],
    chartType: "manager-load-signal",
    chartInsight: "As backlog rises in Oct–Nov, manager support softens and sick leave ticks up.",
  },
  {
    text: "Okay—who are the biggest outliers? Teams + managers. Keep it high signal.",
    isAi: false,
    delay: storyDelays.msg5,
    userName: "Maria",
    userAvatar: avatars.maria,
  },
  {
    isAi: true,
    delay: storyDelays.msg6,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Ranking managers by approvals and overdue tasks",
      "Checking span of control and response rates",
      "Building chart",
    ],
    chartType: "manager-outliers-table",
    chartInsight: "Sorted by overdue approvals + span of control. Support Δ = last 3 months.",
  },
  {
    text: "Give me a fix we can execute this week—something operational, not \"do better.\"",
    isAi: false,
    delay: storyDelays.msg7,
    userName: "Maria",
    userAvatar: avatars.maria,
  },
  {
    isAi: true,
    delay: storyDelays.msg8,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Finding the fastest bottleneck removals",
      "Drafting a short intervention plan",
      "Building chart",
    ],
    chartType: "manager-load-interventions",
    chartInsight: {
      heading: "Recommended interventions:",
      items: [
        "Add backup approvers for 2 weeks",
        "Batch-approve low-risk requests daily at 3pm",
        "Run a 3-question pulse on clarity + workload in hotspot teams",
      ],
    },
  },
];

// =============================================================================
// Reviews to Retention Story Messages (8 messages) - Option 5
// =============================================================================
export const reviewsRetentionMessages: ChatMessage[] = [
  {
    text: "Sia, blunt question: do our performance reviews actually help—or do we lose people after bad outcomes?",
    isAi: false,
    delay: storyDelays.msg1,
    userName: "Olivia",
    userAvatar: avatars.olivia,
  },
  {
    text: "We can check. I'll compare review outcomes to subsequent engagement shifts and leavers—high level, no guessing, just patterns.",
    isAi: true,
    delay: storyDelays.msg2,
    userName: "Sia",
    userAvatar: avatars.sia,
  },
  {
    text: "Show me a clean signal over the last 12 months.",
    isAi: false,
    delay: storyDelays.msg3,
    userName: "Olivia",
    userAvatar: avatars.olivia,
  },
  {
    isAi: true,
    delay: storyDelays.msg4,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Pulling review outcomes by cycle",
      "Overlaying leavers and engagement shifts",
      "Building chart",
    ],
    chartType: "reviews-to-retention-signal",
    chartInsight: "Departments with weaker outcomes tend to see leavers rise in the next window.",
  },
  {
    text: "Where is the gap biggest? Department view—keep it to the point.",
    isAi: false,
    delay: storyDelays.msg5,
    userName: "Olivia",
    userAvatar: avatars.olivia,
  },
  {
    isAi: true,
    delay: storyDelays.msg6,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Comparing departments against baseline",
      "Filtering for response rate confidence",
      "Building chart",
    ],
    chartType: "review-gap-by-dept",
    chartInsight: "Operations and Customer Success show the largest gaps — worth investigating.",
  },
  {
    text: "What explains the weakest department? Give me the likely driver signal.",
    isAi: false,
    delay: storyDelays.msg7,
    userName: "Olivia",
    userAvatar: avatars.olivia,
  },
  {
    isAi: true,
    delay: storyDelays.msg8,
    userName: "Sia",
    userAvatar: avatars.sia,
    reasoningSteps: [
      "Checking driver deltas around the review window",
      "Summarizing the strongest explanatory signals",
      "Building chart",
    ],
    chartType: "review-driver-deltas",
    chartInsight: "Biggest drops cluster around clarity + fairness. Recommend manager calibration + clearer rubric.",
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
      userAvatar: avatars.maria,
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
      userAvatar: avatars.olivia,
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
      userAvatar: avatars.robert,
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
