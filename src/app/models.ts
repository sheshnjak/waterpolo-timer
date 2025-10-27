export interface Settings {
  quarterDuration: number;
  attackDuration: number;
  continuedAttackDuration: number;
  exclusionDuration: number; 
  homeTeamName: string;
  awayTeamName: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  whiteScore: number;
  blueScore: number;
  quarter: number | string;
  gameTime: string;
  attackTime: string;
  details: string;
}

export interface GameLog {
  id: string;
  timestamp: string;
  settings: Settings;
  log: LogEntry[];
  completed: boolean;
  homeTeamName: string;
  awayTeamName: string;
  whiteScore: number;
  blueScore: number;

}
