import { ChangeDetectionStrategy, Component, computed, signal, PLATFORM_ID, Inject, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from '../settings/settings.component';
import { Settings } from '../settings';
import { LanguageService } from '../language.service';

const SETTINGS_STORAGE_KEY = 'waterpolo-timer-settings';

interface GameState {
  quarter: number | string;
  quarterTime: number;
  attackTime: number;
  whiteExclusions: { id: number; time: number }[];
  blueExclusions: { id: number; time: number }[];
}

@Component({
  selector: 'app-game-board',
  imports: [CommonModule, SettingsComponent, FormsModule],
  templateUrl: './game-board.html',
  styleUrls: ['./game-board.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent implements OnInit {
  languageService = inject(LanguageService);
  @ViewChild('quarterTimeInput') quarterTimeInput: ElementRef | undefined;

  // Game state signals
  quarter = signal<number | string>(1);
  quarterTime = signal(8 * 60);
  attackTime = signal(30);
  whiteScore = signal(0);
  blueScore = signal(0);
  whiteExclusions = signal<{ id: number; time: number }[]>([]);
  blueExclusions = signal<{ id: number; time: number }[]>([]);
  running = signal(false);
  showSettings = signal(false);
  showUndo = signal(false);
  isEditingQuarterTime = signal(false);
  tempQuarterTime = signal('');

  // Translations
  translations = {
    quarter: this.languageService.getTranslation('quarter'),
    attack: this.languageService.getTranslation('attack'),
    exclusions: this.languageService.getTranslation('exclusions'),
    resetAttack: this.languageService.getTranslation('resetAttack'),
    continueAttack: this.languageService.getTranslation('continueAttack'),
    nextQuarter: this.languageService.getTranslation('nextQuarter'),
    resetQuarter: this.languageService.getTranslation('resetQuarter'),
    addExclusion: this.languageService.getTranslation('addExclusion'),
    settings: this.languageService.getTranslation('settings'),
    undo: this.languageService.getTranslation('undo'),
  };

  quarterDisplay = computed(() => {
    const q = this.quarter();
    if (typeof q === 'number') {
      return `${q}/4`;
    }
    return q;
  });
  
  // Settings signals
  settings = signal<Settings>({
    quarterDuration: 8,
    attackDuration: 30,
    continuedAttackDuration: 20,
    homeTeamName: this.languageService.getTranslation('white')(),
    awayTeamName: this.languageService.getTranslation('blue')(),
  });

  private intervalId: any;
  private undoTimeout: any;
  private lastState: GameState | null = null;
  private timerTickCount = 0;

  isAttackTimeLow = computed(() => this.attackTime() <= 5);

  private quarterEndSound = new Audio('assets/sounds/quarter_end.mp3');
  private attackEndSound = new Audio('assets/sounds/attack_end.mp3');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        this.settings.set(JSON.parse(savedSettings));
      }
    }
  }

  ngOnInit() {
    this.quarterTime.set(this.settings().quarterDuration * 60);
    this.attackTime.set(this.settings().attackDuration);
  }

  toggleTimers() {
    this.running.set(!this.running());
    if (this.running()) {
      this.intervalId = setInterval(() => {
        this.timerTickCount++;

        const currentAttackTime = this.attackTime();
        if (currentAttackTime > 0) {
          const newTime = currentAttackTime - 0.1;
          if (newTime <= 0) {
            this.attackTime.set(0);
            this.attackEndSound.play();
            this.attackTime.set(this.settings().attackDuration);
          } else {
            this.attackTime.set(newTime);
          }
        }

        if (this.timerTickCount % 10 === 0) {
          if (this.quarterTime() > 0) {
            this.quarterTime.update(t => t - 1);
            if (this.quarterTime() === 0) {
              this.quarterEndSound.play();
            }
          }

          this.whiteExclusions.update(exclusions =>
            exclusions
              .map(e => ({ ...e, time: e.time > 0 ? e.time - 1 : 0 }))
              .filter(e => e.time > 0)
          );
          this.blueExclusions.update(exclusions =>
            exclusions
              .map(e => ({ ...e, time: e.time > 0 ? e.time - 1 : 0 }))
              .filter(e => e.time > 0)
          );
        }
      }, 100);
    } else {
      clearInterval(this.intervalId);
    }
  }

  private saveStateForUndo() {
    this.lastState = {
      quarter: this.quarter(),
      quarterTime: this.quarterTime(),
      attackTime: this.attackTime(),
      whiteExclusions: this.whiteExclusions(),
      blueExclusions: this.blueExclusions(),
    };
    this.showUndo.set(true);
    clearTimeout(this.undoTimeout);
    this.undoTimeout = setTimeout(() => this.showUndo.set(false), 3000);
  }

  undoLastAction() {
    if (this.lastState) {
      this.quarter.set(this.lastState.quarter);
      this.quarterTime.set(this.lastState.quarterTime);
      this.attackTime.set(this.lastState.attackTime);
      this.whiteExclusions.set(this.lastState.whiteExclusions);
      this.blueExclusions.set(this.lastState.blueExclusions);
      this.showUndo.set(false);
      clearTimeout(this.undoTimeout);
      this.lastState = null;
    }
  }

  resetAttackTime(seconds: number) {
    this.attackTime.set(seconds);
  }

  nextQuarter() {
    this.saveStateForUndo();
    this.quarter.update(q => {
        if (q === 1) return 2;
        if (q === 2) return 3;
        if (q === 3) return 4;
        if (q === 4) return this.languageService.getTranslation('overtime')() === 'OVERTIME' ? 'OVER' : 'PROD';
        return 1;
    });
    this.resetQuarter(false);
  }

  editQuarterTime() {
    this.isEditingQuarterTime.set(true);
    this.tempQuarterTime.set(this.formatTime(this.quarterTime()));
    setTimeout(() => this.quarterTimeInput?.nativeElement.focus(), 0);
  }

  saveQuarterTime() {
    const newTime = this.tempQuarterTime();
    const timeParts = newTime.split(':');
    if (timeParts.length === 2) {
      const minutes = parseInt(timeParts[0], 10);
      const seconds = parseInt(timeParts[1], 10);
      if (!isNaN(minutes) && !isNaN(seconds)) {
        this.quarterTime.set(minutes * 60 + seconds);
      }
    }
    this.isEditingQuarterTime.set(false);
  }

  resetQuarter(saveState = true) {
    if (saveState) {
        this.saveStateForUndo();
    }
    this.quarterTime.set(this.settings().quarterDuration * 60);
    this.attackTime.set(this.settings().attackDuration);
    this.whiteExclusions.set([]);
    this.blueExclusions.set([]);
    this.running.set(false);
    if (isPlatformBrowser(this.platformId)) {
        clearInterval(this.intervalId);
        this.quarterEndSound.pause();
        this.quarterEndSound.currentTime = 0;
        this.attackEndSound.pause();
        this.attackEndSound.currentTime = 0;
    }
    this.timerTickCount = 0;
  }

  addExclusion(team: 'white' | 'blue') {
    const newExclusion = { id: Date.now(), time: 20 };
    if (team === 'white') {
      this.whiteExclusions.update(e => [...e, newExclusion]);
    } else {
      this.blueExclusions.update(e => [...e, newExclusion]);
    }
  }

  removeExclusion(team: 'white' | 'blue', id: number) {
    if (team === 'white') {
      this.whiteExclusions.update(e => e.filter(ex => ex.id !== id));
    } else {
      this.blueExclusions.update(e => e.filter(ex => ex.id !== id));
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  formatAttackTime(seconds: number): string {
    return seconds.toFixed(1);
  }

  incrementWhiteScore() {
    this.whiteScore.update(s => s + 1);
  }

  decrementWhiteScore() {
    if (this.whiteScore() > 0) {
      this.whiteScore.update(s => s - 1);
    }
  }

  incrementBlueScore() {
    this.blueScore.update(s => s + 1);
  }

  decrementBlueScore() {
    if (this.blueScore() > 0) {
      this.blueScore.update(s => s - 1);
    }
  }

  toggleSettings() {
    this.showSettings.update(s => !s);
  }

  onSettingsChanged(newSettings: Settings) {
    this.settings.set(newSettings);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    }
    if (!this.running()) {
        this.quarterTime.set(this.settings().quarterDuration * 60);
        this.attackTime.set(this.settings().attackDuration);
    }
    this.toggleSettings();
  }
}
