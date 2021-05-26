import {Component, OnInit, OnDestroy} from '@angular/core';
import {GameService} from '../game.service';
import {HotToastService} from '@ngneat/hot-toast';
import {BaseComponent} from "../base-component";
import {filter, takeUntil} from "rxjs/operators";
import {NoughtOrCrossPipe} from "../nought-or-cross.pipe";
import {SoundService} from "../sound.service";

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
        played: number;
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

    constructor(
        private gameService: GameService,
        private toast: HotToastService,
        private noughtOrCrossPipe: NoughtOrCrossPipe,
        private window: Window,
        private sound: SoundService,
    ) {
        super();
    }


    public ngOnInit(): void {
        this.gameService.reset$.subscribe(() => {
            // console.log('***** reset!!');
            this.toast.show(`Games reset`, {
                icon: '💁🏻‍',
                position: 'top-left',
                duration: 1000
            });
            this.gameId = '';
            this.gameService.cancelLoadingToast();
        });

        this.gameService.currentGame$
            .pipe(
                takeUntil(this.destroyer$),
                filter((game) => game[Object.keys(game)[0]]),
                filter((game) => game[Object.keys(game)[0]].players.length===1),
                // tap((game: Game) => {
                //     console.log('***** game', game[Object.keys(game)[0]]);
                // }),
            )
            .subscribe((_game: Game) => {
                const self = _game[Object.keys(_game)[0]].players.includes(this.currentPlayerName);

                if (!self) {
                    this.toast.success(`Player <strong>${_game[Object.keys(_game)[0]].players}</strong> started a new game ${Object.keys(_game)[0]}`);
                }

                // if (!self) {
                this.sound.playSound('knock');
                // }
                const msg = self ? 'Waiting for other player':'Waiting for you to join the game';
                this.gameService.showLoadingToast(msg);
            });

        this.gameService.currentGame$
            .pipe(
                takeUntil(this.destroyer$),
                filter((game) => game[Object.keys(game)[0]]),
                filter((game) => game[Object.keys(game)[0]].players.length===2),
                filter((game) => game[Object.keys(game)[0]].moves===0),
                // tap((game: Game) => {
                //     console.log('***** game', game[Object.keys(game)[0]].players);
                // }),
            )
            .subscribe((game: Game) => {
                if (this.game[this.gameId].players.indexOf(this.currentPlayerName)===0) {
                    this.toast.success(`Player <strong>${game[Object.keys(game)[0]].players[1]}</strong> joined game ${this.gameId}`);
                }

                this.gameService.cancelLoadingToast();
                this.sound.playSound('ready');
                this.toast.success(`Game ready set go!`);
            });

        this.gameService.currentGame$.pipe(
            takeUntil(this.destroyer$),
            filter((game) => game[Object.keys(game)[0]]),
            // tap((game: Game) => {
            //     console.log('***** game', game[Object.keys(game)[0]]);
            // }),
        ).subscribe(game => {
            // console.log('***** currentGame$', game);
            this.game = game;
            this.gameId = Object.keys(game)[0];

            const self = game[Object.keys(game)[0]].players.includes(this.currentPlayerName);

            if (self) {
                if (this.game[this.gameId].played=== -1) {
                    this.sound.playSound('playCross');
                } else if (this.game[this.gameId].played===1) {
                    this.sound.playSound('playNought');
                }
            }

            setTimeout(() => {
                if (this.game[this.gameId].winner) {
                    if (this.game[this.gameId].players.includes(this.currentPlayerName)) {
                        if (this.game[this.gameId].winner===this.currentPlayerName) {
                            this.sound.playSound('win');
                            this.blastConfetti(7);
                            this.toast.success(
                                `You win!`,
                                {
                                    icon: '🎉',
                                }
                            )
                        } else {
                            this.sound.playSound('loose');
                            this.toast.success(
                                `You loose!`,
                                {
                                    icon: '🥲',
                                }
                            )
                        }
                    } else {
                        // this.sound.playSound('win');
                        this.toast.success(
                            `Player <strong>${this.game[this.gameId].winner}</strong> wins!`,
                            {
                                icon: '🎉',
                            }
                        )

                    }
                }
            }, 600);

            if (this.game[this.gameId].draw) {
                this.sound.playSound('draw');
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
        // localStorage.setItem('playerName', event.target.value);
        this.currentPlayerName = event.target.value;
    }

    joinGame(): void {
        if (this.game[this.gameId].players.includes(this.currentPlayerName)) {
            // console.log('PLAYER NAME ALREADY TAKEN');
            return;
        }

        if (this.currentPlayerName) {
            this.gameService.joinGame(this.gameId, this.currentPlayerName);
            // this.toast.success(`Player <strong>${this.currentPlayerName}</strong> joined game ${this.gameId}`);
        }
    }

    playGame(x: number, y: number): void {
        setTimeout(() => {
            this.gameService.playGame(this.gameId, this.currentPlayerName, x, y);
            if (this.game[this.gameId].players.indexOf(this.currentPlayerName)===0) {
                this.sound.playSound('playNought');
            } else {
                this.sound.playSound('playCross');
            }
        }, 300);
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
                this.window.confetti({
                    ...config,
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
