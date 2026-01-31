import { AbsoluteFill, Img, staticFile } from "remotion";
import { MessageBubble } from "./MessageBubble";
import { JoinersLeaversChart } from "./JoinersLeaversChart";
import { EnpsDistributionChart } from "./EnpsDistributionChart";
import { EnpsBucketsVsTurnoverChart } from "./EnpsBucketsVsTurnoverChart";
import { EnpsTrendsAndTurnoverCard } from "./EnpsTrendsAndTurnoverCard";
// Option 1: Burnout/Capacity story
import { CapacityStressSignalCard } from "./CapacityStressSignalCard";
import { CapacityHotspotsTableCard } from "./CapacityHotspotsTableCard";
import { BurnoutFastFixesCard } from "./BurnoutFastFixesCard";
// Option 2: Policy impact story
import { PolicyImpactOverviewCard } from "./PolicyImpactOverviewCard";
import { PolicyImpactSegmentsCard } from "./PolicyImpactSegmentsCard";
// Option 3: Skills coverage story
import { SkillsCoverageRiskCard } from "./SkillsCoverageRiskCard";
import { SkillsCoverageGapNext30Card } from "./SkillsCoverageGapNext30Card";
import { SkillsMitigationPlanCard } from "./SkillsMitigationPlanCard";
// Option 4: Manager load story
import { ManagerLoadSignalCard } from "./ManagerLoadSignalCard";
import { ManagerOutliersTableCard } from "./ManagerOutliersTableCard";
import { ManagerLoadInterventionsCard } from "./ManagerLoadInterventionsCard";
// Option 5: Reviews to retention story
import { ReviewsToRetentionSignalCard } from "./ReviewsToRetentionSignalCard";
import { ReviewGapByDeptCard } from "./ReviewGapByDeptCard";
import { ReviewDriverDeltasCard } from "./ReviewDriverDeltasCard";
import { theme } from "../theme";
import type { ChatSequenceProps, ChatMessage } from "./schema";

// Helper to get chart widget based on message config
const getChartWidget = (msg: ChatMessage, layout: "desktop" | "mobile"): React.ReactNode | undefined => {
  // Existing chart types
  if (msg.chartType === "enps-distribution") {
    return <EnpsDistributionChart layout={layout} />;
  }
  if (msg.chartType === "enps-trends-turnover") {
    return <EnpsTrendsAndTurnoverCard layout={layout} />;
  }
  if (msg.chartType === "enps-vs-turnover") {
    return <EnpsBucketsVsTurnoverChart layout={layout} />;
  }
  if (msg.chartType === "joiners-leavers" || msg.showChart) {
    return <JoinersLeaversChart layout={layout} />;
  }

  // Option 1: Burnout/Capacity story
  if (msg.chartType === "capacity-stress-signal") {
    return <CapacityStressSignalCard layout={layout} />;
  }
  if (msg.chartType === "capacity-hotspots-table") {
    return <CapacityHotspotsTableCard layout={layout} />;
  }
  if (msg.chartType === "burnout-fast-fixes") {
    return <BurnoutFastFixesCard layout={layout} />;
  }

  // Option 2: Policy impact story
  if (msg.chartType === "policy-impact-overview") {
    return <PolicyImpactOverviewCard layout={layout} />;
  }
  if (msg.chartType === "policy-impact-segments") {
    return <PolicyImpactSegmentsCard layout={layout} />;
  }

  // Option 3: Skills coverage story
  if (msg.chartType === "skills-coverage-risk") {
    return <SkillsCoverageRiskCard layout={layout} />;
  }
  if (msg.chartType === "skills-coverage-gap-next-30") {
    return <SkillsCoverageGapNext30Card layout={layout} />;
  }
  if (msg.chartType === "skills-mitigation-plan") {
    return <SkillsMitigationPlanCard layout={layout} />;
  }

  // Option 4: Manager load story
  if (msg.chartType === "manager-load-signal") {
    return <ManagerLoadSignalCard layout={layout} />;
  }
  if (msg.chartType === "manager-outliers-table") {
    return <ManagerOutliersTableCard layout={layout} />;
  }
  if (msg.chartType === "manager-load-interventions") {
    return <ManagerLoadInterventionsCard layout={layout} />;
  }

  // Option 5: Reviews to retention story
  if (msg.chartType === "reviews-to-retention-signal") {
    return <ReviewsToRetentionSignalCard layout={layout} />;
  }
  if (msg.chartType === "review-gap-by-dept") {
    return <ReviewGapByDeptCard layout={layout} />;
  }
  if (msg.chartType === "review-driver-deltas") {
    return <ReviewDriverDeltasCard layout={layout} />;
  }

  return undefined;
};

// Calculate carousel mode timing for a message
// - Most recent (1st): fully visible
// - 2nd last: fully visible
// - 3rd last: faded to background
// - 4th last: exits/disappears
const getCarouselTiming = (
  messages: ChatMessage[],
  index: number
): { fadeToBackgroundFrame?: number; exitFrame?: number } => {
  const currentMsg = messages[index];
  const msg2After = messages[index + 2]; // When this appears, current becomes 3rd last
  const msg3After = messages[index + 3]; // When this appears, current becomes 4th last

  // Fade to background when becoming 3rd last message
  const fadeToBackgroundFrame = msg2After
    ? msg2After.delay - currentMsg.delay - 10
    : undefined;

  // Exit when becoming 4th last message
  const exitFrame = msg3After
    ? msg3After.delay - currentMsg.delay - 10
    : undefined;

  return { fadeToBackgroundFrame, exitFrame };
};

// Layout configuration for desktop vs mobile
const layoutConfig = {
  desktop: {
    // 4K (3840×2160) - scale 2.8x for prominent chat display
    // Messages centered between logo end and right edge
    scale: 2.8,
    align: "center" as const,
    transformOrigin: "center bottom",
    containerPadding: { top: 0, left: 1150, right: 160, bottom: 400 },
    logoHeight: 160,
    logoOffset: 100,
    maxWidth: 800, // Base width before scaling (800 * 2.8 = 2240px effective)
  },
  mobile: {
    // Portrait (1440×2560) - scale 2.5x for phone-like chat appearance
    scale: 2.5,
    align: "center" as const,
    transformOrigin: "center bottom",
    containerPadding: { top: 0, left: 80, right: 80, bottom: 350 },
    logoHeight: 140,
    logoOffset: 80,
    maxWidth: 480, // Smaller base width, scales to ~1200px effective
  },
};

export const ChatSequence: React.FC<ChatSequenceProps> = ({
  backgroundColor,
  backgroundImage,
  logoPosition = "bottom-left",
  carouselMode = false,
  gradientFade = false,
  layout = "mobile",
  messages,
}) => {
  const config = layoutConfig[layout];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor || theme.colors.surface.viewport,
      }}
    >
      {backgroundImage && (
        <Img
          src={staticFile(backgroundImage)}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      )}

      {/* Simployer Logo - always visible above everything */}
      <Img
        src={staticFile(
          "simployer-assets/Simployer Logo - without Symbol/Other filetypes/Logotype - Clean - Purple.svg"
        )}
        style={{
          position: "absolute",
          top: logoPosition.startsWith("top") ? config.logoOffset : undefined,
          bottom: logoPosition.startsWith("bottom") ? config.logoOffset : undefined,
          left: logoPosition.endsWith("left") ? config.logoOffset : undefined,
          right: logoPosition.endsWith("right") ? config.logoOffset : undefined,
          height: config.logoHeight,
          zIndex: 100,
        }}
      />

      {/*
        Messages container - stays above logo area
        overflow: hidden clips any content that would extend into logo zone
      */}
      <div
        style={{
          position: "absolute",
          top: config.containerPadding.top,
          left: config.containerPadding.left,
          right: config.containerPadding.right,
          bottom: config.containerPadding.bottom,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: config.align,
          overflow: "hidden",
          zIndex: 1,
          // Gradient fade: 60% opacity at top, full visibility from 20% down
          ...(gradientFade && {
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,1) 20%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,1) 20%)",
          }),
        }}
      >
        {/* Inner container with transform scaling */}
        <div
          style={{
            width: "100%",
            maxWidth: config.maxWidth,
            display: "flex",
            flexDirection: "column",
            transform: `scale(${config.scale})`,
            transformOrigin: config.transformOrigin,
          }}
        >
          {messages.map((msg, index) => {
            const carouselTiming = carouselMode
              ? getCarouselTiming(messages, index)
              : {};

            return (
              <MessageBubble
                key={index}
                text={msg.text}
                isAi={msg.isAi}
                delay={msg.delay}
                userName={msg.userName}
                userAvatar={msg.userAvatar}
                reasoningSteps={msg.reasoningSteps}
                chartWidget={getChartWidget(msg, layout)}
                chartInsight={msg.chartInsight}
                fadeToBackgroundFrame={carouselTiming.fadeToBackgroundFrame}
                exitFrame={carouselTiming.exitFrame}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
