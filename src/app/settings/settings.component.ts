import { ChangeDetectionStrategy, Component, effect, EventEmitter, inject, input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Settings } from '../models';
import { LanguageService } from '../language.service';
import { LogService, LogEntry } from '../log.service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  languageService = inject(LanguageService);
  logService = inject(LogService);
  
  settings = input.required<Settings>();
  @Output() settingsChanged = new EventEmitter<Settings>();
  @Output() close = new EventEmitter<void>();
  @Output() resetQuarter = new EventEmitter<void>();

  editedSettings!: WritableSignal<Settings>;
  homeTeamName!: string;
  awayTeamName!: string;
  pastLogs = this.logService.pastLogs;
  private previousLang: string;

  translations = {
    quarterDuration: this.languageService.getTranslation('quarterDuration'),
    attackDuration: this.languageService.getTranslation('attackDuration'),
    exclusionDuration: this.languageService.getTranslation('exclusionDuration'),
    continuedAttackDuration: this.languageService.getTranslation('continuedAttackDuration'),
    homeTeamNameLabel: this.languageService.getTranslation('homeTeamName'),
    awayTeamNameLabel: this.languageService.getTranslation('awayTeamName'),
    save: this.languageService.getTranslation('save'),
    cancel: this.languageService.getTranslation('cancel'),
    recentLogs: this.languageService.getTranslation('recentLogs'),
    downloadCurrentLog: this.languageService.getTranslation('downloadCurrentLog'),
    resetQuarter: this.languageService.getTranslation('resetQuarter'),
    saveCurrentLogTitle: this.languageService.getTranslation('saveCurrentLogTitle'),
    noRecentLogs: this.languageService.getTranslation('noRecentLogs'),
  };

  constructor() {
    this.previousLang = this.languageService.currentLanguage();
    effect(() => {
      const newLang = this.languageService.currentLanguage();
      this.handleLanguageChange(newLang);
      this.previousLang = newLang;
    });
  }

  ngOnInit() {
    this.editedSettings = signal(this.settings());
    this.homeTeamName = this.settings().homeTeamName;
    this.awayTeamName = this.settings().awayTeamName;
  }

  private handleLanguageChange(newLang: string) {
    if (!this.homeTeamName || !this.awayTeamName) {
      return;
    }

    const oldLang = this.previousLang;
    if (oldLang === newLang) {
      return;
    }

    const defaultNames: { [lang: string]: { home: string; away: string } } = {
      en: { home: 'WHITE', away: 'BLUE' },
      hr: { home: 'BIJELI', away: 'PLAVI' },
    };

    const oldDefaults = defaultNames[oldLang];
    const newDefaults = defaultNames[newLang];

    if (oldDefaults && newDefaults) {
      if (this.homeTeamName.toUpperCase() === oldDefaults.home) {
        this.homeTeamName = newDefaults.home;
      }
      if (this.awayTeamName.toUpperCase() === oldDefaults.away) {
        this.awayTeamName = newDefaults.away;
      }
    }
  }

  onSave() {
    const newSettings: Settings = {
      ...this.editedSettings(),
      homeTeamName: this.homeTeamName,
      awayTeamName: this.awayTeamName,
    };
    this.settingsChanged.emit(newSettings);
    this.logService.addEntry('Settings saved', '');
  }

  onClose() {
    this.close.emit();
  }

  setLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }

  formatLog(log: { id: string, entries: LogEntry[] }): string {
    if (log.entries.length === 0) {
      return `Game from ${new Date(log.id).toLocaleString()} - No entries`;
    }
    const finalScore = log.entries[log.entries.length - 1];
    const date = new Date(log.id).toLocaleString();
    return `Game from ${date} - Final Score: ${finalScore.details}`;
  }

  downloadLog(log: { id: string, entries: LogEntry[] }) {
    if (log.entries.length === 0) return;
    const finalScore = log.entries[log.entries.length - 1];
    const date = new Date(log.id).toISOString().split('T')[0];
    const filename = `game_log_${date}_${finalScore.details.replace(' to ', '-')}.csv`;
    this.logService.downloadCsv(filename, log.entries);
  }

  downloadCurrentLog() {
    this.logService.saveCurrentLog();
  }

  clearIncompleteLogs() {
    this.logService.clearIncompleteLogs();
  }

  clearAllLogs() {
    this.logService.clearAllLogs();
  }
}
