"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const IntroAnimation = () => {

  // Config
  const fontSize = 5 //rem
  const content = "Hiya."
  
  const textRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t1 = gsap.timeline();

    t1.to(circleRef.current, { // Explosion Phase 1
      duration: 1.2,
      width: `${fontSize*2.4}rem`,
      height: `${fontSize*2.4}rem`,
      ease: "expo.out",
    })
      .to(circleRef.current, { // Explosion Phase 2
        duration: 0.8,
        width: "200vw",
        height: "200vw",
        borderRadius: "0%",
        opacity: 1,
        ease: "power3.inOut",
      })
      .to(textRef.current, { // Delete Text
        opacity: 0,
      });
  });

  return (
    <div className="relative flex items-center justify-center bg-white text-black h-screen w-screen">
      <motion.div
        ref={textRef}
        initial={{ opacity: 1 }}
        className={`text-[${fontSize}rem]`}
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
