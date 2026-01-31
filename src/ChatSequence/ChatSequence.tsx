import { AbsoluteFill, Img, staticFile } from "remotion";
import { MessageBubble } from "./MessageBubble";
import { JoinersLeaversChart } from "./JoinersLeaversChart";
import { EnpsDistributionChart } from "./EnpsDistributionChart";
import { EnpsBucketsVsTurnoverChart } from "./EnpsBucketsVsTurnoverChart";
import { EnpsTrendsAndTurnoverCard } from "./EnpsTrendsAndTurnoverCard";
import { theme } from "../theme";
import type { ChatSequenceProps, ChatMessage } from "./schema";

// Helper to get chart widget based on message config
const getChartWidget = (msg: ChatMessage): React.ReactNode | undefined => {
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
  return undefined;
};

export const ChatSequence: React.FC<ChatSequenceProps> = ({
  brandName,
  logoSrc,
  backgroundColor,
  backgroundImage,
  logoPosition = "bottom-left",
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
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              text={msg.text}
              isAi={msg.isAi}
              delay={msg.delay}
              userName={msg.userName}
              userAvatar={msg.userAvatar}
              brandName={brandName}
              logoSrc={logoSrc}
              reasoningSteps={msg.reasoningSteps}
              chartWidget={getChartWidget(msg)}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
