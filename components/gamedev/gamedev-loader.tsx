"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface GameDevLoaderProps {
  isLoaded: boolean;
  onFadeOutComplete: () => void;
}

export default function GameDevLoader({
  isLoaded,
  onFadeOutComplete,
}: GameDevLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (!isLoaded) {
      const interval = setInterval(() => {
        setDots((prev) => {
          if (prev === ".") return "..";
          if (prev === "..") return "...";
          return ".";
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && loaderRef.current && contentRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (loaderRef.current) {
            loaderRef.current.style.display = "none";
          }
          onFadeOutComplete();
        },
      });

      tl.to([contentRef.current, loaderRef.current], {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
      });

      return () => {
        tl.kill();
      };
    }
  }, [isLoaded, onFadeOutComplete]);

  return (

    <div
      ref={loaderRef}
      style={{
        ...styles.container,
        opacity: 1, 
        visibility: "visible", 
      }}
    >
      <div ref={contentRef} style={{ textAlign: "center", opacity: 1 }}>
        <div style={styles.loadingText}>Loading{dots}</div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "#000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    fontFamily: "RetroSpaceInv, monospace",
  },
  loadingText: {
    fontSize: "32px",
  },
};
