import { Scene, GameObjects } from "phaser";

export class BackgroundManager {
  private scene: Scene;
  private bgFar!: GameObjects.TileSprite;
  private bgMid!: GameObjects.TileSprite;
  private bgNear!: GameObjects.TileSprite;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  createParallaxBackground(): void {
    const { width, height } = this.scene.scale;

    this.bgFar = this.scene.add
      .tileSprite(0, 0, width, height, "bg_far")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setTileScale(
        height / this.scene.textures.get("bg_far").getSourceImage().height,
        height / this.scene.textures.get("bg_far").getSourceImage().height
      );

    this.bgMid = this.scene.add
      .tileSprite(0, 0, width, height, "bg_mid")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setTileScale(
        height / this.scene.textures.get("bg_mid").getSourceImage().height,
        height / this.scene.textures.get("bg_mid").getSourceImage().height
      );

    this.bgNear = this.scene.add
      .tileSprite(0, 0, width, height, "bg_near")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setTileScale(
        height / this.scene.textures.get("bg_near").getSourceImage().height,
        height / this.scene.textures.get("bg_near").getSourceImage().height
      );
  }

  setupResizeHandlers(): void {
    const handleResize = () => {
      if (!this.scene.scene.isActive()) return;

      // Case: FullScreen
      // Action: Skip Function
      if (this.scene.scale.isFullscreen && !document.fullscreenElement) return;

      const { width, height } = this.scene.scale.gameSize;

      const scaleX_far =
        height / this.scene.textures.get("bg_far").getSourceImage().width;
      const scaleY_far =
        height / this.scene.textures.get("bg_far").getSourceImage().height;

      const scaleX_mid =
        height / this.scene.textures.get("bg_mid").getSourceImage().width;
      const scaleY_mid =
        height / this.scene.textures.get("bg_mid").getSourceImage().height;

      const scaleX_near =
        height / this.scene.textures.get("bg_near").getSourceImage().width;
      const scaleY_near =
        height / this.scene.textures.get("bg_near").getSourceImage().height;

      this.bgFar?.setSize(width, height).setTileScale(scaleX_far, scaleY_far);
      this.bgMid?.setSize(width, height).setTileScale(scaleX_mid, scaleY_mid);
      this.bgNear
        ?.setSize(width, height)
        .setTileScale(scaleX_near, scaleY_near);
    };

    // Phaser's inbuilt function
    this.scene.scale.on("resize", handleResize, this.scene);

    // Initial resize
    handleResize();

    // Case: FullScreen
    // Action: Refresh Scale
    document.addEventListener("fullscreenchange", () => {
      this.scene.time.delayedCall(200, () => {
        this.scene.scale.refresh();
        handleResize();
      });
    });
  }

  updateParallax(scrollX: number): void {
    this.bgFar.tilePositionX = scrollX * 0.3;
    this.bgMid.tilePositionX = scrollX * 0.6;
    this.bgNear.tilePositionX = scrollX * 0.9;
  }

  getBackgrounds() {
    return {
      bgFar: this.bgFar,
      bgMid: this.bgMid,
      bgNear: this.bgNear,
    };
  }
}
