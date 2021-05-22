import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {GameService} from '../game.service';

export interface Game {
    [key: string]: {
        players: Array<string>;
        state: GameState;
        turn: string;
        moves: number;
    }
}
export type GameState = Array<Array<number>>

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
    game!: Game;
    gameId!: string;
    _gameSub!: Subscription;
    currentPlayerName!: string;
    winner!: string | null;
    draw!: boolean;

    constructor(private gameService: GameService) {
    }

    ngOnInit(): void {
        this._gameSub = this.gameService.currentGame$.subscribe(game => {
            console.log('currentGame$', game);
            this.game = game;
            this.gameId = Object.keys(game)[0];

            const winIndex = this.checkStateForWin(this.game[this.gameId].state);

            if (winIndex) {
                if (this.game[this.gameId].state[winIndex[0]][winIndex[1]]===1) {
                    this.winner = this.game[this.gameId].players[0];
                } else if (this.game[this.gameId].state[winIndex[0]][winIndex[1]]=== -1) {
                    this.winner = this.game[this.gameId].players[1];
                }
            } else {
                this.winner = null;
            }

            if(this.game[this.gameId].moves === 9 && !this.winner) {
                this.draw = true;
            }
        });
    }

    ngOnDestroy(): void {
        this._gameSub.unsubscribe();
    }

    setPlayerName(event: any): void {
        console.log(event);
        if(this.game[this.gameId].players.includes(event.target.value)) {
            console.log('PLAYER NAME ALREADY TAKEN');
        }
        this.currentPlayerName = event.target.value;
    }

    joinGame(): void {
        if(this.game[this.gameId].players.includes(this.currentPlayerName)) {
            console.log('PLAYER NAME ALREADY TAKEN');
            return;
        }

        if (this.currentPlayerName) {
            this.gameService.joinGame(this.gameId, this.currentPlayerName);
        }
    }

    playGame(x: number, y: number): void {
        this.gameService.playGame(this.gameId, this.currentPlayerName, x, y);
    }

    checkStateForWin(state: any): any {
        // send pos where win was found
        if (state[0][0]!==0 && state[0][0]===state[0][1] && state[0][1]===state[0][2]) {
            return [0, 0];
        }
        if (state[1][0]!==0 && state[1][0]===state[1][1] && state[1][1]===state[1][2]) {
            return [1, 0];
        }
        if (state[2][0]!==0 && state[2][0]===state[2][1] && state[2][1]===state[2][2]) {
            return [2, 0];
        }
        if (state[0][0]!==0 && state[0][0]===state[1][0] && state[1][0]===state[2][0]) {
            return [0, 0];
        }
        if (state[0][1]!==0 && state[0][1]===state[1][1] && state[1][1]===state[2][1]) {
            return [0, 1];
        }
        if (state[0][2]!==0 && state[0][2]===state[1][2] && state[1][2]===state[2][2]) {
            return [0, 2];
        }
        if (state[0][0]!==0 && state[0][0]===state[1][1] && state[1][1]===state[2][2]) {
            return [0, 0];
        }
        if (state[0][2]!==0 && state[0][2]===state[1][1] && state[1][1]===state[2][0]) {
            return [0, 2];
        }
        return null;
    }
}
