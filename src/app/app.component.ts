import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './pages/game/game.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'connect-four';
}
