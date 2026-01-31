import "./index.css";
import "./fonts"; // Load Google Fonts (Inter, Source Serif 4)
import { Composition } from "remotion";
import { ChatDemo, ChatDemoSchema } from "./ChatDemo";
import { ChatSequence, ChatSequenceSchema } from "./ChatSequence";
import { theme, getAiChartToUserDelay } from "./theme";

// Timing constants from theme (at 60fps)
const t = theme.timing.delays;

// Helper to calculate cumulative delays for ChatSequence messages
const calcDelays = {
  // Start delay for first message
  start: t.start,
  // After user message
  userToAiText: (prevDelay: number) => prevDelay + t.userToAiText,
  userToAiThinking: (prevDelay: number) => prevDelay + t.userToAiThinking,
  // After AI message
  aiTextToUser: (prevDelay: number) => prevDelay + t.aiTextToUser,
  aiChartToUser: (prevDelay: number, thinkingSteps: number) =>
    prevDelay + getAiChartToUserDelay(thinkingSteps),
};

// Pre-calculated delays for Short sequence (6 messages)
const shortDelays = {
  msg1: calcDelays.start, // 30 - User
  msg2: calcDelays.start + t.userToAiText, // 120 - AI text
  msg3: calcDelays.start + t.userToAiText + t.aiTextToUser, // 340 - User
  msg4: calcDelays.start + t.userToAiText + t.aiTextToUser + t.userToAiThinking, // 370 - AI chart (4 steps)
  msg5:
    calcDelays.start +
    t.userToAiText +
    t.aiTextToUser +
    t.userToAiThinking +
    getAiChartToUserDelay(4), // 1050 - User
  msg6:
    calcDelays.start +
    t.userToAiText +
    t.aiTextToUser +
    t.userToAiThinking +
    getAiChartToUserDelay(4) +
    t.userToAiThinking, // 1080 - AI chart (3 steps)
};

// Pre-calculated delays for Long sequence (8 messages) - extends Short
const longDelays = {
  ...shortDelays,
  msg7: shortDelays.msg6 + getAiChartToUserDelay(3), // 1630 - User
  msg8: shortDelays.msg6 + getAiChartToUserDelay(3) + t.userToAiThinking, // 1660 - AI chart (3 steps)
};

// Pre-calculated delays for MultiTurn sequence (4 text-only messages)
const multiTurnDelays = {
  msg1: calcDelays.start, // 30 - User
  msg2: calcDelays.start + t.userToAiText, // 120 - AI text
  msg3: calcDelays.start + t.userToAiText + t.aiTextToUser, // 340 - User
  msg4: calcDelays.start + t.userToAiText + t.aiTextToUser + t.userToAiText, // 430 - AI text
};

// Pre-calculated delays for Chart sequence (2 messages)
const chartDelays = {
  msg1: calcDelays.start, // 30 - User
  msg2: calcDelays.start + t.userToAiThinking, // 60 - AI chart (4 steps)
};

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      {/* Chat Demo - Q&A with chart response */}
      <Composition
        id="Athena-ChatDemo-Ask"
        component={ChatDemo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={ChatDemoSchema}
        defaultProps={{
          brandName: "Sia",
          backgroundColor: "#fffcfb",
          messages: [
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
          ],
        }}
      />
      {/* Chat Demo - With Chart */}
      <Composition
        id="ChatSequence-Chart-BarExample"
        component={ChatDemo}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        schema={ChatDemoSchema}
        defaultProps={{
          brandName: "Sia",
          backgroundColor: "#fffcfb",
          messages: [
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
          ],
        }}
      />
      {/* Chat Demo - Task Assignment */}
      <Composition
        id="Athena-ChatDemo-Assign"
        component={ChatDemo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={ChatDemoSchema}
        defaultProps={{
          brandName: "Sia",
          backgroundColor: "#fffcfb",
          messages: [
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
          ],
        }}
      />
      {/* Chat Demo - Action Card */}
      <Composition
        id="Athena-ChatDemo-Action"
        component={ChatDemo}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        schema={ChatDemoSchema}
        defaultProps={{
          brandName: "Sia",
          backgroundColor: "#fffcfb",
          messages: [
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
          ],
        }}
      />
      {/* ChatSequence - Short version (ends after eNPS distribution) */}
      <Composition
        id="ChatSequence-Short"
        component={ChatSequence}
        durationInFrames={1900}
        fps={60}
        width={1920}
        height={1080}
        schema={ChatSequenceSchema}
        defaultProps={{
          brandName: "Sia",
          backgroundColor: "#fffcfb",
          backgroundImage: "simployer-assets/funky-bg.png",
          logoPosition: "bottom-left",
          messages: [
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
          ],
        }}
      />
      {/* ChatSequence - Long version (adds correlation analysis) */}
      <Composition
        id="ChatSequence-Long"
        component={ChatSequence}
        durationInFrames={2700}
        fps={60}
        width={1920}
        height={1080}
        schema={ChatSequenceSchema}
        defaultProps={{
          brandName: "Sia",
          backgroundColor: "#fffcfb",
          backgroundImage: "simployer-assets/funky-bg.png",
          logoPosition: "bottom-left",
          messages: [
            {
              text: "Can you summarize the headcount turnover?",
              isAi: false,
              delay: longDelays.msg1,
              userName: "Kai",
            },
            {
              text: "Certainly. The employee turnover is currently at 12%, which is a 2% decrease from last quarter. This improvement is primarily driven by better retention in the Engineering and Product teams.",
              isAi: true,
              delay: longDelays.msg2,
            },
            {
              text: "Create a chart of the joiners and leavers over the last 12 months.",
              isAi: false,
              delay: longDelays.msg3,
              userName: "Kai",
            },
            {
              isAi: true,
              delay: longDelays.msg4,
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
              delay: longDelays.msg5,
              userName: "Kai",
            },
            {
              isAi: true,
              delay: longDelays.msg6,
              reasoningSteps: [
                "Pulling the latest eNPS pulse…",
                "Sorting responses into promoters, passives, and spicy feedback…",
                "Building chart",
              ],
              chartType: "enps-distribution",
            },
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
          ],
        }}
      />
      {/* ChatSequence - Mobile Short version */}
      <Composition
        id="ChatSequence-Short-Mobile"
        component={ChatSequence}
        durationInFrames={1900}
        fps={60}
        width={1080}
        height={1226}
        schema={ChatSequenceSchema}
        defaultProps={{
          brandName: "Sia",
          backgroundColor: "#fffcfb",
          backgroundImage: "simployer-assets/funky-bg-3-mobile-cropped.png",
          logoPosition: "bottom-left",
          messages: [
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
          ],
        }}
      />
      {/* ChatSequence - Mobile Long version */}
      <Composition
        id="ChatSequence-Long-Mobile"
        component={ChatSequence}
        durationInFrames={2700}
        fps={60}
        width={1080}
        height={1226}
        schema={ChatSequenceSchema}
        defaultProps={{
          brandName: "Sia",
          backgroundColor: "#fffcfb",
          backgroundImage: "simployer-assets/funky-bg-3-mobile-cropped.png",
          logoPosition: "bottom-left",
          messages: [
            {
              text: "Can you summarize the headcount turnover?",
              isAi: false,
              delay: longDelays.msg1,
              userName: "Kai",
            },
            {
              text: "Certainly. The employee turnover is currently at 12%, which is a 2% decrease from last quarter. This improvement is primarily driven by better retention in the Engineering and Product teams.",
              isAi: true,
              delay: longDelays.msg2,
            },
            {
              text: "Create a chart of the joiners and leavers over the last 12 months.",
              isAi: false,
              delay: longDelays.msg3,
              userName: "Kai",
            },
            {
              isAi: true,
              delay: longDelays.msg4,
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
              delay: longDelays.msg5,
              userName: "Kai",
            },
            {
              isAi: true,
              delay: longDelays.msg6,
              reasoningSteps: [
                "Pulling the latest eNPS pulse…",
                "Sorting responses into promoters, passives, and spicy feedback…",
                "Building chart",
              ],
              chartType: "enps-distribution",
            },
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
          ],
        }}
      />
      {/* ChatSequence - Multi-turn conversation */}
      <Composition
        id="ChatSequence-MultiTurn"
        component={ChatSequence}
        durationInFrames={900}
        fps={60}
        width={1920}
        height={1080}
        schema={ChatSequenceSchema}
        defaultProps={{
          brandName: "Sia",
          backgroundColor: "#fffcfb",
          backgroundImage: "simployer-assets/funky-bg.png",
          logoPosition: "top-right",
          messages: [
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
          ],
        }}
      />
      {/* ChatSequence - Reasoning + Chart Widget */}
      <Composition
        id="ChatSequence-Chart"
        component={ChatSequence}
        durationInFrames={800}
        fps={60}
        width={1920}
        height={1080}
        schema={ChatSequenceSchema}
        defaultProps={{
          brandName: "Sia",
          backgroundColor: "#fffcfb",
          backgroundImage: "simployer-assets/funky-bg.png",
          logoPosition: "top-right",
          messages: [
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
          ],
        }}
      />
    </>
  );
};
