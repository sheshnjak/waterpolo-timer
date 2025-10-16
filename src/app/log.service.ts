import { Injectable, signal } from '@angular/core';

const LOG_STORAGE_KEY = 'waterpolo-timer-logs';

export interface LogEntry {
  timestamp: Date;
  event: string;
  details: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  logEntries = signal<LogEntry[]>([]);
  pastLogs = signal<{ id: string; entries: LogEntry[] }[]>([]);

  constructor() {
    this.loadPastLogs();
  }

  addEntry(event: string, details: string) {
    this.logEntries.update(entries => [...entries, { timestamp: new Date(), event, details }]);
  }

  generateCsv(entries: LogEntry[]): string {
    const header = 'Timestamp,Event,Details\n';
    const rows = entries.map(e => `${e.timestamp.toISOString()},${e.event},"${e.details}"`).join('\n');
    return header + rows;
  }

  downloadCsv(filename: string, entries: LogEntry[]) {
    const csv = this.generateCsv(entries);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  saveCurrentLog() {
    const currentEntries = this.logEntries();
    if (currentEntries.length === 0) return;

    this.pastLogs.update(logs => {
      const newLog = { id: new Date().toISOString(), entries: currentEntries };
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
}
