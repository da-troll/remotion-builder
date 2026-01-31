import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../theme";
import { fonts } from "../fonts";
import { BrandLogo } from "../ChatDemo/BrandLogo";

// Timing constants from theme
const timing = theme.timing;

type ThinkingStep = string;

interface MessageBubbleProps {
  text?: string;
  isAi: boolean;
  delay: number;
  userName?: string;
  userAvatar?: string;
  brandName?: string;
  logoSrc?: string;
  // New props for reasoning & chart
  reasoningSteps?: ThinkingStep[];
  chartWidget?: React.ReactNode;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  isAi,
  delay,
  userName = "User",
  userAvatar,
  brandName = "Sia",
  logoSrc,
  reasoningSteps,
  chartWidget,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Calculate relative frame time
  const activeFrame = frame - delay;

  // 2. Don't render anything until 10 frames before appearance (for pre-loading)
  if (activeFrame < -10) return null;

  // 3. Spring for the container appearance - starts at frame 0 (when activeFrame >= 0)
  const entranceProgress = spring({
    frame: Math.max(0, activeFrame),
    fps,
    config: { damping: 18, stiffness: 80 },
  });

  // Height animation spring - smoother, slower for layout shifts
  const heightProgress = spring({
    frame: Math.max(0, activeFrame),
    fps,
    config: { damping: 30, stiffness: 35, mass: 1.2 },
  });

  // Before delay, keep everything at 0
  const containerEntrance = activeFrame < 0 ? 0 : entranceProgress;

  // 4. Reasoning/Thinking Logic
  const thinkingDurationPerStep = timing.thinkingDurationPerStep;
  const totalThinkingTime = reasoningSteps
    ? reasoningSteps.length * thinkingDurationPerStep
    : 0;
  const isThinking = reasoningSteps && activeFrame < totalThinkingTime;

  // Current thinking step
  const currentStepIndex = Math.min(
    Math.floor(activeFrame / thinkingDurationPerStep),
    (reasoningSteps?.length || 1) - 1
  );

  // Shimmer animation - continuous across all thinking steps
  const shimmerPos = interpolate(activeFrame % timing.shimmerCycle, [0, timing.shimmerCycle], [100, -100]);

  // 5. Chart Expansion Spring (triggers after thinking completes)
  const expansionSpring = reasoningSteps
    ? spring({
        frame: Math.max(0, activeFrame - totalThinkingTime),
        fps,
        config: { stiffness: 80, damping: 14 },
      })
    : 1;

  // 6. Ghost Text Typewriter Logic (only for regular text messages)
  const charsPerFrame = timing.charsPerFrame;
  const textContent = text || "";
  const splitIndex = isAi
    ? Math.min(Math.floor(activeFrame * charsPerFrame), textContent.length)
    : textContent.length;

  // Create the two parts (visible + ghost)
  const visiblePart = textContent.slice(0, splitIndex);
  const invisiblePart = textContent.slice(splitIndex);

  // Determine if this is a reasoning/chart message or a text message
  const isReasoningMessage = reasoningSteps && chartWidget;

  // Calculate animated height for smooth layout shifts
  const animatedHeight = activeFrame < 0 ? 0 : heightProgress;

  return (
    <div
      style={{
        // Outer wrapper for height animation - prevents layout jumps
        maxHeight: interpolate(animatedHeight, [0, 1], [0, 900]),
        overflow: "hidden",
        marginBottom: interpolate(animatedHeight, [0, 1], [0, 16]),
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: isAi ? "flex-start" : "flex-end",
          // Container entrance: opacity + transform
          opacity: containerEntrance,
          transform: `translateY(${10 * (1 - containerEntrance)}px) scale(${0.98 + 0.02 * containerEntrance})`,
          transformOrigin: isAi ? "bottom left" : "bottom right",
        }}
      >
      {/* AI Avatar */}
      {isAi && (
        <div style={{ marginRight: 12, flexShrink: 0 }}>
          <BrandLogo size={40} imageSrc={logoSrc} />
        </div>
      )}

      {/* Bubble Container */}
      <div
        style={{
          maxWidth: isReasoningMessage ? "80%" : "70%",
          padding: "16px 20px",
          minHeight: 48,
          backgroundColor: isAi
            ? theme.colors.surface.variant
            : theme.colors.brand.primary,
          color: isAi
            ? theme.colors.text.secondary
            : theme.colors.text.inverted,
          fontFamily: fonts.body,
          fontSize: theme.typography.size.body + 2,
          lineHeight: 1.5,
          borderRadius: theme.layout.borderRadius.bubble,
          // Sharp corner on the "tail" side
          borderBottomLeftRadius: isAi
            ? theme.layout.borderRadius.tail
            : theme.layout.borderRadius.bubble,
          borderBottomRightRadius: isAi
            ? theme.layout.borderRadius.bubble
            : theme.layout.borderRadius.tail,
          boxShadow: theme.layout.shadow.card,
        }}
      >
        {/* Name label */}
        <div
          style={{
            fontSize: theme.typography.size.body + 2,
            fontWeight: theme.typography.weight.semibold,
            color: isAi ? theme.colors.text.secondary : "rgba(255,255,255,0.85)",
            marginBottom: 6,
          }}
        >
          {isAi ? brandName : userName}
        </div>

        {/* REASONING/CHART MESSAGE */}
        {isReasoningMessage && (
          <>
            {/* PHASE 1: THINKING with Shimmer Effect */}
            {isThinking && reasoningSteps && (
              <div
                style={{
                  fontWeight: theme.typography.weight.medium,
                  fontSize: theme.typography.size.body,
                  background:
                    "linear-gradient(90deg, #706e78 0%, #706e78 42%, #ffffff 50%, #706e78 58%, #706e78 100%)",
                  backgroundSize: "300% 100%",
                  backgroundPosition: `${shimmerPos}% 0`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {reasoningSteps[currentStepIndex]}
              </div>
            )}

            {/* PHASE 2: CHART (Reveals after thinking) */}
            {!isThinking && chartWidget && (
              <div
                style={{
                  maxHeight: interpolate(expansionSpring, [0, 1], [0, 1000]),
                  opacity: expansionSpring,
                  overflow: "hidden",
                }}
              >
                {chartWidget}
              </div>
            )}
          </>
        )}

        {/* REGULAR TEXT MESSAGE with Ghost Text */}
        {!isReasoningMessage && text && (
          <div style={{ whiteSpace: "pre-wrap", lineHeight: "normal" }}>
            {/* Visible Text */}
            <span>{visiblePart}</span>
            {/* Ghost Text (Takes up space but invisible) */}
            <span style={{ opacity: 0 }}>{invisiblePart}</span>
          </div>
        )}
      </div>

      {/* Spacer to balance AI avatar for centering */}
      {!isAi && <div style={{ width: 52, flexShrink: 0 }} />}
      </div>
    </div>
  );
};
