"use client";
import { createRef, useEffect, useState } from "react";
import gsap from "gsap";
import Navbar from "./ui/navbar";

const InitialisationAnimation = ({
  onComplete,
}: {
  onComplete: () => void;
}) => {
  const lineCount = 5;
  const [linesRef] = useState(() =>
    Array(lineCount)
      .fill(0)
      .map(() => createRef<HTMLDivElement>())
  );

  useEffect(() => {
    // Filtering Null Elements
    const lineElements = linesRef
      .filter((ref, i) => ref.current && i > 0 && i < lineCount)
      .map((ref) => ref.current);

    // Initialisation
    gsap.set(lineElements, {
      height: 0,
      top: 0,
      position: "relative",
    });

    // Animation
    const t2 = gsap.timeline({ onComplete: onComplete });
    const lineAnimationDuration = 1; // Duration of each line animation

    const startOffset = 0.2 * lineAnimationDuration;

    lineElements.forEach((line, index) => {
      const position = index * startOffset;
      t2.to(
        line,
        {
          height: "100vh",
          duration: lineAnimationDuration,
        },
        position
      );
    });

    return () => {
      // Clean up Animation
      t2.kill();
    };
  }, []);

  return (
    <>
      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white dark:bg-black z-20"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 60%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 80%, black 100%)",
        }}
      ></div>
      {/* Line Animation */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${lineCount}, minmax(0, 1fr))`,
        }}
        className="h-screen w-screen bg-black overflow-hidden absolute top-0 z-0"
      >
        {[...Array(lineCount)].map((_, i) => {
          if (i > 0 && i < lineCount) {
            return (
              <div key={i} className="relative">
                <div
                  ref={linesRef[i]}
                  className="border-l border-white/20 h-full absolute left-0"
                />
              </div>
            );
          } else {
            return <div key={i} />;
          }
        })}
      </div>
      {/* NavBar */}
      <Navbar/>
    </>
  );
};

export default InitialisationAnimation;
