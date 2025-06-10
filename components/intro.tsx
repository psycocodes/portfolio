"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  // Config
  const fontSize = 5; //rem
  const content = "Hiya.";

  const textRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!textRef.current || !circleRef.current) return; // Check for elements

    const t1 = gsap.timeline({ onComplete: onComplete });

    t1.to({}, { duration: 0.8 }) // Pause Animation
      .to(circleRef.current, {
        // Explosion Phase 1
        duration: 1.2,
        width: `${fontSize * 2.4}rem`,
        height: `${fontSize * 2.4}rem`,
        ease: "expo.out",
      })
      .to(circleRef.current, {
        // Explosion Phase 2
        duration: 0.8,
        width: "200vw",
        height: "200vw",
        borderRadius: "0%",
        opacity: 1,
        ease: "power3.inOut",
      })
      .to(textRef.current, {
        // Delete Text
        opacity: 0,
      });
    return () => {
      t1.kill(); // Clean up Animation
    };
  }, [onComplete]);

  return (
    <div className="relative flex items-center justify-center bg-white text-black h-screen w-screen overflow-hidden">
      <motion.div
        ref={textRef}
        style={{ fontSize: `${fontSize}rem` }}
        initial={{ opacity: 1 }}
      >
        {content}
      </motion.div>
      <motion.div
        ref={circleRef}
        initial={{ opacity: 1 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black rounded-full"
      />
    </div>
  );
};

export default IntroAnimation;
