"use client";
import { useEffect, useRef, useState } from "react";
import {
  Scene,
  Game,
  Physics,
  Input,
  Types,
  GameObjects,
  Renderer,
  Animations,
  Scale,
  Math as PhaserMath,
  AUTO,
} from "phaser";
import WebFont from "webfontloader";
import { loadGameDevContent, GameDevData } from "@/utils/gamedevData";
import { CRTPostFXPipeline } from "./crt-pipeline";
import { PortalManager } from "./portal-manager";
import { AnimationManager } from "./animation-manager";
import { BackgroundManager } from "./background-manager";
import { LevelBuilder } from "./level-builder";
import { AudioManager } from "./audio-manager";

type LevelDataItem = GameDevData;

export let levelData: LevelDataItem[] = [];
export let loadedImageSources: Map<string, string> = new Map();

const SCREEN_SPACING = 600;

function getGameConfig() {
  const NUM_SCREENS = levelData.length + 4;
  return {
    TILE_SIZE: 64,
    GROUND_HEIGHT: 500,
    PARALLAX_SPEED: 0.2,
    PARALLAX_FACTOR: 0.8,
    PLAYER_SPEED: 200,
    JUMP_VELOCITY: -500,
    GRAVITY: 800,
    WALK_SPEED: 200,
    RUN_SPEED: 350,
    JUMP_FORCE: 400,
    MAX_SPEED: 500,
    MAX_FALL_SPEED: 800,
    SCREEN_SPACING: SCREEN_SPACING,
    NUM_SCREENS,
    WORLD_WIDTH: 1500 + NUM_SCREENS * SCREEN_SPACING,
    WORLD_HEIGHT: 600,
    DEBUG: false,
    CRT_EFFECT: true,
  };
}

export const GAME_CONFIG = getGameConfig();

export function setGameData(
  data: LevelDataItem[],
  imageSources: Map<string, string>
) {
  levelData = data;
  loadedImageSources = imageSources;

  const updatedConfig = getGameConfig();
  Object.assign(GAME_CONFIG, updatedConfig);
}

export class GameScene extends Scene {
  private player!: Physics.Arcade.Sprite;
  private shop!: GameObjects.Sprite;
  private platforms!: Physics.Arcade.StaticGroup;
  private cursors!: Types.Input.Keyboard.CursorKeys;
  private wasd!: { [key: string]: Input.Keyboard.Key };
  private playerGrounded: boolean = false;
  private lastIdleCheckTime: number = 0;
  private lastVariationTime: number = 0;
  private readonly IDLE_VARIATION_DELAY: number = 5000;
  private isPlayingVariation: boolean = false;
  private jumpEnabled: boolean = true;
  private eKey!: Input.Keyboard.Key;
  private playerDebugRect?: GameObjects.Rectangle;

  private portalManager!: PortalManager;
  private animationManager!: AnimationManager;
  private backgroundManager!: BackgroundManager;
  private levelBuilder!: LevelBuilder;
  private audioManager!: AudioManager;

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.audioManager = new AudioManager(this);
    this.audioManager.preloadAudio();

    this.load.image("billboard", "images/game/sprites/decorations/128x64.png");
    this.load.image("bg_far", "images/game/sprites/background/bg_far.png");
    this.load.image("bg_mid", "images/game/sprites/background/bg_mid.png");
    this.load.image("bg_near", "images/game/sprites/background/bg_near.png");

    this.load.image("dirt_fill", "images/game/sprites/ground/tile022.png");
    this.load.image("grass_top", "images/game/sprites/ground/tile001.png");

    this.load.image(
      "blue_portal",
      "images/game/sprites/portals/blue_portal.png"
    );
    this.load.image("red_portal", "images/game/sprites/portals/red_portal.png");

    this.load.image(
      "linkedin_icon",
      "images/game/sprites/sociallinks/linkedin.png"
    );
    this.load.image(
      "github_icon",
      "images/game/sprites/sociallinks/github.png"
    );
    this.load.image("itch_icon", "images/game/sprites/sociallinks/itch.png");
    this.load.image(
      "twitter_icon",
      "images/game/sprites/sociallinks/twitter.png"
    );

    levelData.forEach((item: LevelDataItem, index: number) => {
      if (item.data?.imageData && item.title) {
        const imageKey = `project_${index}`;
        const loadedImageSrc = loadedImageSources.get(item.title);

        if (loadedImageSrc) {
          this.load.image(imageKey, loadedImageSrc);
        } else {
          const fallbackPath = item.data.imageData.fallbackPath;
          this.load.image(imageKey, `/${fallbackPath}`);
        }
      }
    });
    this.load.spritesheet("idle01", "images/game/sprites/player/Idle.png", {
      frameWidth: 128,
      frameHeight: 128,
      endFrame: 6,
    });

    this.load.spritesheet("idle02", "images/game/sprites/player/Idle_2.png", {
      frameWidth: 128,
      frameHeight: 128,
      endFrame: 11,
    });

    this.load.spritesheet("jump", "images/game/sprites/player/Jump.png", {
      frameWidth: 128,
      frameHeight: 128,
      endFrame: 16,
    });

    this.load.spritesheet("walk", "images/game/sprites/player/Walk.png", {
      frameWidth: 128,
      frameHeight: 128,
      endFrame: 8,
    });

    this.load.spritesheet("run", "images/game/sprites/player/Run.png", {
      frameWidth: 128,
      frameHeight: 128,
      endFrame: 8,
    });

    this.load.spritesheet(
      "shop",
      "images/game/sprites/decorations/shop_anim.png",
      {
        frameWidth: 118,
        frameHeight: 128,
        endFrame: 6,
      }
    );
  }

  create() {
    this.portalManager = new PortalManager(this, GAME_CONFIG.DEBUG);
    this.animationManager = new AnimationManager(this);
    this.backgroundManager = new BackgroundManager(this);
    this.levelBuilder = new LevelBuilder(this, this.portalManager);

    this.audioManager.initializeAudio();
    this.audioManager.enableAudioOnUserInteraction();

    this.portalManager.setAudioManager(this.audioManager);

    this.physics.world.setBounds(
      0,
      0,
      GAME_CONFIG.WORLD_WIDTH,
      GAME_CONFIG.WORLD_HEIGHT
    );
    this.platforms = this.physics.add.staticGroup();

    this.backgroundManager.createParallaxBackground();
    this.backgroundManager.setupResizeHandlers();

    this.createGround();
    const startingMenuX = 900;
    this.createLevel(2500, startingMenuX + 500);

    this.animationManager.createAllAnimations();

    this.createPlayer();
    this.createShop();
    this.createStartMenu(startingMenuX, 300);

    this.setupCamera();

    this.setupControls();

    this.setupPhysics();

    this.events.on("portal-teleport", this.teleportPlayer, this);
  }

  private createColoredRectangle(
    key: string,
    width: number,
    height: number,
    color: number
  ) {
    this.add
      .graphics()
      .fillStyle(color)
      .fillRect(0, 0, width, height)
      .generateTexture(key, width, height)
      .destroy();
  }

  private createGround() {
    this.platforms.clear(true, true);

    const groundLevelY = GAME_CONFIG.GROUND_HEIGHT;
    const worldWidth = GAME_CONFIG.WORLD_WIDTH;
    const worldHeight =
      typeof this.scale.height === "number"
        ? this.scale.height
        : GAME_CONFIG.WORLD_HEIGHT;

    for (let x = 0; x < worldWidth; x += GAME_CONFIG.TILE_SIZE) {
      this.platforms
        .create(x + GAME_CONFIG.TILE_SIZE / 2, groundLevelY, "grass_top")
        .setOrigin(0.5)
        .setDisplaySize(GAME_CONFIG.TILE_SIZE, GAME_CONFIG.TILE_SIZE);

      const dirtTilesNeeded =
        Math.ceil((worldHeight - groundLevelY) / GAME_CONFIG.TILE_SIZE) + 1;

      for (let y = 0; y < dirtTilesNeeded; y++) {
        this.platforms
          .create(
            x + GAME_CONFIG.TILE_SIZE / 2,
            groundLevelY + (y + 1) * GAME_CONFIG.TILE_SIZE,
            "dirt_fill"
          )
          .setOrigin(0.5)
          .setDisplaySize(GAME_CONFIG.TILE_SIZE, GAME_CONFIG.TILE_SIZE);
      }
    }
  }

  private createLevel(_startingScreenX: number, _startingPortalX: number) {
    const startingScreenX = _startingScreenX ?? 2500;
    const startingScreenY = GAME_CONFIG.GROUND_HEIGHT - 80;
    const screenSpacing = GAME_CONFIG.SCREEN_SPACING;

    const teleportPortalX = _startingPortalX;
    const teleportPortalY = GAME_CONFIG.GROUND_HEIGHT - 32;

    const lastProjectIndex = levelData.findIndex(
      (item) => item.type === "project" && item.title === "deadzone"
    );
    const lastProjectX =
      lastProjectIndex !== -1
        ? startingScreenX + lastProjectIndex * screenSpacing
        : startingScreenX + (levelData.length - 1) * screenSpacing;

    const endPortalX = startingScreenX + levelData.length * screenSpacing;
    const endPortalY = GAME_CONFIG.GROUND_HEIGHT - 32;
    const beginningX = 500;

    this.levelBuilder.createTeleportPortals(
      teleportPortalX,
      teleportPortalY,
      endPortalX,
      endPortalY,
      lastProjectX,
      beginningX
    );

    const socialStartX = endPortalX + 300;
    const socialY = GAME_CONFIG.GROUND_HEIGHT - 32;
    const socialSpacing = 200;

    this.levelBuilder.createSocialMediaSection(
      socialStartX,
      socialY,
      socialSpacing
    );

    levelData.forEach((item, i) => {
      if (item.type === "storytext") {
        const screenX = startingScreenX + i * screenSpacing;
        const screenY = startingScreenY;
        const screenWidth = (item.width ?? 3) * 128;
        const screenHeight = (item.height ?? 2) * 128;

        this.levelBuilder.createTypewriterText(
          screenX,
          screenY,
          screenWidth,
          screenHeight,
          item.text ?? ""
        );
      } else if (item.type === "levelgap") {
      } else if (item.type === "project") {
        const screenX = startingScreenX + i * screenSpacing;
        const screenY = startingScreenY;
        const screenWidth = (item.width ?? 3) * 128;
        const screenHeight = (item.height ?? 2) * 128;
        const imageKey = `project_${i}`;

        this.levelBuilder.createProjectBillboard(
          screenX,
          screenY,
          screenWidth,
          screenHeight,
          imageKey
        );

        if (item.data?.links) {
          this.levelBuilder.createProjectPortals(
            screenX,
            screenWidth,
            GAME_CONFIG.GROUND_HEIGHT,
            item.data.links
          );
        }
      }
    });
  }

  private createPlayer() {
    this.player = this.physics.add
      .sprite(100, 0, "idle01")
      .setScale(1.5)
      .setDepth(2);

    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.setMaxVelocity(GAME_CONFIG.MAX_SPEED, 1000);

    this.player.body?.setSize(64, 128, true);

    const playerHeight = this.player.body?.height ?? 28;
    const spawnX = 500;
    const spawnY = GAME_CONFIG.GROUND_HEIGHT - playerHeight;

    this.player.setPosition(spawnX, spawnY);
    this.player.play("idle01");

    if (GAME_CONFIG.DEBUG) {
      this.playerDebugRect = this.add
        .rectangle(0, 0, 64, 128)
        .setStrokeStyle(2, 0x00ff00, 0.8)
        .setFillStyle(0x00ff00, 0.1)
        .setDepth(21);
    }
  }

  private createShop() {
    const scale = 3.5;
    const shopX = 300;
    const shopY = GAME_CONFIG.GROUND_HEIGHT - 32 - 64 * scale;
    this.shop = this.add.sprite(shopX, shopY, "shop", 0);
    this.shop.setScale(scale);
    this.shop.play("shop_idle");
  }

  private createStartMenu(startX: number, startY: number) {
    WebFont.load({
      custom: {
        families: ["RetroSpaceInv"],
      },
      active: () => {
        this.add
          .text(startX, startY - 40, "This is you,", {
            fontFamily: "RetroSpaceInv",
            fontSize: "30px",
            color: "#ffffff",
            align: "center",
            stroke: "#000",
            strokeThickness: 4,
          })
          .setOrigin(0.5);

        this.add
          .text(startX, startY, "an Average CS Major", {
            fontFamily: "RetroSpaceInv",
            fontSize: "48px",
            color: "#ffffff",
            align: "center",
            stroke: "#000",
            strokeThickness: 4,
          })
          .setOrigin(0.5);

        this.add
          .text(startX, startY + 40, "Press D to move forward", {
            fontFamily: "RetroSpaceInv",
            fontSize: "24px",
            color: "#ddd",
            align: "center",
            stroke: "#000",
            strokeThickness: 3,
          })
          .setOrigin(0.5);

        this.add
          .text(startX + 950, startY - 10, "Checkout my latest game or", {
            fontFamily: "RetroSpaceInv",
            fontSize: "28px",
            color: "#fafafaff",
            align: "center",
            stroke: "#000",
            strokeThickness: 3,
          })
          .setOrigin(0.5);
        this.add
          .text(startX + 950, startY + 20, "move forward to see my journey", {
            fontFamily: "RetroSpaceInv",
            fontSize: "28px",
            color: "#fafafaff",
            align: "center",
            stroke: "#000",
            strokeThickness: 3,
          })
          .setOrigin(0.5);
      },
    });
  }

  private setupCamera() {
    this.physics.world.setBounds(
      0,
      0,
      GAME_CONFIG.WORLD_WIDTH,
      GAME_CONFIG.WORLD_HEIGHT
    );

    this.cameras.main.setBounds(
      0,
      0,
      GAME_CONFIG.WORLD_WIDTH,
      GAME_CONFIG.WORLD_HEIGHT,
      true
    );

    this.cameras.main.startFollow(this.player, false, 0.1, 0.1, 0, 100);

    this.cameras.main.setFollowOffset(-100, 100);
    this.cameras.main.setDeadzone(50, 30);
    this.cameras.main.setLerp(0.2, 0.2);

    this.cameras.main.setZoom(1.05);

    this.cameras.main.setRoundPixels(true);

    if (
      GAME_CONFIG.CRT_EFFECT &&
      this.game.renderer instanceof Renderer.WebGL.WebGLRenderer
    ) {
      this.game.renderer.pipelines.addPostPipeline(
        "CRTPostFXPipeline",
        CRTPostFXPipeline
      );

      this.cameras.main.setPostPipeline("CRTPostFXPipeline");
    }
  }

  private setupControls() {
    this.cursors = this.input.keyboard!.createCursorKeys();

    this.wasd = this.input.keyboard!.addKeys("W,S,A,D") as {
      [key: string]: Input.Keyboard.Key;
    };

    this.eKey = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.E);
  }

  private setupPhysics() {
    this.physics.world.gravity.y = GAME_CONFIG.GRAVITY;

    this.platforms.getChildren().forEach((platform) => {
      const body = platform.body as Physics.Arcade.StaticBody;
      body.updateFromGameObject(); // Sync physics body with sprite
    });

    this.physics.add.collider(
      this.player,
      this.platforms,
      () => {
        if (this.player.body!.velocity.y >= 0) {
          this.playerGrounded = true;
        }
      },
      undefined,
      this
    );

    if (GAME_CONFIG.DEBUG) {
      this.physics.world.createDebugGraphic();
      this.physics.world.drawDebug = true;
      this.physics.world.debugGraphic.clear();
      this.physics.world.debugGraphic.setDepth(1000);
    }
  }

  private handleIdleState() {
    if (this.isPlayingVariation) {
      return;
    }
    const currentTime = this.time.now;
    if (currentTime - this.lastIdleCheckTime < 500) return;
    this.lastIdleCheckTime = currentTime;
    if (this.player.anims.currentAnim?.key !== "idle01") {
      return;
    }
    const idleDuration = currentTime - this.lastVariationTime;
    if (idleDuration > this.IDLE_VARIATION_DELAY) {
      if (PhaserMath.Between(0, 1) === 0) {
        this.isPlayingVariation = true;
        this.player.off("animationcomplete");
        this.player.play("idle02", true);
        this.player.once("animationcomplete", (anim: Animations.Animation) => {
          if (anim.key === "idle02") {
            this.isPlayingVariation = false;
            this.lastVariationTime = this.time.now;
          }
        });
      } else {
        this.lastVariationTime = currentTime - this.IDLE_VARIATION_DELAY / 2;
      }
    }
  }

  private handleAnimations(controls: {
    left: boolean;
    right: boolean;
    jump: boolean;
  }) {
    if (!this.playerGrounded) {
      if (this.player.anims.currentAnim?.key !== "jump") {
        this.player.play("jump", true);
      }
      return;
    }

    if (controls.left || controls.right) {
      const isRunning = this.cursors.shift?.isDown;
      const newAnim = isRunning ? "run" : "walk";
      if (this.player.anims.currentAnim?.key !== newAnim) {
        this.player.play(newAnim, true);
      }
      this.lastVariationTime = this.time.now;
      this.isPlayingVariation = false;
      return;
    }

    if (!this.isPlayingVariation) {
      if (this.player.anims.currentAnim?.key !== "idle01") {
        this.player.play("idle01", true);
      }
      this.handleIdleState();
    }
  }

  private handleMovement(controls: {
    left: boolean;
    right: boolean;
    jump: boolean;
  }) {
    const isMoving = (controls.left || controls.right) && this.playerGrounded;

    if (isMoving) {
      this.audioManager.startWalkingSound();
    } else {
      this.audioManager.stopWalkingSound();
    }

    if (controls.left) {
      const speed = this.cursors.shift?.isDown
        ? GAME_CONFIG.RUN_SPEED
        : GAME_CONFIG.WALK_SPEED;
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (controls.right) {
      const speed = this.cursors.shift?.isDown
        ? GAME_CONFIG.RUN_SPEED
        : GAME_CONFIG.WALK_SPEED;
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.jumpEnabled && controls.jump && this.playerGrounded) {
      this.player.setVelocityY(-GAME_CONFIG.JUMP_FORCE);
      this.playerGrounded = false;
      this.player.play("jump", true);
      this.audioManager.stopWalkingSound();
    }
  }

  update() {
    const scrollX = this.cameras.main.scrollX;
    this.backgroundManager.updateParallax(scrollX);

    this.playerGrounded = this.player.body!.touching.down;

    if (GAME_CONFIG.DEBUG && this.playerDebugRect && this.player.body) {
      this.playerDebugRect.setPosition(
        this.player.body.x + this.player.body.width / 2,
        this.player.body.y + this.player.body.height / 2
      );
    }

    this.levelBuilder.updateTypewriterTriggers(this.player.x);

    this.portalManager.updatePortalInteractions(this.player, this.eKey);

    const controls = {
      left: this.cursors.left.isDown || this.wasd.A.isDown,
      right: this.cursors.right.isDown || this.wasd.D.isDown,
      jump:
        this.cursors.up.isDown ||
        this.wasd.W.isDown ||
        this.cursors.space.isDown,
    };

    this.handleMovement(controls);

    this.handleAnimations(controls);
  }

  private teleportPlayer(targetX: number) {
    const playerHeight = this.player.body?.height ?? 128;
    const safeY = GAME_CONFIG.GROUND_HEIGHT - playerHeight;

    this.player.setPosition(targetX, safeY);
    this.player.setVelocity(0, 0);

    this.cameras.main.pan(targetX, safeY, 1000, "Power2");
  }
}

export default function PhaserGame() {
  const gameRef = useRef<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState("Initializing...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gameRef.current) return; // Prevent multiple instances

    const initializeGame = async () => {
      try {
        setLoadingStatus("Fetching game data...");
        setLoadingProgress(20);

        const { data, imageSources } = await loadGameDevContent();

        setLoadingStatus("Processing game content...");
        setLoadingProgress(60);

        levelData = data;
        loadedImageSources = imageSources;

        const updatedConfig = getGameConfig();
        Object.assign(GAME_CONFIG, updatedConfig);

        setLoadingStatus("Initializing game engine...");
        setLoadingProgress(80);

        await new Promise((resolve) => setTimeout(resolve, 500));

        setLoadingStatus("Starting game...");
        setLoadingProgress(100);

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

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load game data"
        );
        setIsLoading(false);
      }
    };

    initializeGame();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          color: "#fff",
          fontFamily: "monospace",
          fontSize: "18px",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div>
          <h2 style={{ color: "#ff6b6b", marginBottom: "20px" }}>
            ⚠️ Error Loading Game
          </h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#444",
              color: "#fff",
              border: "1px solid #666",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            fontFamily: "monospace",
          }}
        >
          <div
            style={{ textAlign: "center", maxWidth: "400px", padding: "20px" }}
          >
            <h2
              style={{
                marginBottom: "30px",
                fontSize: "24px",
                color: "#00ff00",
                textShadow: "0 0 10px #00ff00",
              }}
            >
              🎮 Loading GameDev Portfolio
            </h2>

            <div
              style={{
                width: "100%",
                height: "20px",
                backgroundColor: "#333",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "20px",
                border: "1px solid #555",
              }}
            >
              <div
                style={{
                  width: `${loadingProgress}%`,
                  height: "100%",
                  backgroundColor: "#00ff00",
                  transition: "width 0.3s ease",
                  boxShadow: "0 0 10px #00ff00",
                }}
              />
            </div>

            <p
              style={{
                fontSize: "16px",
                color: "#ccc",
                marginBottom: "10px",
              }}
            >
              {loadingStatus}
            </p>

            <p
              style={{
                fontSize: "14px",
                color: "#888",
              }}
            >
              {loadingProgress}% Complete
            </p>
          </div>
        </div>
      )}

      <div
        id="game-container"
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          margin: 0,
          padding: 0,
          position: "fixed",
          top: 0,
          left: 0,
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      />
    </>
  );
}
