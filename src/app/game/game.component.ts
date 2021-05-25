import {Component, OnInit, OnDestroy} from '@angular/core';
import {GameService} from '../game.service';
import {HotToastService} from '@ngneat/hot-toast';
import {BaseComponent} from "../base-component";
import {filter, takeUntil} from "rxjs/operators";
import {NoughtOrCrossPipe} from "../nought-or-cross.pipe";

declare global {
    interface Window {
        confetti: any;
    }
}

export interface Game {
    [key: string]: {
        players: Array<string>;
        state: GameState;
        turn: string | null;
        moves: number;
        winner: string;
        draw: boolean;
    }
}

export type GameState = Array<Array<number>>

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})

export class GameComponent extends BaseComponent implements OnInit, OnDestroy {
    game!: Game;
    gameId!: string;
    currentPlayerName: string = '';
    toastRef: any;

    constructor(
        private gameService: GameService,
        private toast: HotToastService,
        private noughtOrCrossPipe: NoughtOrCrossPipe,
        private window: Window
    ) {
        super();
    }

    public ngOnInit(): void {
        this.gameService.currentGame$
            .pipe(
                takeUntil(this.destroyer$),
                filter((game) => game[Object.keys(game)[0]].players.length===1),
                // tap((game: Game) => {
                //     console.log('***** game', game[Object.keys(game)[0]].players);
                // }),
            )
            .subscribe((_game: Game) => {
                const self = _game[Object.keys(_game)[0]].players.includes(this.currentPlayerName);
                const msg = self ? 'Waiting for other player':'Waiting for you to join the game';
                this.toastRef = this.toast.loading(msg, {
                    dismissible: true,
                    duration: 9999999999
                });
            });

        this.gameService.currentGame$
            .pipe(
                takeUntil(this.destroyer$),
                filter((game) => game[Object.keys(game)[0]].players.length===2),
                filter((game) => game[Object.keys(game)[0]].moves===0),
                // tap((game: Game) => {
                //     console.log('***** game', game[Object.keys(game)[0]].players);
                // }),
            )
            .subscribe((game: Game) => {
                this.toastRef.close();
                this.toast.success(`Game ready set go!`);
            });

        this.gameService.currentGame$.pipe(
            takeUntil(this.destroyer$)
        ).subscribe(game => {
            console.log('***** currentGame$', game);
            this.game = game;
            this.gameId = Object.keys(game)[0];

            if (this.game[this.gameId].winner) {
                if (this.game[this.gameId].players.includes(this.currentPlayerName)) {
                    if (this.game[this.gameId].winner===this.currentPlayerName) {
                        this.blastConfetti(7);
                        this.toast.success(
                            `You win!`,
                            {
                                icon: '🎉',
                            }
                        )
                    } else {
                        this.toast.success(
                            `You loose!`,
                            {
                                icon: '🥲',
                            }
                        )
                    }
                } else {
                    this.toast.success(
                        `Player <strong>${this.game[this.gameId].winner}</strong> wins!`,
                        {
                            icon: '🎉',
                        }
                    )

                }
            }

            if (this.game[this.gameId].draw) {
                this.toast.success(`It's a draw!`, {icon: '🤨'})
            }
        });
    }

    setPlayerName(event: any): void {
        // console.log(event);

        if (this.game[this.gameId].players.includes(event.target.value)) {
            // console.log('PLAYER NAME ALREADY TAKEN');
            return;
        }
        localStorage.setItem('playerName', event.target.value);
        this.currentPlayerName = event.target.value;
    }

    joinGame(): void {
        if (this.game[this.gameId].players.includes(this.currentPlayerName)) {
            // console.log('PLAYER NAME ALREADY TAKEN');
            return;
        }

        if (this.currentPlayerName) {
            this.gameService.joinGame(this.gameId, this.currentPlayerName);
            this.toast.success(`Player <strong>${this.currentPlayerName}</strong> joined game ${this.gameId}`);
        }
    }

    playGame(x: number, y: number): void {
        this.gameService.playGame(this.gameId, this.currentPlayerName, x, y);
        const icon = this.noughtOrCrossPipe.transform(this.game[this.gameId].players.indexOf(this.currentPlayerName));
        this.toast.show(`Plays @ ${x},${y}`, {
            icon: icon
        });
    }

    public blastConfetti(times: number) {
        const config = {
            gravity: 1,
            drift: 0,
            particleCount: 150,
            startVelocity: 30,
            spread: 360,
            shapes: ['circle']
        }

        let i = 1;
        const confettiLoop = () => {
            setTimeout(() => {
                this.window.confetti({...config,
                    origin: {
                        x: Math.random(),
                        y: Math.random() - 0.3
                    }
                });
                i++;
                if (i < times) {
                    confettiLoop();
                }
            }, 150)
        }
        confettiLoop();
    }

}
