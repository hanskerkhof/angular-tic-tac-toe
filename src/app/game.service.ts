import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {HotToastRefProps, HotToastService} from "@ngneat/hot-toast";

@Injectable({
    providedIn: 'root'
})
export class GameService {
    loadingToastRef!: any;

    constructor(
        private socket: Socket,
        private toast: HotToastService,
    ) {

        // this.socket.on("connection", (socket: any) => {
        //   console.log('connection', socket);
        // });
        //
        // this.socket.on("connect", (socket: any) => {
        //   console.log('connect', socket); // undefined
        // });
        //
        // this.socket.on("disconnect", (msg: any) => {
        //   console.log('disconnected', msg); // undefined
        // });
        //
        // this.socket.on("reconnection_attempt", (socket: any) => {
        //   console.log('reconnection_attempt', socket); // undefined
        // });
    }

    currentGame$ = this.socket.fromEvent<any>('game');
    games$ = this.socket.fromEvent<string[]>('games');
    reset$ = this.socket.fromEvent<string[]>('reset');
    disconnected$ = this.socket.fromEvent('disconnect');
    connect$ = this.socket.fromEvent('connect');

    clearGames(): void {
        this.socket.emit('clearGames');
    }

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
        // console.log('playGame', gameId, playerName, x, y);
        this.socket.emit('playGame', {gameId, playerName, x, y});
    }

    public cancelLoadingToast(): void {
        if (this.loadingToastRef) {
            this.loadingToastRef.close();
        }
    };

    public showLoadingToast(_msg?: any): void {
        this.cancelLoadingToast()
        this.loadingToastRef = this.toast.loading(_msg,
            {
                dismissible: true,
                duration: 9999999999
            })
    }

}
