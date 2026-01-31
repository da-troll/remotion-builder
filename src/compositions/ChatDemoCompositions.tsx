import { Composition } from "remotion";
import { ChatDemo, ChatDemoSchema } from "../ChatDemo";
import {
  chatDemoAskMessages,
  chatDemoChartMessages,
  chatDemoAssignMessages,
  chatDemoActionMessages,
} from "./messages";

const BRAND_NAME = "Sia";
const BACKGROUND_COLOR = "#fffcfb";

export const ChatDemoCompositions: React.FC = () => (
  <>
    {/* Chat Demo - Q&A with search response */}
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
        messages: chatDemoAskMessages,
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
        brandName: BRAND_NAME,
        backgroundColor: BACKGROUND_COLOR,
        messages: chatDemoChartMessages,
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
        brandName: BRAND_NAME,
        backgroundColor: BACKGROUND_COLOR,
        messages: chatDemoAssignMessages,
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
        brandName: BRAND_NAME,
        backgroundColor: BACKGROUND_COLOR,
        messages: chatDemoActionMessages,
      }}
    />
  </>
);
