import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameBoardComponent } from '../../game/components/game-board/game-board.component';
import { TurnTimerComponent } from '../../game/components/turn-timer/turn-timer.component';
import { RulesModalComponent } from '../../game/components/rules-modal/rules-modal.component';
import { VictoryModalComponent } from '../../shared/victory-modal/victory-modal.component';

import { GameService } from '../../game/services/game.service';

@Component({
  selector: 'app-game',
  imports: [GameBoardComponent, TurnTimerComponent,RulesModalComponent, CommonModule,VictoryModalComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  showRules = false;

constructor(public gameService: GameService) {  }

resetGame() {
  this.gameService.initBoard();
}

toggleRules() {
  this.showRules = !this.showRules;
}
}
