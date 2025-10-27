import { ChangeDetectionStrategy, Component, computed, signal, PLATFORM_ID, Inject, OnInit, inject, ElementRef, ViewChild, WritableSignal } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from '../settings/settings.component';
import { Settings } from '../models';
import { LanguageService } from '../language.service';
import { LogService } from '../log.service';

const SETTINGS_STORAGE_KEY = 'waterpolo-timer-settings';

interface GameState {
  quarter: number | string;
  quarterTime: number;
  attackTime: number;
  whiteExclusions: { id: number; time: number }[];
  blueExclusions: { id: number; time: number }[];
  whiteScore: number;
  blueScore: number;
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
  logService = inject(LogService);
  @ViewChild('quarterTimeInput') quarterTimeInput: ElementRef | undefined;

  translations = {
    addGoal: this.languageService.getTranslation('addGoal'),
    gameOver: this.languageService.getTranslation('gameOver'),
    finalScore: this.languageService.getTranslation('finalScore'),
    download: this.languageService.getTranslation('download'),
    startNewGame: this.languageService.getTranslation('newGame'),
    overtime: this.languageService.getTranslation('overtime')
  };

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
  isGameOver = signal(false);
  tempQuarterTime = signal('');
  showOvertimeDialog = signal(false);

  quarterDisplay = computed(() => {
    const q = this.quarter();
    if (typeof q === 'number') {
      return `${q}/4`;
    } else if (q === 'OT') {
      return this.languageService.getTranslation('overtime')();
    }
    return q;
  });

  // Settings signals
  settings: WritableSignal<Settings> = signal<Settings>({
    quarterDuration: 8,
    attackDuration: 30,
    continuedAttackDuration: 20,
    exclusionDuration: 20,
    homeTeamName: 'WHITE',
    awayTeamName: 'BLUE',
  });

  private intervalId: any;
  private undoTimeout: any;
  private lastState: GameState | null = null;
  private timerTickCount = 0;

  isAttackTimeLow = computed(() => this.attackTime() <= 5);
  isQuarterTimeLow = computed(() => this.quarterTime() <= 10);

  private quarterEndSound = new Audio('assets/sounds/quarter_end.mp3');
  private attackEndSound = new Audio('assets/sounds/attack_end.mp3');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          this.onSettingsChanged(parsedSettings, false); 
        } catch (e) {
          console.error('Error parsing settings from localStorage', e);
        }
      }
    }
  }

  ngOnInit() {
    this.quarterTime.set(this.settings().quarterDuration * 60);
    this.attackTime.set(this.settings().attackDuration);
    this.logService.addEntry('Game started', '');
  }

  toggleTimers() {
    this.running.set(!this.running());
    if (this.running()) {
      this.logService.addEntry('Timer started', '');
      this.intervalId = setInterval(() => {
        this.timerTickCount++;

        if (this.quarterTime() <= 0 || !this.running()) {
          this.stopTimers();
          return;
        }

        const currentAttackTime = this.attackTime();
        if (currentAttackTime > 0) {
          const newTime = currentAttackTime - 0.1;
          if (newTime <= 0) {
            this.attackTime.set(0);
            this.attackEndSound.play();
            this.resetAttackTime(this.settings().attackDuration);
          } else {
            this.attackTime.set(newTime);
          }
        }

        if (this.timerTickCount % 10 === 0) {
          if (this.quarterTime() > 0) {
            this.quarterTime.update(t => t - 1);
            if (this.quarterTime() === 0) {
              this.quarterEndSound.play();
              this.stopTimers();
              if (this.quarter() === 4) {
                if (this.whiteScore() === this.blueScore()) {
                  this.showOvertimeDialog.set(true);
                } else {
                  this.endGame(true);
                }
              } else if (this.quarter() === 'OT') {
                this.endGame(true);
              }
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
      this.logService.addEntry('Timer stopped', '');
      this.stopTimers();
    }
  }

  private stopTimers() {
    this.running.set(false);
    clearInterval(this.intervalId);
  }

  private saveStateForUndo() {
    this.lastState = {
      quarter: this.quarter(),
      quarterTime: this.quarterTime(),
      attackTime: this.attackTime(),
      whiteExclusions: this.whiteExclusions(),
      blueExclusions: this.blueExclusions(),
      whiteScore: this.whiteScore(),
      blueScore: this.blueScore(),
    };
    this.showUndo.set(true);
    clearTimeout(this.undoTimeout);
    this.undoTimeout = setTimeout(() => this.showUndo.set(false), 3000);
  }

  undoLastAction() {
    if (this.lastState) {
      this.logService.addEntry('Undo action performed', '');
      this.quarter.set(this.lastState.quarter);
      this.quarterTime.set(this.lastState.quarterTime);
      this.attackTime.set(this.lastState.attackTime);
      this.whiteExclusions.set(this.lastState.whiteExclusions);
      this.blueExclusions.set(this.lastState.blueExclusions);
      this.whiteScore.set(this.lastState.whiteScore);
      this.blueScore.set(this.lastState.blueScore);
      this.showUndo.set(false);
      clearTimeout(this.undoTimeout);
      this.lastState = null;
    }
  }

  resetAttackTime(seconds: number) {
    const newAttackTime = Math.min(seconds, this.quarterTime());
    this.attackTime.set(newAttackTime);
    this.logService.addEntry(`Attack time reset to ${newAttackTime}`, '');
  }

  nextQuarter() {
    this.saveStateForUndo();
    this.logService.addEntry(`End of Quarter ${this.quarter()}`, '');

    if (this.quarter() === 4) {
      if (this.whiteScore() === this.blueScore()) {
        this.showOvertimeDialog.set(true);
        return;
      } else {
        this.endGame(true);
        this.quarter.set('END');
        return;
      }
    } else if (this.quarter() === 'OT') {
        this.endGame(true);
        this.quarter.set('END');
        return;
    } else if (typeof this.quarter() === 'number') {
      this.quarter.update(q => (q as number) + 1);
    }

    this.resetQuarter(false);
  }

  startOvertime() {
    this.showOvertimeDialog.set(false);
    this.quarter.set('OT');
    this.logService.addEntry('Overtime started', '');
    this.resetQuarter(false);
  }

  endGame(completed: boolean) {
    this.isGameOver.set(true);
    this.showOvertimeDialog.set(false);
    this.logService.saveCurrentLog(this.settings(), this.whiteScore(), this.blueScore(), completed);
  }

  resetGame() {
    this.isGameOver.set(false);
    this.quarter.set(1);
    this.whiteScore.set(0);
    this.blueScore.set(0);
    this.logService.clearCurrentLog();
    this.logService.addEntry('New game started', '');
    this.resetQuarter(false);
  }


  downloadFinalLog() {
    const finalLog = this.logService.pastLogs()[0];
    if (finalLog) {
      this.logService.downloadCsv(finalLog);
    }
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
        const newQuarterTime = minutes * 60 + seconds;
        this.quarterTime.set(newQuarterTime);
        this.logService.addEntry(`Quarter time manually set to ${this.formatTime(newQuarterTime)}`, '');
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
    this.stopTimers();
    if (isPlatformBrowser(this.platformId)) {
        this.quarterEndSound.pause();
        this.quarterEndSound.currentTime = 0;
        this.attackEndSound.pause();
        this.attackEndSound.currentTime = 0;
    }
    this.timerTickCount = 0;
    this.logService.addEntry('Quarter reset', '');
  }

  addExclusion(team: 'white' | 'blue') {
    const newExclusion = { id: Date.now(), time: this.settings().exclusionDuration };
    const teamName = team === 'white' ? this.settings().homeTeamName : this.settings().awayTeamName;

    if (team === 'white') {
      this.whiteExclusions.update(e => [...e, newExclusion]);
    } else {
      this.blueExclusions.update(e => [...e, newExclusion]);
    }
    this.logService.addEntry(`Exclusion added for ${teamName}`, '');
  }

  removeExclusion(team: 'white' | 'blue', id: number) {
    const teamName = team === 'white' ? this.settings().homeTeamName : this.settings().awayTeamName;

    if (team === 'white') {
      this.whiteExclusions.update(e => e.filter(ex => ex.id !== id));
    } else {
      this.blueExclusions.update(e => e.filter(ex => ex.id !== id));
    }
    this.logService.addEntry(`Exclusion removed for ${teamName}`, '');
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  formatAttackTime(seconds: number): string {
    return seconds.toFixed(1);
  }

  incrementScore(team: 'white' | 'blue') {
    this.saveStateForUndo();
    const teamName = team === 'white' ? this.settings().homeTeamName : this.settings().awayTeamName;

    if (team === 'white') {
      this.whiteScore.update(s => s + 1);
    } else {
      this.blueScore.update(s => s + 1);
    }
    this.logService.addEntry(`Score for ${teamName}`, `${this.whiteScore()} to ${this.blueScore()}`);
  }

  decrementScore(team: 'white' | 'blue') {
    this.saveStateForUndo();
    const teamName = team === 'white' ? this.settings().homeTeamName : this.settings().awayTeamName;

    if (team === 'white' && this.whiteScore() > 0) {
      this.whiteScore.update(s => s - 1);
      this.logService.addEntry(`Score for ${teamName} decremented to ${this.whiteScore()}`, '');
    } else if (team === 'blue' && this.blueScore() > 0) {
      this.blueScore.update(s => s - 1);
      this.logService.addEntry(`Score for ${teamName} decremented to ${this.blueScore()}`, '');
    }
  }

  toggleSettings() {
    this.showSettings.update(s => !s);
  }

  onSettingsChanged(newSettings: Settings, toggle = true) {
    this.settings.set(newSettings);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    }
    
    if (!this.running()) {
      this.quarterTime.set(this.settings().quarterDuration * 60);
      this.attackTime.set(this.settings().attackDuration);
    }
    
    this.logService.addEntry('Settings updated', '');
    if (toggle) {
      this.toggleSettings();
    }
  }
}
