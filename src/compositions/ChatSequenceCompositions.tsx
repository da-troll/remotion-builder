import { Composition, Folder } from "remotion";
import { ChatSequence, ChatSequenceSchema } from "../ChatSequence";
import type { ChatMessage } from "../ChatSequence/schema";
import {
  shortMessages,
  longMessages,
  multiTurnMessages,
  chartMessages,
  burnoutCapacityMessages,
  policyImpactMessages,
  skillsCoverageMessages,
  managerLoadMessages,
  reviewsRetentionMessages,
} from "./messages";

const BACKGROUND_COLOR = "#fffcfb";

// Desktop and mobile background images
const DESKTOP_BG = "simployer-assets/funky-bg.png";
const MOBILE_BG = "simployer-assets/funky-bg-3-mobile-cropped.png";

// Dimensions + defaults (4K desktop, portrait mobile)
const DESKTOP = { width: 3840, height: 2160, gradientFade: true, layout: "desktop" as const };
const MOBILE = { width: 1440, height: 2560, layout: "mobile" as const };

// Helper to create a single composition
interface CompositionConfig {
  id: string;
  durationInFrames: number;
  messages: ChatMessage[];
  logoPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  carouselMode?: boolean;
  gradientFade?: boolean;
  layout?: "desktop" | "mobile";
  width: number;
  height: number;
  backgroundImage: string;
}

const createComposition = ({
  id,
  durationInFrames,
  messages,
  logoPosition = "bottom-left",
  carouselMode = false,
  gradientFade = false,
  layout = "mobile",
  width,
  height,
  backgroundImage,
}: CompositionConfig) => (
  <Composition
    key={id}
    id={id}
    component={ChatSequence}
    durationInFrames={durationInFrames}
    fps={60}
    width={width}
    height={height}
    schema={ChatSequenceSchema}
    defaultProps={{
      backgroundColor: BACKGROUND_COLOR,
      backgroundImage,
      logoPosition,
      carouselMode,
      gradientFade,
      layout,
      messages,
    }}
  />
);

export const ChatSequenceCompositions: React.FC = () => (
  <>
    <Folder name="ChatSequence">
      {/* Desktop versions */}
      <Folder name="Desktop">
        {createComposition({
          id: "ChatSequence-EnpsTurnover",
          durationInFrames: 2700,
          messages: longMessages,
          ...DESKTOP,
          backgroundImage: DESKTOP_BG,
        })}
        {createComposition({
          id: "ChatSequence-MultiTurn",
          durationInFrames: 900,
          messages: multiTurnMessages,
          logoPosition: "top-right",
          ...DESKTOP,
          backgroundImage: DESKTOP_BG,
        })}
        {/* New story compositions */}
        {createComposition({
          id: "ChatSequence-BurnoutCapacity",
          durationInFrames: 2000,
          messages: burnoutCapacityMessages,
          ...DESKTOP,
          backgroundImage: DESKTOP_BG,
        })}
        {createComposition({
          id: "ChatSequence-PolicyImpact",
          durationInFrames: 2000,
          messages: policyImpactMessages,
          ...DESKTOP,
          backgroundImage: DESKTOP_BG,
        })}
        {createComposition({
          id: "ChatSequence-SkillsCoverage",
          durationInFrames: 2000,
          messages: skillsCoverageMessages,
          ...DESKTOP,
          backgroundImage: DESKTOP_BG,
        })}
        {createComposition({
          id: "ChatSequence-ManagerLoad",
          durationInFrames: 2000,
          messages: managerLoadMessages,
          ...DESKTOP,
          backgroundImage: DESKTOP_BG,
        })}
        {createComposition({
          id: "ChatSequence-ReviewsRetention",
          durationInFrames: 2000,
          messages: reviewsRetentionMessages,
          ...DESKTOP,
          backgroundImage: DESKTOP_BG,
        })}
      </Folder>

      {/* Mobile versions */}
      <Folder name="Mobile">
        {createComposition({
          id: "ChatSequence-Short-Mobile",
          durationInFrames: 1900,
          messages: shortMessages,
          ...MOBILE,
          backgroundImage: MOBILE_BG,
        })}
        {createComposition({
          id: "ChatSequence-Long-Mobile",
          durationInFrames: 2700,
          messages: longMessages,
          ...MOBILE,
          backgroundImage: MOBILE_BG,
        })}
      </Folder>
    </Folder>

    {/* Experiments folder */}
    <Folder name="Experiments">
      {createComposition({
        id: "Experiment-Chart",
        durationInFrames: 800,
        messages: chartMessages,
        logoPosition: "top-right",
        ...DESKTOP,
        backgroundImage: DESKTOP_BG,
      })}
      {createComposition({
        id: "Experiment-Long",
        durationInFrames: 2700,
        messages: longMessages,
        carouselMode: true,
        ...DESKTOP,
        backgroundImage: DESKTOP_BG,
      })}
    </Folder>
  </>
);
