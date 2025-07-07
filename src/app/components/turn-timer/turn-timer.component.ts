import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { GameService } from '../../services/game.service';


@Component({
  selector: 'app-turn-timer',
  imports: [CommonModule],
  templateUrl: './turn-timer.component.html',
  styleUrl: './turn-timer.component.scss'
})
export class TurnTimerComponent implements OnInit, OnDestroy {
  @Input() player: number = 1; 
  @Input() isActive: boolean = false;
  private timerInterval: any;
  timeLeft = 30;
  showTimeoutMessage = false;

  private timerSub: Subscription | undefined;
  private turnSub: Subscription | undefined;
  private resetSub: Subscription | undefined;

  constructor(public gameService: GameService) {}
  
  ngOnInit(): void {
    // Avvia il timer all'inizio
    if (this.isActive) {
    this.startTimer();
    }

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
      const tick = new Audio('tick-timer.mp3');
      tick.play();
      this.timeLeft--;

      if (this.timeLeft <= 0) {
        this.showTimeoutMessage = true;
          setTimeout(() => {
            this.showTimeoutMessage = false;
            this.gameService.switchPlayer(); // cambia il turno dopo timeout
          }, 2000);

        this.stopTimer();
      }
    });
  }

  stopTimer() {
    this.timerSub?.unsubscribe();
  }

  get dashOffset(): number {
    const totalLength = 2 * Math.PI * 45; // ≈ 282.6
    return totalLength * ((30 - this.timeLeft) / 30);
  }
  
  ngOnDestroy(): void {
    this.stopTimer();
    this.turnSub?.unsubscribe();
    this.resetSub?.unsubscribe();
  }

}
