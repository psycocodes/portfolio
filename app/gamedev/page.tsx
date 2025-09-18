// app/gamedev/page.tsx
"use client";
import dynamic from "next/dynamic";

const PhaserGame = dynamic(() => import("@/components/gamedev/phaser-game"), {
  ssr: false,
});

export default function GameDevPage() {
  return (
    <div className="w-full h-screen">
      <PhaserGame showCRTEffect={true} />
    </div>
  );
}
