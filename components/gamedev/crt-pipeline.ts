import { Game, Renderer } from "phaser";
import { CRT_FRAGMENT_SHADER, CRT_DEFAULT_PARAMS } from "./crt-shader";

export class CRTPostFXPipeline extends Renderer.WebGL.Pipelines.PostFXPipeline {
  // CRT parameters
  public curvature: number;
  public scanLineOpacityX: number;
  public scanLineOpacityY: number;
  public vignetteOpacity: number;
  public brightness: number;
  public screenResolution: number;

  constructor(game: Game) {
    super({
      game: game,
      renderTarget: true,
      fragShader: CRT_FRAGMENT_SHADER,
    });

    // Set default CRT parameters
    this.curvature = CRT_DEFAULT_PARAMS.curvature;
    this.scanLineOpacityX = CRT_DEFAULT_PARAMS.scanLineOpacityX;
    this.scanLineOpacityY = CRT_DEFAULT_PARAMS.scanLineOpacityY;
    this.vignetteOpacity = CRT_DEFAULT_PARAMS.vignetteOpacity;
    this.brightness = CRT_DEFAULT_PARAMS.brightness;
    this.screenResolution = CRT_DEFAULT_PARAMS.screenResolution;
  }

  onPreRender(): void {
    this.set2f("curvature", this.curvature, this.curvature);
    this.set2f("scanLineOpacity", this.scanLineOpacityX, this.scanLineOpacityY);
    this.set1f("vignetteOpacity", this.vignetteOpacity);
    this.set1f("brightness", this.brightness);
    this.set1f("screenResolution", this.screenResolution);
    this.set2f("uResolution", this.renderer.width, this.renderer.height);
    this.set1f("uTime", this.game.loop.time);
  }
}
