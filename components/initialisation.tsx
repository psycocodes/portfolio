"use client";
import { createRef, useEffect, useState } from "react";
import gsap from "gsap";

const InitialisationAnimation = ({
  onComplete,
}: {
  onComplete: () => void;
}) => {
  const columnCounter = 5;
  const [linesRef] = useState(() =>
    Array(columnCounter)
      .fill(0)
      .map(() => createRef<HTMLDivElement>())
  );

  useEffect(() => {
    // Filtering Null Elements
    const lineElements = linesRef
      .filter((ref, i) => ref.current && i > 0 && i < columnCounter)
      .map((ref) => ref.current);

    // Initialisation
    gsap.set(lineElements, {
      height: 0,
      top: 0,
      position: "relative",
    });

    // Animation
    const t2 = gsap.timeline({onComplete: onComplete});
    const animationDuration = 1; // Duration of each line animation
    const startOffset = 0.2 * animationDuration;

    lineElements.forEach((line, index) => {
        const position = index * startOffset;
      t2.to(
        line,
        {
          height: "100vh",
          duration: animationDuration,
          ease: "power3.inOut",
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columnCounter}, minmax(0, 1fr))`,
      }}
      className="h-screen w-screen bg-black overflow-hidden"
    >
      {[...Array(columnCounter)].map((_, i) => {
        if (i > 0 && i < columnCounter) {
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
  );
};

export default InitialisationAnimation;
