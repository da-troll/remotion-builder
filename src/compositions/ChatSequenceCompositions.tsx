import { Composition, Folder } from "remotion";
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

// Helper to create a single composition
interface CompositionConfig {
  id: string;
  durationInFrames: number;
  messages: ChatMessage[];
  logoPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  width: number;
  height: number;
  backgroundImage: string;
}

const createComposition = ({
  id,
  durationInFrames,
  messages,
  logoPosition = "bottom-left",
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
      brandName: BRAND_NAME,
      backgroundColor: BACKGROUND_COLOR,
      backgroundImage,
      logoPosition,
      messages,
    }}
  />
);

export const ChatSequenceCompositions: React.FC = () => (
  <Folder name="ChatSequence">
    {/* Desktop versions */}
    <Folder name="Desktop">
      {createComposition({
        id: "ChatSequence-Short",
        durationInFrames: 1900,
        messages: shortMessages,
        ...DESKTOP,
        backgroundImage: DESKTOP_BG,
      })}
      {createComposition({
        id: "ChatSequence-Long",
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
      {createComposition({
        id: "ChatSequence-Chart",
        durationInFrames: 800,
        messages: chartMessages,
        logoPosition: "top-right",
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
);
