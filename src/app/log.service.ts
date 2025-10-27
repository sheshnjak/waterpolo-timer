import { Injectable, signal } from '@angular/core';
import { GameLog, LogEntry, Settings } from './models';

const LOG_STORAGE_KEY = 'waterpolo-timer-logs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  logEntries = signal<LogEntry[]>([]);
  pastLogs = signal<GameLog[]>([]);

  constructor() {
    this.loadPastLogs();
  }

  addEntry(event: string, details: string, quarter: number, gameTime: string, whiteScore: number, blueScore: number) {
    this.logEntries.update(entries => [...entries, {
      id: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      event,
      details,
      whiteScore,
      blueScore,
      quarter,
      gameTime
    }]);
  }

  generateCsv(entries: LogEntry[]): string {
    const header = 'Quarter,Game Clock,Event,Details,Score\n';
    const rows = entries
      .map(e => `${e.quarter},${e.gameTime},${e.event},"${e.details}","${e.whiteScore}-${e.blueScore}"`)
      .join('\n');
    return header + rows;
  }

  downloadCsv(log: GameLog) {
    const csv = this.generateCsv(log.log);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', this.getLogFileName(log));
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  saveCurrentLog(settings: Settings, whiteScore: number, blueScore: number, completed: boolean) {
    const currentEntries = this.logEntries();
    if (currentEntries.length === 0) return;

    this.pastLogs.update(logs => {
      const newLog: GameLog = {
        id: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        settings,
        log: currentEntries,
        completed,
        homeTeamName: settings.homeTeamName,
        awayTeamName: settings.awayTeamName,
        whiteScore,
        blueScore
      };
      const updatedLogs = [newLog, ...logs].slice(0, 5);
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
      return updatedLogs;
    });
    this.clearCurrentLog();
  }

  loadPastLogs() {
    if (typeof window !== 'undefined' && window.localStorage) {
        const savedLogs = localStorage.getItem(LOG_STORAGE_KEY);
        if (savedLogs) {
            this.pastLogs.set(JSON.parse(savedLogs));
        }
    }
  }

  clearCurrentLog() {
    this.logEntries.set([]);
  }

  clearAllLogs() {
    this.pastLogs.set([]);
    localStorage.removeItem(LOG_STORAGE_KEY);
  }

  clearIncompleteLogs() {
    this.pastLogs.update(logs => {
      const completeLogs = logs.filter(log => log.completed);
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(completeLogs));
      return completeLogs;
    });
  }

  getLogFileName(log: GameLog): string {
    const date = new Date(log.timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const baseName = `${year}.${month}.${day} ${hours}:${minutes} - ${log.homeTeamName}:${log.awayTeamName} ${log.whiteScore}:${log.blueScore}.csv`;
    return baseName.replace(/:/g, '.');
  }
}
