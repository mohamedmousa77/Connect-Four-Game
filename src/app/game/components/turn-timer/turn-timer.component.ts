import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { GameService } from '../../services/game.service';


@Component({
  selector: 'app-turn-timer',
  imports: [],
  templateUrl: './turn-timer.component.html',
  styleUrl: './turn-timer.component.scss'
})
export class TurnTimerComponent implements OnInit, OnDestroy {
  timeLeft = 30;
  private timerSub: Subscription | undefined;
  private turnSub: Subscription | undefined;
  private resetSub: Subscription | undefined;

  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    // Avvia il timer all'inizio
    this.startTimer();

    // Quando il turno cambia → reset timer
    this.turnSub = this.gameService.turnChange$.subscribe(() => {
      this.startTimer();
    });

    // Quando il gioco viene resettato → reset timer
    this.resetSub = this.gameService.boardReset$.subscribe(() => {
      this.startTimer();
    });
  }

  
  startTimer() {
    this.stopTimer(); // cancella quello vecchio
    this.timeLeft = 30;

    this.timerSub = interval(1000).subscribe(() => {
      if (this.gameService.gameOver) {
        this.stopTimer();
        return;
      }

      this.timeLeft--;

      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.gameService.switchPlayer(); // forza passaggio turno
      }
    });
  }

  stopTimer() {
    this.timerSub?.unsubscribe();
  }
  
  ngOnDestroy(): void {
    this.stopTimer();
    this.turnSub?.unsubscribe();
    this.resetSub?.unsubscribe();
  }

}
