import { theme, getAiChartToUserDelay } from "../theme";

// Timing constants from theme (at 60fps)
const t = theme.timing.delays;

// Helper to calculate cumulative delays for ChatSequence messages
export const calcDelays = {
  start: t.start,
  userToAiText: (prevDelay: number) => prevDelay + t.userToAiText,
  userToAiThinking: (prevDelay: number) => prevDelay + t.userToAiThinking,
  aiTextToUser: (prevDelay: number) => prevDelay + t.aiTextToUser,
  aiChartToUser: (prevDelay: number, thinkingSteps: number) =>
    prevDelay + getAiChartToUserDelay(thinkingSteps),
};

// Pre-calculated delays for Short sequence (6 messages)
export const shortDelays = {
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
export const longDelays = {
  ...shortDelays,
  msg7: shortDelays.msg6 + getAiChartToUserDelay(3), // 1630 - User
  msg8: shortDelays.msg6 + getAiChartToUserDelay(3) + t.userToAiThinking, // 1660 - AI chart (3 steps)
};

// Pre-calculated delays for MultiTurn sequence (4 text-only messages)
export const multiTurnDelays = {
  msg1: calcDelays.start, // 30 - User
  msg2: calcDelays.start + t.userToAiText, // 120 - AI text
  msg3: calcDelays.start + t.userToAiText + t.aiTextToUser, // 340 - User
  msg4: calcDelays.start + t.userToAiText + t.aiTextToUser + t.userToAiText, // 430 - AI text
};

// Pre-calculated delays for Chart sequence (2 messages)
export const chartDelays = {
  msg1: calcDelays.start, // 30 - User
  msg2: calcDelays.start + t.userToAiThinking, // 60 - AI chart (4 steps)
};
