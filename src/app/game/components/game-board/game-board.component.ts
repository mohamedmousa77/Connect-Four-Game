import { Component,OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { DiscComponent } from '../disc/disc.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-game-board',
  imports: [CommonModule, DiscComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit {
  board: any[][] = [];
  rowIndices: number[] = [];
private sub: Subscription | undefined;

  constructor(public gameService : GameService) {}

   ngOnInit(): void {
    this.board = this.gameService.getBoard();

    this.rowIndices = Array.from({ length: this.board.length }, 
      (_, i) => this.board.length - 1 - i);

       this.sub = this.gameService.boardReset$.subscribe(() => {
      this.board = this.gameService.getBoard();
    });
  
    
  }

  onDestroy() {
    this.sub?.unsubscribe();
  }

  handleColumnClick(colIndex: number) {
    // console.log("Column index inserted: "+colIndex);
    // const success = 
    this.gameService.dropDisc(colIndex);
    // if (success) {
    //   this.gameService.switchPlayer();
    // }
  }

  resetGame() {
  this.gameService.initBoard();
  this.board = this.gameService.getBoard();
  }

}
