import { ChangeDetectionStrategy, Component, output, input, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Settings } from '../settings';
import { LanguageService } from '../language.service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  languageService = inject(LanguageService);
  
  settings = input.required<Settings>();
  settingsChanged = output<Settings>();
  close = output<void>();

  editedSettings = signal<Settings>({ ...this.settings() });

  translations = {
    quarterDuration: this.languageService.getTranslation('quarterDuration'),
    attackDuration: this.languageService.getTranslation('attackDuration'),
    continuedAttackDuration: this.languageService.getTranslation('continuedAttackDuration'),
    homeTeamName: this.languageService.getTranslation('homeTeamName'),
    awayTeamName: this.languageService.getTranslation('awayTeamName'),
    save: this.languageService.getTranslation('save'),
    language: this.languageService.getTranslation('language'),
    cancel: this.languageService.getTranslation('cancel'),
  };

  onSave() {
    this.settingsChanged.emit(this.editedSettings());
  }

  onClose() {
    this.close.emit();
  }

  setLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }
}
