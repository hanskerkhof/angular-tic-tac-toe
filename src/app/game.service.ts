import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private socket: Socket) { }
  currentGame$ = this.socket.fromEvent<any>('game');
  games$ = this.socket.fromEvent<string[]>('games');

  getGame(gameId: string): void {
    this.socket.emit('getGame', gameId);
  }

  newGame(): void {
    this.socket.emit('addGame');
  }

  joinGame(gameId: string, playerName: string): void {
    this.socket.emit('joinGame', {gameId, playerName});
  }

  playGame(gameId: string, playerName: string, x: number, y: number): void {
    console.log('playGame', gameId, playerName, x, y);
    this.socket.emit('playGame', {gameId, playerName, x, y});
  }
}
