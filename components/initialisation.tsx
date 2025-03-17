"use client";
import { createRef, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Navbar from "./ui/navbar";

// TODO: Remember to fix the splash screen bug
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
  const scrollTextRef = useRef<HTMLDivElement>(null);
  const mainTextRef = useRef<HTMLDivElement>(null);

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

    t2.fromTo(
      mainTextRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }, 
    );
    t2.fromTo(
      scrollTextRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, "<"
    );

    // Step 2: Subtle bop effect (slight vertical movement)
    t2.to(scrollTextRef.current, {
      y: -5, // Move up slightly
      repeat: -1, // Infinite loop
      yoyo: true, // Reverse on each iteration
      duration: 0.6,
      ease: "sine.inOut",
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
      <Navbar />
      {/* Main Content */}
      <motion.div
        ref={mainTextRef}
        className="absolute bg-tranparent text-white text-[6rem] z-20 pointer-events-none top-1/2 -translate-y-1/2 font-light font-serif left-1/2 -translate-x-1/2 w-full flex justify-center flex-col items-center"
      >
        The Developer who Designs{" "}
      </motion.div>
      <motion.div
        ref={scrollTextRef}
        className="text-xl absolute bottom-[7vh] left-1/2 -translate-x-1/2 font-mono"
      >
        {"< Scroll Down >"}
      </motion.div>
    </>
  );
};

export default InitialisationAnimation;
