import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import mouseData from "../assets/mouse.json";
import arrowImage from "../assets/arrow.png";
import { useMemo } from "react";

// Define MouseData interface
interface MouseData {
  frame: number;
  x: number;
  y: number;
}

// Preprocess mouse data to ensure it's sorted and unique
const preprocessData = (data: MouseData[]) => {
  const sorted = [...data].sort((a, b) => a.frame - b.frame);
  const uniqueFrames = new Set<number>();
  return sorted.filter((item) => {
    if (uniqueFrames.has(item.frame)) {
      return false;
    }
    uniqueFrames.add(item.frame);
    return true;
  });
};

export const TimelineComp = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Prepare and preprocess the data for interpolation
  const { frames, xValues, yValues } = useMemo(() => {
    const processedData = preprocessData(mouseData);
    return {
      frames: processedData.map((d) => d.frame),
      xValues: processedData.map((d) => d.x * (width / 100)), // Convert percentage to pixels
      yValues: processedData.map((d) => d.y * (height / 100)), // Convert percentage to pixels
    };
  }, [width, height]);

  // Interpolate x and y positions
  const x = interpolate(frame, frames, xValues, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, frames, yValues, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fine-tuned spring configuration for smoother motion
  const springConfig = {
    damping: 30, // Lower damping for less overshoot
    mass: 1, // Adjust mass for a smoother feel
    stiffness: 80, // Adjust stiffness for balanced responsiveness
  };

  // Spring for x and y coordinates
  const springX = spring({
    frame,
    fps,
    config: springConfig,
    from: x, // Use interpolated x value
    to: x, // Ensure transition is to the same interpolated x value
  });

  const springY = spring({
    frame,
    fps,
    config: springConfig,
    from: y, // Use interpolated y value
    to: y, // Ensure transition is to the same interpolated y value
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "grey",
        border: "2px solid white",
        borderRadius: "10px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={arrowImage}
        alt="Arrow"
        style={{
          width: "46px",
          height: "60px",
          position: "absolute",
          left: springX,
          top: springY,
          transform: "translate(-50%, -50%)",
          transition: "left 0.1s ease-out, top 0.1s ease-out", // Smooth transitions
        }}
      />
    </div>
  );
};
