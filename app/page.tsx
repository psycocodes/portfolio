"use client";
import IntroAnimation from "@/components/intro";
import InitialisationAnimation from "@/components/initialisation";
import { useState } from "react";

export default function Home() {
  const [animationCounter, setAnimationCounter] = useState(1);
  return (
    <>
      {animationCounter == 1 && (
        <IntroAnimation onComplete={() => setAnimationCounter(2)} />
      )}
      {animationCounter == 2 && <InitialisationAnimation />}
    </>
  );
}
