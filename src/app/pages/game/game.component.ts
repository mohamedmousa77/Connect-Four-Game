import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GameBoardComponent } from '../../components/game-board/game-board.component';
import { TurnTimerComponent } from '../../components/turn-timer/turn-timer.component';
import { RulesModalComponent } from '../../components/rules-modal/rules-modal.component';
import { VictoryModalComponent } from '../../shared/victory-modal/victory-modal.component';
import { StartModalComponent } from '../../shared/start-modal/start-modal.component';

import { GameService } from '../../services/game.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-game',
  imports: [
    CommonModule,
    FormsModule,
    StartModalComponent,
    GameBoardComponent, 
    TurnTimerComponent,
    RulesModalComponent, 
    VictoryModalComponent,
    
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  showRules = false;
  showStartModal = true;
  soundEnabled = true;

  constructor(public gameService: GameService, public storageSer: StorageService) {  }

  resetGame() {
    this.gameService.initBoard();
  }

  restartGame() {
  const confirmed = confirm('Are you sure you want to restart the game? All progress will be lost.');

  if (confirmed) {
    this.storageSer.cleanStorage();
    this.showStartModal = true;
    this.gameService.initBoard();
  }
}


  toggleRules() {
    this.showRules = !this.showRules;
  }

  onGameStart(
    config: {
    isVsCPU: boolean;
    difficulty: 'easy' | 'hard';
    names: { 1: string; 2: string } ;
    }) 
    {
    this.showStartModal = false;

    this.storageSer.playerNames = config.names;
    this.gameService.isVsCPU = config.isVsCPU;
    this.gameService.aiDifficulty = config.difficulty;

    this.storageSer.saveToStorage(this.gameService.score);
    this.resetGame();
  }

}
