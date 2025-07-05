import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GameBoardComponent } from '../../game/components/game-board/game-board.component';
import { TurnTimerComponent } from '../../game/components/turn-timer/turn-timer.component';
import { RulesModalComponent } from '../../game/components/rules-modal/rules-modal.component';
import { VictoryModalComponent } from '../../shared/victory-modal/victory-modal.component';
import { StartModalComponent } from '../../shared/start-modal/start-modal.component';

import { GameService } from '../../game/services/game.service';

@Component({
  selector: 'app-game',
  imports: [
    CommonModule,
    FormsModule,
    GameBoardComponent, 
    TurnTimerComponent,
    RulesModalComponent, 
    VictoryModalComponent,
    StartModalComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  showRules = false;
  showStartModal = true;

  constructor(public gameService: GameService) {  }

  resetGame() {
    this.gameService.initBoard();
  }

  toggleRules() {
    this.showRules = !this.showRules;
  }

  

  onGameStart(config: {
    mode: '2p' | 'cpu',
    name1: string,
    name2: string,
    difficulty: 'easy' | 'hard'
  }) {
    this.showStartModal = false;

    this.gameService.playerNames[1] = config.name1;
    this.gameService.playerNames[2] = config.name2;
    this.gameService.isVsCPU = config.mode === 'cpu';
    this.gameService.saveToStorage();

    // (opzionale) salva difficoltà se implementata
    this.gameService.aiDifficulty = config.difficulty;

    this.gameService.initBoard();
  }

}
