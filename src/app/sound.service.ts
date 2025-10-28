import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private audioContext: AudioContext | null = null;
  private activeSources: OscillatorNode[] = [];
  // C5, D5, E5, G5, A5 (Pentatonic Scale)
  private countdownFrequencies = [523.25, 587.33, 659.25, 783.99, 880.00];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playAttackEndSound() {
    if (!this.audioContext) return;
    this.stopAllSounds();

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5
    oscillator.connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 1); // 1-second duration
    this.activeSources.push(oscillator);
  }

  playQuarterEndSound() {
    if (!this.audioContext) return;
    this.stopAllSounds();

    const oscillator1 = this.audioContext.createOscillator();
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(1046.5, this.audioContext.currentTime); // C6
    oscillator1.connect(this.audioContext.destination);
    oscillator1.start();
    oscillator1.stop(this.audioContext.currentTime + 1); // 1-second duration
    this.activeSources.push(oscillator1);

    const oscillator2 = this.audioContext.createOscillator();
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(1396.91, this.audioContext.currentTime + 1.1); // F6
    oscillator2.connect(this.audioContext.destination);
    oscillator2.start(this.audioContext.currentTime + 1.1);
    oscillator2.stop(this.audioContext.currentTime + 2.1); // 1-second duration
    this.activeSources.push(oscillator2);
  }

  playCountdownBeep(second: number) {
      if (!this.audioContext || second < 1 || second > 5) return;
      
      const frequency = this.countdownFrequencies[5 - second];
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.connect(this.audioContext.destination);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.15); // 150ms duration
  }

  stopAllSounds() {
    this.activeSources.forEach(source => {
        try {
            source.stop();
        } catch (e) {
            // Ignore errors if the source is already stopped
        }
    });
    this.activeSources = [];
  }
}
