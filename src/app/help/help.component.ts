import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../language.service';

@Component({
  selector: 'app-help',
  template: `
    <div class="dialog-overlay">
      <dialog open>
        <h2>{{ translations().quickGuide() }}</h2>
        <ul>
          <li><strong>{{ translations().startStopTitle() }}:</strong> {{ translations().startStopText() }}</li>
          <li><strong>{{ translations().addGoalTitle() }}:</strong> {{ translations().addGoalText() }}</li>
          <li><strong>{{ translations().exclusionTitle() }}:</strong> {{ translations().exclusionText() }}</li>
          <li><strong>{{ translations().undoTitle() }}:</strong> {{ translations().undoText() }}</li>
          <li><strong>{{ translations().settingsTitle() }}:</strong> {{ translations().settingsText() }}</li>
        </ul>
        <button (click)="close.emit()">{{ translations().close() }}</button>
      </dialog>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    dialog {
      background-color: #222;
      color: white;
      border: 1px solid #444;
      border-radius: 10px;
      padding: 20px;
      width: 300px;
      text-align: left;
      font-family: sans-serif;
    }

    dialog h2 {
      font-size: 1.5rem;
      margin-bottom: 15px;
      text-align: center;
    }

    dialog ul {
      list-style-type: none;
      padding: 0;
      margin: 0 0 20px 0;
    }

    dialog li {
      margin-bottom: 10px;
    }

    dialog button {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 10px 15px;
        margin: 5px auto 0;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        display: block;
    }

    dialog button:hover {
        opacity: 0.8;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpComponent {
  close = output<void>();
  languageService = inject(LanguageService);

  translations = computed(() => ({
    quickGuide: this.languageService.getTranslation('quickGuide'),
    startStopTitle: this.languageService.getTranslation('startStopTitle'),
    startStopText: this.languageService.getTranslation('startStopText'),
    addGoalTitle: this.languageService.getTranslation('addGoalTitle'),
    addGoalText: this.languageService.getTranslation('addGoalText'),
    exclusionTitle: this.languageService.getTranslation('exclusionTitle'),
    exclusionText: this.languageService.getTranslation('exclusionText'),
    undoTitle: this.languageService.getTranslation('undoTitle'),
    undoText: this.languageService.getTranslation('undoText'),
    settingsTitle: this.languageService.getTranslation('settingsTitle'),
    settingsText: this.languageService.getTranslation('settingsText'),
    close: this.languageService.getTranslation('close'),
  }));

}
