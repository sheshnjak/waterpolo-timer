import { effect, Injectable, signal } from '@angular/core';

const LANGUAGE_STORAGE_KEY = 'waterpolo-timer-language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translations: any = {
    en: {
      quarterDuration: 'Quarter duration (min)',
      attackDuration: 'Attack duration (sec)',
      exclusionDuration: 'Exclusion duration (sec)',
      continuedAttackDuration: 'Continued attack (sec)',
      homeTeamName: 'Home team name',
      awayTeamName: 'Away team name',
      save: 'Save',
      language: 'Language',
      cancel: 'Cancel',
      exclusions: 'Exclusions',
      nextQuarter: 'Next quarter',
      addExclusion: 'Exclusion',
      newAttack: 'New attack',
      gameOver: 'Game over',
      finalScore: 'Final score',
      download: 'Download',
      newGame: 'New game',
      overtimePrompt: 'The score is tied. Start overtime? ',
      yes: 'Yes',
      no: 'No',
      overtime: 'OT',
      recentLogs: 'Recent Logs',
      downloadCurrentLog: 'Download Current Log',
      resetQuarter: 'Reset Quarter',
      saveCurrentLogTitle: 'Save & Start New Game',
      clearIncompleteLogs: 'Clear Incomplete Logs',
      clearAllLogs: 'Clear All Logs',
      addGoal: '+ GOAL',
      goalScoredBy: 'Goal scored by',
      noRecentLogs: 'No recent logs available.',
      resetAll: 'Reset All',
    },
    hr: {
      quarterDuration: 'Trajanje četvrtine (min)',
      attackDuration: 'Trajanje napada (sec)',
      exclusionDuration: 'Trajanje isključenja (sec)',
      continuedAttackDuration: 'Nastavak napada (sec)',
      homeTeamName: 'Ime domaćina',
      awayTeamName: 'Ime gosta',
      save: 'Spremi',
      language: 'Jezik',
      cancel: 'Odustani',
      exclusions: 'Isključenja',
      nextQuarter: 'Sljedeća četvrtina',
      addExclusion: 'Isključenje',
      newAttack: 'Novi napad',
      gameOver: 'Kraj igre',
      finalScore: 'Konačni rezultat',
      download: 'Preuzmi',
      newGame: 'Nova igra',
      overtimePrompt: 'Rezultat je izjednačen. Započeti produžetke?',
      yes: 'Da',
      no: 'Ne',
      overtime: 'OT',
      recentLogs: 'Nedavni zapisnici',
      downloadCurrentLog: 'Preuzmi trenutni zapisnik',
      resetQuarter: 'Resetiraj četvrtinu',
      saveCurrentLogTitle: 'Spremi i započni novu igru',
      clearIncompleteLogs: 'Očisti nepotpune zapisnike',
      clearAllLogs: 'Očisti sve zapisnike',
      addGoal: '+ GOL',
      goalScoredBy: 'Gol je postigao',
      noRecentLogs: 'Nema dostupnih nedavnih zapisa.',
      resetAll: 'Resetiraj sve',
    }
  };

  currentLanguage = signal(this.getInitialLanguage());

  constructor() {
    effect(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, this.currentLanguage());
      }
    });
  }

  private getInitialLanguage(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
    }
    return 'en';
  }

  setLanguage(lang: string) {
    this.currentLanguage.set(lang);
  }

  getTranslation(key: string) {
    return () => this.translations[this.currentLanguage()][key] || key;
  }
}
