import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useCurrentFrame, useVideoConfig } from "remotion";
import mouseData from "../assets/mouse.json";
import arrowImage from "../assets/arrow.png";
import { useEffect, useRef, useState } from "react";

interface MouseData {
  frame: number;
  x: number;
  y: number;
}

interface BakedMousePosition {
  frame: number;
  x: number;
  y: number;
}

export const FramerBlockComp = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const progress = useMotionValue(0);

  const x = useTransform(
    progress,
    mouseData.map((d) => d.frame / durationInFrames),
    mouseData.map((d) => d.x * 8)
  );
  const y = useTransform(
    progress,
    mouseData.map((d) => d.frame / durationInFrames),
    mouseData.map((d) => d.y * 6)
  );

  const springConfig = { stiffness: 100, damping: 30, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Ref to store baked positions
  const bakedPositionsRef = useRef<BakedMousePosition[]>([]);

  useEffect(() => {
    progress.set(frame / durationInFrames);
  }, [frame, durationInFrames, progress]);

  useEffect(() => {
    const capturePositions = () => {
      const newPosition: BakedMousePosition = {
        frame,
        x: springX.get(),
        y: springY.get(),
      };
      bakedPositionsRef.current.push(newPosition);

      if (frame === durationInFrames - 1) {
        // Animation complete, log the baked positions
        console.log("Baked Positions:", bakedPositionsRef.current);
        // You can also save this to a file or send it to a server here
      }
    };

    capturePositions();
  }, [frame, springX, springY, durationInFrames]);

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
      <motion.img
        src={arrowImage}
        alt="Arrow"
        style={{
          width: "46px",
          height: "60px",
          position: "absolute",
          x: springX,
          y: springY,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};
