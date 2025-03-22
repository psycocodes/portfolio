"use client";
import { createRef, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Navbar from "./ui/navbar";
import Image from "next/image";
import { MoveUpRight } from "lucide-react";

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
  const starRef = useRef<HTMLDivElement>(null);

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
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );

    t2.fromTo(
      scrollTextRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
      "<"
    );
    t2.to(starRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "linear",
    });
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
      {/* Home Main Content */}
      <motion.div
        ref={mainTextRef}
        className="h-full relative  bg-tranparent text-white text-[6rem] z-20 pointer-events-none top-1/2 -translate-y-1/2 font-light font-serif left-1/2 -translate-x-1/2 w-full flex justify-center flex-col items-center"
      >
        <div ref={starRef} className="absolute -z-50 overflow-hidden">
          <Image
            src="/images/greystar.png"
            alt=""
            width={400}
            height={400}
            className="aspect-square p-0 m-0 rotate-10"
          />
        </div>
        The Developer who Designs{" "}
      </motion.div>
      <motion.div className="fixed bottom-[7vh] left-1/2 -translate-x-1/2 mix-blend-difference">
        <motion.div ref={scrollTextRef} className="text-xl font-mono flex">
          {"< Scroll Down"}
          <Image
            src="/images/scrolldown.png"
            alt=""
            width={30}
            height={30}
            className="aspect-square p-0 m-0 scale-[0.6]"
          ></Image>
          {">"}
        </motion.div>
      </motion.div>
      {/* About Me */}
      <motion.div className="h-full w-full bg-white text-black px-5 py-2 flex flex-col items-center">
        <div className="text-[7rem] font-sans flex items-center h-fit" id="about">
          About Me{" "}
          <div className="border rounded-full h-[7rem] w-[7rem] items-center flex justify-center ml-2">
            <MoveUpRight className="h-[80%] w-[80%]" />
          </div>
        </div>{" "}
        <div className="flex mx-40 gap-10 h-fit w-[70%] items-center">
          <div className="h-[50vh] aspect-square relative">
            <Image
              src="/images/portrait.png"
              alt=""
              className="z-10"
              fill
              style = {{objectFit: "contain"}}
            ></Image>
            <div className="absolute h-full w-full border-3 -left-5 top-5"></div>
          </div>
          <div className="text-[2rem] font-light">
            <span className="text-[3rem] font-serif"><span className="font-serif">Hi</span>, I am <span className="font-serif">Mohikshit Ghorai.</span></span> <br/>A developer from <span className="font-serif">India</span>.
            I specialise in branding, graphic design, fullstack development and machine learning.
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default InitialisationAnimation;
