import { Scene, Sound } from "phaser";

const globalAudioState = {
  backgroundMusicPlaying: false,
  audioContextResumed: false,
  listenersAdded: false,
  visibilityListenerAdded: false,
};

export class AudioManager {
  private scene: Scene;
  private backgroundMusic?: Sound.BaseSound;
  private teleportSound?: Sound.BaseSound;
  private walkingSound?: Sound.BaseSound;
  private musicEnabled: boolean = true;
  private soundEnabled: boolean = true;
  private musicVolume: number = 0.15;
  private soundVolume: number = 0.5;
  private audioInitialized: boolean = false;
  private wasPausedByVisibility: boolean = false;

  constructor(scene: Scene) {
    this.scene = scene;
    this.setupVisibilityHandler();
  }

  private setupVisibilityHandler(): void {
    if (globalAudioState.visibilityListenerAdded) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
          this.backgroundMusic.pause();
          this.wasPausedByVisibility = true;
        }
      } else {
        if (
          this.backgroundMusic &&
          this.wasPausedByVisibility &&
          globalAudioState.backgroundMusicPlaying
        ) {
          this.backgroundMusic.resume();
          this.wasPausedByVisibility = false;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    globalAudioState.visibilityListenerAdded = true;
  }

  preloadAudio(): void {
    this.scene.load.audio("background_music", "audio/background.mp3");
    this.scene.load.audio("teleport_sound", "audio/teleport.wav");
    this.scene.load.audio("walking_sound", "audio/walk.wav");
  }

  initializeAudio(): void {
    if (this.audioInitialized) {
      return;
    }

    setTimeout(() => {
      try {
        const bgMusicCache = this.scene.cache.audio.get("background_music");
        if (bgMusicCache) {
          this.backgroundMusic = this.scene.sound.add("background_music", {
            volume: this.musicVolume,
            loop: true,
          });
        }

        const teleportCache = this.scene.cache.audio.get("teleport_sound");
        if (teleportCache) {
          this.teleportSound = this.scene.sound.add("teleport_sound", {
            volume: this.soundVolume,
            loop: false,
          });
        }

        const walkingCache = this.scene.cache.audio.get("walking_sound");
        if (walkingCache) {
          this.walkingSound = this.scene.sound.add("walking_sound", {
            volume: this.soundVolume * 0.3,
            loop: true,
          });
        }

        this.audioInitialized = true;
      } catch (error) {
        console.warn("Audio initialization failed:", error);
      }
    }, 100);
  }

  startBackgroundMusic(): void {
    if (
      this.backgroundMusic &&
      this.musicEnabled &&
      !globalAudioState.backgroundMusicPlaying
    ) {
      try {
        if (!this.backgroundMusic.isPlaying && !this.backgroundMusic.isPaused) {
          this.backgroundMusic.play();
          globalAudioState.backgroundMusicPlaying = true;
          this.wasPausedByVisibility = false;
        }
      } catch (error) {
        console.warn("Failed to start background music:", error);
      }
    }
  }

  stopBackgroundMusic(): void {
    if (
      this.backgroundMusic &&
      (this.backgroundMusic.isPlaying || this.backgroundMusic.isPaused)
    ) {
      this.backgroundMusic.stop();
      globalAudioState.backgroundMusicPlaying = false;
      this.wasPausedByVisibility = false;
    }
  }

  playTeleportSound(): void {
    if (this.teleportSound && this.soundEnabled) {
      try {
        if (!this.teleportSound.isPlaying) {
          this.teleportSound.play();
        }
      } catch (error) {
        console.warn("Failed to play teleport sound:", error);
      }
    }
  }

  startWalkingSound(): void {
    if (
      this.walkingSound &&
      this.soundEnabled &&
      !this.walkingSound.isPlaying
    ) {
      try {
        this.walkingSound.play();
      } catch (error) {
        console.warn("Failed to start walking sound:", error);
      }
    }
  }

  stopWalkingSound(): void {
    if (this.walkingSound && this.walkingSound.isPlaying) {
      this.walkingSound.stop();
    }
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.backgroundMusic && "setVolume" in this.backgroundMusic) {
      (this.backgroundMusic as Sound.WebAudioSound).setVolume(this.musicVolume);
    }
  }

  setSoundVolume(volume: number): void {
    this.soundVolume = Math.max(0, Math.min(1, volume));
    if (this.teleportSound && "setVolume" in this.teleportSound) {
      (this.teleportSound as Sound.WebAudioSound).setVolume(this.soundVolume);
    }
    if (this.walkingSound && "setVolume" in this.walkingSound) {
      (this.walkingSound as Sound.WebAudioSound).setVolume(
        this.soundVolume * 0.3
      );
    }
  }

  toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled && !globalAudioState.backgroundMusicPlaying) {
      this.startBackgroundMusic();
    } else if (!this.musicEnabled) {
      this.stopBackgroundMusic();
    }
    return this.musicEnabled;
  }

  toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  getSoundVolume(): number {
    return this.soundVolume;
  }

  destroy(): void {
    this.stopBackgroundMusic();
    this.stopWalkingSound();
    this.backgroundMusic = undefined;
    this.teleportSound = undefined;
    this.walkingSound = undefined;
    this.audioInitialized = false;
  }

  enableAudioOnUserInteraction(): void {
    if (globalAudioState.listenersAdded) {
      return;
    }

    let audioEnabled = false;

    const enableAudio = () => {
      if (audioEnabled || globalAudioState.audioContextResumed) return;
      audioEnabled = true;
      globalAudioState.audioContextResumed = true;

      try {
        const soundManager = this.scene.sound as Sound.WebAudioSoundManager;
        if (soundManager.context && soundManager.context.resume) {
          soundManager.context
            .resume()
            .then(() => {
              this.startBackgroundMusic();
            })
            .catch(() => {
              this.startBackgroundMusic();
            });
        } else {
          this.startBackgroundMusic();
        }
      } catch (error) {
        console.warn("Error enabling audio:", error);
      }

      this.removeAudioListeners();
    };

    document.addEventListener("click", enableAudio);
    document.addEventListener("keydown", enableAudio);
    document.addEventListener("touchstart", enableAudio);
    document.addEventListener("pointerdown", enableAudio);

    globalAudioState.listenersAdded = true;
  }

  private removeAudioListeners(): void {
    globalAudioState.listenersAdded = false;
  }
}
