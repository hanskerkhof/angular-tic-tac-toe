import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {GameService} from '../game.service';
import {HotToastService} from "@ngneat/hot-toast";
import {takeUntil} from "rxjs/operators";
import {BaseComponent} from "../base-component";

@Component({
    selector: 'app-game-list',
    templateUrl: './game-list.component.html',
    styleUrls: ['./game-list.component.scss']
})
export class GameListComponent extends BaseComponent implements OnInit, OnDestroy {
    games$!: Observable<string[]>;
    currentGameId: string = '';


    constructor(
        private gameService: GameService,
        private toast: HotToastService
    ) {
        super();
        this.games$ = this.gameService.games$;
    }

    ngOnInit(): void {
        this.gameService.currentGame$.pipe(takeUntil(this.destroyer$))
            .subscribe(game => {
            this.currentGameId = Object.keys(game)[0];
        });
    }

    newGame(): void {
        this.gameService.newGame();
        this.toast.success('Game created');
    }

    loadGame(gameId: string): void {
        this.gameService.getGame(gameId);
    }

}
