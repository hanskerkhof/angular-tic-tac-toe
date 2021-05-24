import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {GameService} from '../game.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-game-list',
    templateUrl: './game-list.component.html',
    styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit, OnDestroy {
    games$!: Observable<string[]>;
    currentGameId: string = '';
    _gameSub!: Subscription;
    public environment = environment;


    constructor(private gameService: GameService) {
        this.games$ = this.gameService.games$;
    }

    ngOnInit(): void {
        this._gameSub = this.gameService.currentGame$.subscribe(game => {
            // console.log('currentGame', game);
            this.currentGameId = Object.keys(game)[0];
        });

        this.gameService.games$.subscribe( games => {
            console.log(games);
        })
    }

    ngOnDestroy(): void {
        this._gameSub.unsubscribe();
    }

    newGame(): void {
        this.gameService.newGame();
    }

    loadGame(gameId: string): void {
        this.gameService.getGame(gameId);
    }

}
