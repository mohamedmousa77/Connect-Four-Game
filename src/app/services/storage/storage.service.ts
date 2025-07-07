import { Injectable } from '@angular/core';
import { GameService } from '../game.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
    playerNames: { [key: number]: string } = {
      1: 'Player 1',
      2: 'Player 2'
    };

  constructor() { }

  // To save in storage
  saveToStorage(score: { [key: number]: number }, ) {
    localStorage.setItem('connect4_score', JSON.stringify(score));
    localStorage.setItem('connect4_names', JSON.stringify(this.playerNames));
  }

  loadFromStorage(score: { [key: number]: number }, ) {
    const savedScore = localStorage.getItem('connect4_score');
    const savedNames = localStorage.getItem('connect4_names');
    if (savedScore) {
      score = JSON.parse(savedScore);
    }
    if (savedNames) {
      this.playerNames = JSON.parse(savedNames);
    }
  }

  cleanStorage(){
    localStorage.clear();
  }
}
