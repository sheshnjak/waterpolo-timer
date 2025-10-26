import { ChangeDetectionStrategy, Component, output, input, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Settings } from '../models';
import { LanguageService } from '../language.service';
import { LogService } from '../log.service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  languageService = inject(LanguageService);
  logService = inject(LogService);

  settings = input.required<Settings>();
  settingsChanged = output<Settings>();
  close = output<void>();
  resetQuarter = output<void>();

  editedSettings = signal<Settings>({} as Settings);
  homeTeamName = signal('');
  awayTeamName = signal('');
  pastLogs = this.logService.pastLogs;

  translations = {
    quarterDuration: this.languageService.getTranslation('quarterDuration'),
    attackDuration: this.languageService.getTranslation('attackDuration'),
    continuedAttackDuration: this.languageService.getTranslation('continuedAttackDuration'),
    homeTeamNameLabel: this.languageService.getTranslation('homeTeamName'),
    awayTeamNameLabel: this.languageService.getTranslation('awayTeamName'),
    save: this.languageService.getTranslation('save'),
    language: this.languageService.getTranslation('language'),
    cancel: this.languageService.getTranslation('cancel'),
    recentLogs: this.languageService.getTranslation('recentLogs'),
    downloadCurrentLog: this.languageService.getTranslation('downloadCurrentLog'),
    resetQuarter: this.languageService.getTranslation('resetQuarter'),
    saveCurrentLogTitle: this.languageService.getTranslation('saveCurrentLogTitle'),
  };

  ngOnInit() {
    const currentSettings = this.settings();
    this.editedSettings.set({ ...currentSettings });
    this.homeTeamName.set(currentSettings.homeTeamName);
    this.awayTeamName.set(currentSettings.awayTeamName);
  }

  onSave() {
    const settings: Settings = {
      ...this.editedSettings(),
      homeTeamName: this.homeTeamName(),
      awayTeamName: this.awayTeamName(),
    };
    this.settingsChanged.emit(settings);
  }

  onClose() {
    this.close.emit();
  }

  setLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }

  downloadLog(log: { id: string; entries: any[] }) {
    this.logService.downloadCsv(`log-${log.id}.csv`, log.entries);
  }

  downloadCurrentLog() {
    this.logService.downloadCsv('current_game_log.csv', this.logService.logEntries());
  }
}
