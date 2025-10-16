import { Routes } from '@angular/router';
import { GameBoardComponent } from './game-board/game-board';

export const routes: Routes = [
  { path: '', component: GameBoardComponent, pathMatch: 'full' }
];
