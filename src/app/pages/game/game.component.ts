import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GameBoardComponent } from '../../game/components/game-board/game-board.component';
import { TurnTimerComponent } from '../../game/components/turn-timer/turn-timer.component';
import { RulesModalComponent } from '../../game/components/rules-modal/rules-modal.component';
import { VictoryModalComponent } from '../../shared/victory-modal/victory-modal.component';
import { StartModalComponent } from '../../shared/start-modal/start-modal.component';

import { GameService } from '../../game/services/game.service';
import { StorageService } from '../../game/services/storage/storage.service';

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

  toggleRules() {
    this.showRules = !this.showRules;
  }


  onGameStart(
    config: {
    mode: '2p' | 'cpu',
    name1: string,
    name2: string,
    difficulty: 'easy' | 'hard'
    }) 
    {
    this.showStartModal = false;

    this.storageSer.playerNames[1] = config.name1;
    this.storageSer.playerNames[2] = config.name2;
    this.gameService.isVsCPU = config.mode === 'cpu';
    this.storageSer.saveToStorage(this.gameService.score);

    // (opzionale) salva difficoltà se implementata
    this.gameService.aiDifficulty = config.difficulty;

    this.gameService.initBoard();
  }

}
