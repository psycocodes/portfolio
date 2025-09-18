import { Scene, GameObjects } from "phaser";
import { Portal, PortalManager } from "./portal-manager";

export interface TypewriterTrigger {
  x: number;
  width: number;
  textObj: GameObjects.Text;
  fullText: string;
  triggered: boolean;
}

export class LevelBuilder {
  private scene: Scene;
  private portalManager: PortalManager;
  private typewriterTriggers: TypewriterTrigger[] = [];
  private typewriterUpdateHooked: boolean = false;

  constructor(scene: Scene, portalManager: PortalManager) {
    this.scene = scene;
    this.portalManager = portalManager;
  }

  createTypewriterText(
    screenX: number,
    screenY: number,
    screenWidth: number,
    screenHeight: number,
    text: string,
    options?: {
      fontSize?: string;
      color?: string;
      fontFamily?: string;
      stroke?: string;
      strokeThickness?: number;
    }
  ): void {
    const {
      fontSize = "40px",
      color = "#fff",
      fontFamily = "ByteBounce, RetroSpaceInv",
      stroke = "#000",
      strokeThickness = 3,
    } = options || {};

    const textObj = this.scene.add
      .text(screenX + screenWidth / 2, screenY - screenHeight / 2, "", {
        fontFamily,
        fontSize,
        color,
        align: "center",
        wordWrap: { width: screenWidth * 0.9 },
        stroke,
        strokeThickness,
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setAlpha(0); // Hide initially

    // Store info for typewriter trigger
    this.typewriterTriggers.push({
      x: screenX,
      width: screenWidth,
      textObj,
      fullText: text ?? "",
      triggered: false,
    });

    // Hook into update only once
    if (!this.typewriterUpdateHooked) {
      this.typewriterUpdateHooked = true;
      this.setupTypewriterUpdate();
    }
  }

  private setupTypewriterUpdate(): void {
    // We need to handle this in the main scene's update method
    // This will be called from the scene's update method
  }

  updateTypewriterTriggers(playerX: number): void {
    this.typewriterTriggers.forEach((trigger) => {
      if (
        !trigger.triggered &&
        playerX > trigger.x &&
        playerX < trigger.x + trigger.width
      ) {
        trigger.triggered = true;
        trigger.textObj.setAlpha(1);
        let charIndex = 0;
        const typeSpeed = 18;

        this.scene.time.addEvent({
          delay: typeSpeed,
          repeat: trigger.fullText.length - 1,
          callback: () => {
            charIndex++;
            trigger.textObj.setText(trigger.fullText.slice(0, charIndex));
          },
        });
      }
    });
  }

  createProjectBillboard(
    screenX: number,
    screenY: number,
    screenWidth: number,
    screenHeight: number,
    imageKey: string
  ): void {
    // Create billboard background
    this.scene.add
      .image(screenX + screenWidth / 2, screenY - screenHeight / 2, "billboard")
      .setDisplaySize(screenWidth, screenHeight)
      .setDepth(0);

    // Try to use the project-specific image, fall back if needed
    let textureKey = imageKey;
    if (!this.scene.textures.exists(imageKey)) {
      const fallbackKey = `${imageKey}_fallback`;
      textureKey = this.scene.textures.exists(fallbackKey)
        ? fallbackKey
        : "billboard";
    }

    // Create project image
    this.scene.add
      .sprite(screenX + screenWidth / 2, screenY - screenHeight / 2, textureKey)
      .setDisplaySize(screenWidth * 0.95, screenHeight * 0.95)
      .setDepth(0);
  }

  createProjectPortals(
    screenX: number,
    screenWidth: number,
    groundHeight: number,
    links: { [key: string]: string }
  ): Portal[] {
    const portals: Portal[] = [];
    const portalY = groundHeight - 32; // Exactly at ground level
    const portalSpacing = 200;
    const linkEntries = Object.entries(links);
    const totalPortalWidth = (linkEntries.length - 1) * portalSpacing;
    const startX = screenX + screenWidth / 2 - totalPortalWidth / 2;

    linkEntries.forEach(([linkType, url], portalIndex) => {
      const portalX = startX + portalIndex * portalSpacing;
      const portal = this.portalManager.createPortal({
        x: portalX,
        y: portalY,
        links: { [linkType]: url },
      });

      // Add link type label above portal
      this.scene.add
        .text(portalX, portalY - 80, linkType.toUpperCase(), {
          fontFamily: "RetroSpaceInv",
          fontSize: "18px",
          color: "#00ffff",
          align: "center",
          stroke: "#000",
          strokeThickness: 2,
        })
        .setOrigin(0.5)
        .setDepth(3);

      portals.push(portal);
    });

    return portals;
  }

  createSocialMediaSection(
    socialStartX: number,
    socialY: number,
    socialSpacing: number
  ): Portal[] {
    const portals: Portal[] = [];

    // Add header texts
    this.scene.add
      .text(
        socialStartX + socialSpacing * 1.5,
        socialY - 250,
        "Connect with me,",
        {
          fontFamily: "ByteBounce, RetroSpaceInv",
          fontSize: "64px",
          color: "#90e5ffff",
          align: "center",
          stroke: "#000",
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5)
      .setDepth(3);

    this.scene.add
      .text(
        socialStartX + socialSpacing * 1.5,
        socialY - 200,
        "Open to Feedback :D",
        {
          fontFamily: "ByteBounce, RetroSpaceInv",
          fontSize: "48px",
          color: "#90e5ffff",
          align: "center",
          stroke: "#000",
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5)
      .setDepth(3);

    // Social media data
    const socialLinks = [
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/mohikshitghorai/",
        x: socialStartX,
        icon: "linkedin_icon",
      },
      {
        name: "GitHub",
        url: "https://github.com/psycocodes",
        x: socialStartX + socialSpacing,
        icon: "github_icon",
      },
      {
        name: "Itch.io",
        url: "https://psycocodes.itch.io/",
        x: socialStartX + socialSpacing * 2,
        icon: "itch_icon",
      },
      {
        name: "Twitter",
        url: "https://twitter.com/mohikshitghorai",
        x: socialStartX + socialSpacing * 3,
        icon: "twitter_icon",
      },
    ];

    // Create social media portals and icons
    socialLinks.forEach((social, index) => {
      // Create portal
      const portal = this.portalManager.createPortal({
        x: social.x,
        y: socialY,
        links: { [social.name.toLowerCase()]: social.url },
      });
      portals.push(portal);

      // Add social platform label
      this.scene.add
        .text(social.x, socialY - 50, social.name.toUpperCase(), {
          fontFamily: "ByteBounce, RetroSpaceInv",
          fontSize: "16px",
          color: "#ffffff",
          align: "center",
          stroke: "#000",
          strokeThickness: 1,
        })
        .setOrigin(0.5)
        .setDepth(3);

      // Add social media icon with animation
      const iconBaseY = socialY - 120;
      const socialIcon = this.scene.add
        .image(social.x, iconBaseY, social.icon)
        .setDisplaySize(64, 64)
        .setDepth(2);

      // Apply gray tint to placeholder icons
      if (social.icon === "vercel") {
        socialIcon.setTint(0x888888);
      }

      // Add floating animation
      this.scene.tweens.add({
        targets: socialIcon,
        y: iconBaseY - 10,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: index * 200,
      });
    });

    return portals;
  }

  createTeleportPortals(
    skipPortalX: number,
    skipPortalY: number,
    endPortalX: number,
    endPortalY: number,
    lastProjectX: number,
    beginningX: number
  ): Portal[] {
    const portals: Portal[] = [];

    // Create skip-to-end portal
    const skipPortal = this.portalManager.createPortal({
      x: skipPortalX,
      y: skipPortalY,
      links: { teleport: "Skip to Latest Game" },
      teleportTarget: lastProjectX,
    });
    portals.push(skipPortal);

    // Add label for skip portal
    this.scene.add
      .text(skipPortalX, skipPortalY - 80, "SKIP TO END", {
        fontFamily: "RetroSpaceInv",
        fontSize: "16px",
        color: "#ff9900",
        align: "center",
        stroke: "#000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(3);

    // Create back-to-beginning portal
    const backPortal = this.portalManager.createPortal({
      x: endPortalX,
      y: endPortalY,
      links: { teleport: "Back to Beginning" },
      teleportTarget: beginningX,
    });
    portals.push(backPortal);

    // Add label for back portal
    this.scene.add
      .text(endPortalX, endPortalY - 80, "BACK TO START", {
        fontFamily: "RetroSpaceInv",
        fontSize: "16px",
        color: "#ff9900",
        align: "center",
        stroke: "#000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(3);

    return portals;
  }

  getTypewriterTriggers(): TypewriterTrigger[] {
    return this.typewriterTriggers;
  }
}
