import { Scene } from "phaser";

export class AnimationManager {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  createPlayerAnimations(): void {
    // Player idle animations
    this.scene.anims.create({
      key: "idle01",
      frames: this.scene.anims.generateFrameNumbers("idle01", {
        start: 0,
        end: 5,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "idle02",
      frames: this.scene.anims.generateFrameNumbers("idle02", {
        start: 0,
        end: 10,
      }),
      frameRate: 5,
      repeat: 0,
    });

    // Player movement animations
    this.scene.anims.create({
      key: "jump",
      frames: this.scene.anims.generateFrameNumbers("jump", {
        start: 0,
        end: 7,
      }),
      frameRate: 15,
      repeat: 0,
    });

    this.scene.anims.create({
      key: "walk",
      frames: this.scene.anims.generateFrameNumbers("walk", {
        start: 0,
        end: 7,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNumbers("run", {
        start: 0,
        end: 7,
      }),
      frameRate: 12,
      repeat: -1,
    });
  }

  createShopAnimations(): void {
    this.scene.anims.create({
      key: "shop_idle",
      frames: this.scene.anims.generateFrameNumbers("shop", {
        start: 0,
        end: 5,
      }),
      frameRate: 6,
      repeat: -1,
    });
  }

  createAllAnimations(): void {
    this.createPlayerAnimations();
    this.createShopAnimations();
  }
}
