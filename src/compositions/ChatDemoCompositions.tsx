import { Composition, Folder } from "remotion";
import { ChatDemo, ChatDemoSchema } from "../ChatDemo";
import {
  chatDemoAskMessages,
  chatDemoChartMessages,
  chatDemoAssignMessages,
  chatDemoActionMessages,
} from "./messages";

const BRAND_NAME = "Sia";
const BACKGROUND_COLOR = "#fffcfb";
const LOGO_SRC = "simployer-assets/Simployer Symbol/Symbol - Purple.svg";

export const ChatDemoCompositions: React.FC = () => (
  <>
    {/* ChatDemo - Alternative chat format */}
    <Folder name="ChatDemo">
      {/* Q&A with search response */}
      <Composition
        id="Athena-ChatDemo-Ask"
        component={ChatDemo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={ChatDemoSchema}
        defaultProps={{
          brandName: BRAND_NAME,
          backgroundColor: BACKGROUND_COLOR,
          logoSrc: LOGO_SRC,
          messages: chatDemoAskMessages,
        }}
      />

      {/* Task Assignment */}
      <Composition
        id="Athena-ChatDemo-Assign"
        component={ChatDemo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={ChatDemoSchema}
        defaultProps={{
          brandName: BRAND_NAME,
          backgroundColor: BACKGROUND_COLOR,
          logoSrc: LOGO_SRC,
          messages: chatDemoAssignMessages,
        }}
      />

      {/* Action Card */}
      <Composition
        id="Athena-ChatDemo-Action"
        component={ChatDemo}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        schema={ChatDemoSchema}
        defaultProps={{
          brandName: BRAND_NAME,
          backgroundColor: BACKGROUND_COLOR,
          logoSrc: LOGO_SRC,
          messages: chatDemoActionMessages,
        }}
      />
    </Folder>

    {/* Miscellaneous / Test compositions */}
    <Folder name="Miscellaneous">
      {/* Chart with bar graph example */}
      <Composition
        id="ChatSequence-Chart-BarExample"
        component={ChatDemo}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        schema={ChatDemoSchema}
        defaultProps={{
          brandName: BRAND_NAME,
          backgroundColor: BACKGROUND_COLOR,
          logoSrc: LOGO_SRC,
          messages: chatDemoChartMessages,
        }}
      />
    </Folder>
  </>
);
