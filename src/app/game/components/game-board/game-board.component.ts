import { Component,OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { DiscComponent } from '../disc/disc.component';
@Component({
  selector: 'app-game-board',
  imports: [CommonModule, DiscComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit {
  board: any[][] = [];

  constructor(public gameService : GameService) {}

   ngOnInit(): void {
    this.board = this.gameService.getBoard();
  }

  handleColumnClick(colIndex: number) {
    const success = this.gameService.dropDisc(colIndex);
    if (success) {
      this.gameService.switchPlayer();
    }
  }

  resetGame() {
  this.gameService.initBoard();
  this.board = this.gameService.getBoard();
  }

}
