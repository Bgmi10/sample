import "./styles.css";
import { Player } from "@remotion/player";
import { FramerBlockComp } from "./composition/FramerComp";
import { TimelineComp } from "./composition/TimelineComp";

export default function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0",
        margin: "0",
        position: "absolute",
        top: "0",
        left: "0",
      }}
    >
      <Player
        component={TimelineComp} // TODO we want to fix this composition
        compositionWidth={800}
        compositionHeight={600}
        durationInFrames={660}
        fps={30}
        controls
        showPlaybackRateControl
      />
    </div>
  );
}
