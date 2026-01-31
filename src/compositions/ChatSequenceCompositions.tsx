import { Composition } from "remotion";
import { ChatSequence, ChatSequenceSchema } from "../ChatSequence";
import type { ChatMessage } from "../ChatSequence/schema";
import {
  shortMessages,
  longMessages,
  multiTurnMessages,
  chartMessages,
} from "./messages";

const BRAND_NAME = "Sia";
const BACKGROUND_COLOR = "#fffcfb";

// Desktop and mobile background images
const DESKTOP_BG = "simployer-assets/funky-bg.png";
const MOBILE_BG = "simployer-assets/funky-bg-3-mobile-cropped.png";

// Dimensions
const DESKTOP = { width: 1920, height: 1080 };
const MOBILE = { width: 1080, height: 1226 };

// Helper to create desktop + mobile composition pairs
interface CompositionConfig {
  id: string;
  durationInFrames: number;
  messages: ChatMessage[];
  logoPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  includeMobile?: boolean;
}

const createCompositionPair = ({
  id,
  durationInFrames,
  messages,
  logoPosition = "bottom-left",
  includeMobile = false,
}: CompositionConfig) => (
  <>
    {/* Desktop version */}
    <Composition
      id={id}
      component={ChatSequence}
      durationInFrames={durationInFrames}
      fps={60}
      width={DESKTOP.width}
      height={DESKTOP.height}
      schema={ChatSequenceSchema}
      defaultProps={{
        brandName: BRAND_NAME,
        backgroundColor: BACKGROUND_COLOR,
        backgroundImage: DESKTOP_BG,
        logoPosition,
        messages,
      }}
    />

    {/* Mobile version (optional) */}
    {includeMobile && (
      <Composition
        id={`${id}-Mobile`}
        component={ChatSequence}
        durationInFrames={durationInFrames}
        fps={60}
        width={MOBILE.width}
        height={MOBILE.height}
        schema={ChatSequenceSchema}
        defaultProps={{
          brandName: BRAND_NAME,
          backgroundColor: BACKGROUND_COLOR,
          backgroundImage: MOBILE_BG,
          logoPosition,
          messages,
        }}
      />
    )}
  </>
);

export const ChatSequenceCompositions: React.FC = () => (
  <>
    {/* Short version (6 messages) - desktop + mobile */}
    {createCompositionPair({
      id: "ChatSequence-Short",
      durationInFrames: 1900,
      messages: shortMessages,
      includeMobile: true,
    })}

    {/* Long version (8 messages) - desktop + mobile */}
    {createCompositionPair({
      id: "ChatSequence-Long",
      durationInFrames: 2700,
      messages: longMessages,
      includeMobile: true,
    })}

    {/* Multi-turn conversation (text-only) */}
    {createCompositionPair({
      id: "ChatSequence-MultiTurn",
      durationInFrames: 900,
      messages: multiTurnMessages,
      logoPosition: "top-right",
    })}

    {/* Single chart response */}
    {createCompositionPair({
      id: "ChatSequence-Chart",
      durationInFrames: 800,
      messages: chartMessages,
      logoPosition: "top-right",
    })}
  </>
);
