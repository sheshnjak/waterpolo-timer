import { Injectable, signal, computed } from '@angular/core';

const LANGUAGE_STORAGE_KEY = 'waterpolo-timer-language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translations: { [key: string]: { [key: string]: string } } = {
    en: {
      quarter: 'QUARTER',
      attack: 'ATTACK',
      exclusions: 'EXCLUSIONS',
      newAttack: 'NEW ATTACK',
      resetAttack: 'RESET ATTACK',
      continueAttack: 'CONTINUE ATTACK',
      nextQuarter: 'NEXT QTR',
      resetQuarter: 'Reset Quarter',
      addExclusion: 'EXCLUSION',
      settings: 'SETTINGS',
      white: 'WHITE',
      blue: 'BLUE',
      quarterDuration: 'Quarter Duration (min)',
      attackDuration: 'Attack Duration (sec)',
      continuedAttackDuration: 'Continued Attack (sec)',
      homeTeamName: 'Home Team Name',
      awayTeamName: 'Away Team Name',
      save: 'SAVE',
      language: 'Language',
      overtime: 'OVERTIME',
      cancel: 'CANCEL',
      gameOver: 'Game Over',
      downloadLog: 'Download Log',
      recentLogs: 'Recent Logs',
      downloadCurrentLog: 'Download Current Log',
      saveCurrentLogTitle: 'Save current log',
      finalScore: 'Final Score',
      newGame: 'New Game',
      clearIncompleteLogs: 'Clear incomplete logs',
      clearAllLogs: 'Clear all logs',
      overtimePrompt: 'Overtime?',
      yes: 'Yes',
      no: 'No',
    },
    hr: {
      quarter: 'ČETVRTINA',
      attack: 'NAPAD',
      exclusions: 'ISKLJUČENJA',
      newAttack: 'NOVI NAPAD',
      resetAttack: 'RESET NAPADA',
      continueAttack: 'NASTAVAK NAPADA',
      nextQuarter: 'SLJEDEĆA ČETVRTINA',
      resetQuarter: 'Reset četvrtine',
      addExclusion: 'ISKLJUČENJE',
      settings: 'POSTAVKE',
      white: 'BIJELI',
      blue: 'PLAVI',
      quarterDuration: 'Trajanje četvrtine (min)',
      attackDuration: 'Trajanje napada (sek)',
      continuedAttackDuration: 'Nastavak napada (sek)',
      homeTeamName: 'Ime domaćina',
      awayTeamName: 'Ime gosta',
      save: 'SPREMI',
      language: 'Jezik',
      overtime: 'PRODUŽETAK',
      cancel: 'ODUSTANI',
      gameOver: 'Kraj utakmice',
      downloadLog: 'Preuzmi zapisnik',
      recentLogs: 'Nedavni zapisnici',
      downloadCurrentLog: 'Preuzmi trenutni zapisnik',
      saveCurrentLogTitle: 'Spremi trenutni zapisnik',
      finalScore: 'Konačni rezultat',
      newGame: 'Nova igra',
      clearIncompleteLogs: 'Izbriši nepotpune zapisnike',
      clearAllLogs: 'Izbriši sve zapisnike',
      overtimePrompt: 'Produžetak?',
      yes: 'Da',
      no: 'Ne',
    }
  };

  private language = signal(this.getInitialLanguage());

  private getInitialLanguage(): string {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
    }
    return 'en';
  }

  getTranslation(key: string) {
    return computed(() => this.translations[this.language()]?.[key] || key);
  }

  setLanguage(lang: string) {
    this.language.set(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  }

  getCurrentLanguage() {
    return this.language();
  }
}
