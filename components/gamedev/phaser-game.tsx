"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Game, AUTO, Renderer, Scale, Types, WEBGL } from "phaser";
import GameDevLoader from "./gamedev-loader";
import { loadGameDevContent } from "@/utils/gamedevData";
import { GameScene, setGameData, GAME_CONFIG } from "./gamescene";
import { CRTPostFXPipeline } from "./crt-pipeline";

export default function PhaserGame({ showCRTEffect = true }) {
  const gameRef = useRef<Game | null>(null);

  const [showLoader, setShowLoader] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const initializeGame = useCallback(async () => {
    try {
      const { data, imageSources } = await loadGameDevContent();

      setGameData(data, imageSources);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const config: Types.Core.GameConfig = {
        type: AUTO,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: GAME_CONFIG.GRAVITY },
            debug: false,
          },
        },
        scene: GameScene,
        backgroundColor: "#000000",
        scale: {
          mode: Scale.RESIZE,
          autoCenter: Scale.CENTER_BOTH,
          width: GAME_CONFIG.WORLD_WIDTH,
          height: GAME_CONFIG.WORLD_HEIGHT,
          parent: "game-container",
          resizeInterval: 16,
        },
      };

      gameRef.current = new Game(config);

      if (showCRTEffect && gameRef.current.renderer.type === WEBGL) {
        try {
          (
            gameRef.current.renderer as Renderer.WebGL.WebGLRenderer
          ).pipelines.addPostPipeline("CRTPostFXPipeline", CRTPostFXPipeline);
        } catch (error) {
          console.warn("Failed to add CRT pipeline:", error);
        }
      }

      setIsLoaded(true);
    } catch (error) {
      console.error("Error during game initialization:", error);
    }
  }, [showCRTEffect]);

  useEffect(() => {
    if (gameRef.current) return;
    initializeGame();
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [initializeGame]);

  return (
    <>
      {showLoader && (
        <GameDevLoader
          isLoaded={isLoaded}
          onFadeOutComplete={() => {
            setShowLoader(false);
          }}
        />
      )}

      <div
        id="game-container"
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1,
          backgroundColor: "#111",
        }}
      />
    </>
  );
}
