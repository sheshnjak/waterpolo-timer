import { ChangeDetectionStrategy, Component, output, input, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Settings } from '../settings';
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
  pastLogs = this.logService.pastLogs;

  translations = {
    quarterDuration: this.languageService.getTranslation('quarterDuration'),
    attackDuration: this.languageService.getTranslation('attackDuration'),
    continuedAttackDuration: this.languageService.getTranslation('continuedAttackDuration'),
    homeTeamName: this.languageService.getTranslation('homeTeamName'),
    awayTeamName: this.languageService.getTranslation('awayTeamName'),
    save: this.languageService.getTranslation('save'),
    language: this.languageService.getTranslation('language'),
    cancel: this.languageService.getTranslation('cancel'),
    recentLogs: this.languageService.getTranslation('recentLogs'),
    downloadCurrentLog: this.languageService.getTranslation('downloadCurrentLog'),
    resetQuarter: this.languageService.getTranslation('resetQuarter'),
    saveCurrentLogTitle: this.languageService.getTranslation('saveCurrentLogTitle'),
  };

  ngOnInit() {
    this.editedSettings.set({ ...this.settings() });
  }

  onSave() {
    this.settingsChanged.emit(this.editedSettings());
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
