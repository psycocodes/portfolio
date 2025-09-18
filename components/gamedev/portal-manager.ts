import { Scene, GameObjects, Physics, Input } from "phaser";
import { AudioManager } from "./audio-manager";

export interface Portal {
  x: number;
  y: number;
  width: number;
  height: number;
  links: { [key: string]: string };
  sprite: GameObjects.Sprite;
  glowSprite: GameObjects.Sprite | GameObjects.Arc | GameObjects.Rectangle;
  gradientLayers?: GameObjects.Rectangle[];
  glowLayers?: GameObjects.Arc[];
  debugRect?: GameObjects.Rectangle;
  interactionText?: GameObjects.Text;
  isPlayerNear: boolean;
  teleportTarget?: number;
}

export interface PortalConfig {
  x: number;
  y: number;
  links: { [key: string]: string };
  teleportTarget?: number;
  portalWidth?: number;
  portalHeight?: number;
  glowWidth?: number;
  glowHeight?: number;
}

export class PortalManager {
  private scene: Scene;
  private portals: Portal[] = [];
  private debugMode: boolean = false;
  private audioManager?: AudioManager;

  constructor(scene: Scene, debugMode: boolean = false) {
    this.scene = scene;
    this.debugMode = debugMode;
  }

  setAudioManager(audioManager: AudioManager): void {
    this.audioManager = audioManager;
  }

  createPortal(config: PortalConfig): Portal {
    const {
      x,
      y,
      links,
      teleportTarget,
      portalWidth = 214 * 0.7,
      portalHeight = 90 * 0.7,
      glowWidth = 214 * 0.4,
      glowHeight = 120,
    } = config;

    // Use different sprites for teleport vs link portals
    const isTeleportPortal = teleportTarget !== undefined;
    const portalSprite = isTeleportPortal ? "red_portal" : "blue_portal";
    const glowColor = isTeleportPortal ? 0xff6600 : 0x00aaff;

    // Create gradient-like glow effect with multiple rectangles
    const gradientLayers = this.createGradientGlow(
      x,
      y,
      glowWidth,
      glowHeight,
      glowColor
    );

    // Create main portal sprite
    const portalSpriteObj = this.scene.add
      .sprite(x, y, portalSprite)
      .setDisplaySize(portalWidth, portalHeight)
      .setDepth(2);

    // Add subtle pulsing animation to gradient layers
    this.scene.tweens.add({
      targets: gradientLayers,
      scaleX: 1.05,
      scaleY: 1.02,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Create debug rectangle (only if debug enabled)
    let debugRect: GameObjects.Rectangle | undefined;
    if (this.debugMode) {
      debugRect = this.scene.add
        .rectangle(x, y - glowHeight / 2 + 10, glowWidth, glowHeight)
        .setStrokeStyle(2, isTeleportPortal ? 0xff0000 : 0x0000ff, 0.8)
        .setFillStyle(isTeleportPortal ? 0xff6600 : 0x0066ff, 0.1)
        .setDepth(20);
    }

    // Create portal object
    const portal: Portal = {
      x,
      y,
      width: glowWidth,
      height: glowHeight,
      links,
      sprite: portalSpriteObj,
      glowSprite: gradientLayers[0],
      gradientLayers,
      debugRect,
      isPlayerNear: false,
      teleportTarget,
    };

    this.portals.push(portal);

    return portal;
  }

  private createGradientGlow(
    x: number,
    y: number,
    glowWidth: number,
    glowHeight: number,
    glowColor: number
  ): GameObjects.Rectangle[] {
    const gradientLayers = [];

    for (let i = 0; i < 5; i++) {
      const opacity = 0.1 - i * 0.015; // Decreasing opacity from center
      const height = glowHeight * (0.6 + i * 0.1); // Increasing height
      const yOffset = -height / 2 + 10;
      const blurScale = 1 + i * 0.05; // Each layer slightly larger for blur effect

      const layer = this.scene.add
        .rectangle(x, y + yOffset, glowWidth, height, glowColor, opacity)
        .setDepth(0)
        .setScale(blurScale, 1);

      gradientLayers.push(layer);
    }

    return gradientLayers;
  }

  updatePortalInteractions(
    player: Physics.Arcade.Sprite,
    eKey: Input.Keyboard.Key
  ): void {
    const playerX = player.x;
    const playerY = player.y;
    const playerBodyX = player.body?.x || playerX;
    const playerBodyY = player.body?.y || playerY;
    const playerWidth = player.body?.width || 64;
    const playerHeight = player.body?.height || 128;

    this.portals.forEach((portal) => {
      // Calculate portal bounds
      const portalLeft = portal.x - portal.width / 2;
      const portalRight = portal.x + portal.width / 2;
      const portalTop = portal.y - portal.height / 2;
      const portalBottom = portal.y + portal.height / 2;

      // Check if player overlaps with portal
      const isInGlowRegion =
        playerBodyX + playerWidth > portalLeft &&
        playerBodyX < portalRight &&
        playerBodyY + playerHeight > portalTop &&
        playerBodyY < portalBottom;

      const playerCenterX = playerX;
      const playerCenterY = playerY;
      const isCenterInRegion =
        playerCenterX >= portalLeft &&
        playerCenterX <= portalRight &&
        playerCenterY >= portalTop &&
        playerCenterY <= portalBottom;

      const wasNear = portal.isPlayerNear;
      portal.isPlayerNear = isInGlowRegion || isCenterInRegion;

      // Handle portal state changes
      if (portal.isPlayerNear && !wasNear) {
        this.onPortalEnter(portal);
      } else if (!portal.isPlayerNear && wasNear) {
        this.onPortalExit(portal);
      }

      // Handle E key press when near portal
      if (portal.isPlayerNear && Input.Keyboard.JustDown(eKey)) {
        this.onPortalActivate(portal);
      }
    });
  }

  private onPortalEnter(portal: Portal): void {
    const isTeleportPortal = portal.teleportTarget !== undefined;

    // Change portal appearance
    if (isTeleportPortal) {
      portal.sprite.setTexture("blue_portal");
      portal.gradientLayers?.forEach((layer, layerIndex) => {
        const opacity = 0.15 + layerIndex * 0.05;
        layer.setFillStyle(0x00aaff, opacity);
      });
    } else {
      portal.sprite.setTexture("red_portal");
      portal.gradientLayers?.forEach((layer, layerIndex) => {
        const opacity = 0.15 + layerIndex * 0.05;
        layer.setFillStyle(0xff6600, opacity);
      });
    }

    // Show interaction prompt
    this.createInteractionPrompt(portal);
  }

  private onPortalExit(portal: Portal): void {
    const isTeleportPortal = portal.teleportTarget !== undefined;

    // Reset portal appearance
    if (isTeleportPortal) {
      portal.sprite.setTexture("red_portal");
      portal.gradientLayers?.forEach((layer, layerIndex) => {
        const opacity = 0.1 - layerIndex * 0.015;
        layer.setFillStyle(0xff6600, opacity);
      });
    } else {
      portal.sprite.setTexture("blue_portal");
      portal.gradientLayers?.forEach((layer, layerIndex) => {
        const opacity = 0.1 - layerIndex * 0.015;
        layer.setFillStyle(0x00aaff, opacity);
      });
    }

    // Remove interaction prompt
    if (portal.interactionText) {
      portal.interactionText.destroy();
      portal.interactionText = undefined;
    }
  }

  private createInteractionPrompt(portal: Portal): void {
    const isTeleportPortal = portal.teleportTarget !== undefined;

    let promptText: string;
    if (isTeleportPortal) {
      const teleportType = Object.values(portal.links)[0];
      promptText = teleportType.includes("Beginning")
        ? "Press E to Return to Start"
        : "Press E to Skip to Latest Game";
    } else {
      promptText = `Press E for ${Object.keys(portal.links).join(" or ")}`;
    }

    portal.interactionText = this.scene.add
      .text(portal.x, portal.y - 100, promptText, {
        fontFamily: "RetroSpaceInv",
        fontSize: "16px",
        color: isTeleportPortal ? "#ff9900" : "#ffff00",
        align: "center",
        stroke: "#000",
        strokeThickness: 2,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setDepth(10);

    // Add floating animation
    this.scene.tweens.add({
      targets: portal.interactionText,
      y: portal.y - 110,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private onPortalActivate(portal: Portal): void {
    this.audioManager?.playTeleportSound();

    if (portal.teleportTarget !== undefined) {
      this.scene.events.emit("portal-teleport", portal.teleportTarget);
    } else {
      this.openPortalLinks(portal.links);
    }
  }

  private openPortalLinks(links: { [key: string]: string }): void {
    const linkEntries = Object.entries(links);

    if (linkEntries.length === 1) {
      window.open(linkEntries[0][1], "_blank");
    } else {
      linkEntries.forEach(([linkType, url]) => {
        setTimeout(() => {
          window.open(url, "_blank");
        }, linkEntries.indexOf([linkType, url]) * 500);
      });
    }
  }

  getPortals(): Portal[] {
    return this.portals;
  }

  destroy(): void {
    this.portals.forEach((portal) => {
      portal.sprite.destroy();
      portal.gradientLayers?.forEach((layer) => layer.destroy());
      portal.debugRect?.destroy();
      portal.interactionText?.destroy();
    });
    this.portals = [];
  }
}
