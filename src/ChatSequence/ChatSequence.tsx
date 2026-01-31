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
const getChartWidget = (msg: ChatMessage): React.ReactNode | undefined => {
  // Existing chart types
  if (msg.chartType === "enps-distribution") {
    return <EnpsDistributionChart />;
  }
  if (msg.chartType === "enps-trends-turnover") {
    return <EnpsTrendsAndTurnoverCard />;
  }
  if (msg.chartType === "enps-vs-turnover") {
    return <EnpsBucketsVsTurnoverChart />;
  }
  if (msg.chartType === "joiners-leavers" || msg.showChart) {
    return <JoinersLeaversChart />;
  }

  // Option 1: Burnout/Capacity story
  if (msg.chartType === "capacity-stress-signal") {
    return <CapacityStressSignalCard />;
  }
  if (msg.chartType === "capacity-hotspots-table") {
    return <CapacityHotspotsTableCard />;
  }
  if (msg.chartType === "burnout-fast-fixes") {
    return <BurnoutFastFixesCard />;
  }

  // Option 2: Policy impact story
  if (msg.chartType === "policy-impact-overview") {
    return <PolicyImpactOverviewCard />;
  }
  if (msg.chartType === "policy-impact-segments") {
    return <PolicyImpactSegmentsCard />;
  }

  // Option 3: Skills coverage story
  if (msg.chartType === "skills-coverage-risk") {
    return <SkillsCoverageRiskCard />;
  }
  if (msg.chartType === "skills-coverage-gap-next-30") {
    return <SkillsCoverageGapNext30Card />;
  }
  if (msg.chartType === "skills-mitigation-plan") {
    return <SkillsMitigationPlanCard />;
  }

  // Option 4: Manager load story
  if (msg.chartType === "manager-load-signal") {
    return <ManagerLoadSignalCard />;
  }
  if (msg.chartType === "manager-outliers-table") {
    return <ManagerOutliersTableCard />;
  }
  if (msg.chartType === "manager-load-interventions") {
    return <ManagerLoadInterventionsCard />;
  }

  // Option 5: Reviews to retention story
  if (msg.chartType === "reviews-to-retention-signal") {
    return <ReviewsToRetentionSignalCard />;
  }
  if (msg.chartType === "review-gap-by-dept") {
    return <ReviewGapByDeptCard />;
  }
  if (msg.chartType === "review-driver-deltas") {
    return <ReviewDriverDeltasCard />;
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

export const ChatSequence: React.FC<ChatSequenceProps> = ({
  backgroundColor,
  backgroundImage,
  logoPosition = "bottom-left",
  carouselMode = false,
  gradientFade = false,
  messages,
}) => {
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
          top: logoPosition.startsWith("top") ? 40 : undefined,
          bottom: logoPosition.startsWith("bottom") ? 40 : undefined,
          left: logoPosition.endsWith("left") ? 40 : undefined,
          right: logoPosition.endsWith("right") ? 40 : undefined,
          height: 64,
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
          top: 64,
          left: 64,
          right: 64,
          bottom: 180, // Min bottom - above the logo area
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          overflow: "hidden",
          zIndex: 1,
          // Gradient fade: transparent at top, fading in from 40% down
          ...(gradientFade && {
            maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
          }),
        }}
      >
        {/* Inner container to constrain message width */}
        <div
          style={{
            width: "100%",
            maxWidth: 800,
            display: "flex",
            flexDirection: "column",
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
                chartWidget={getChartWidget(msg)}
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
