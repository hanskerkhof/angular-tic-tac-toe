import {Component} from '@angular/core';
import {GameService} from "./game.service";
import {HotToastService} from "@ngneat/hot-toast";
import {BaseComponent} from "./base-component";
import {takeUntil} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {SoundService} from "./sound.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent {
    title = 'angular-tic-tac-toe';
    connected = false;
    environment = environment;

    constructor(
        private gameService: GameService,
        private toast: HotToastService,
        private sound: SoundService,
    ) {
        super();
        this.gameService.disconnected$.pipe(
            takeUntil(this.destroyer$)
        ).subscribe((res) => {
            // console.log(res);
            this.sound.playSound('disconnect');
            this.connected = false;
            this.toast.error('Socket disconnected', { icon: '💔'});

        })

        this.gameService.connect$.pipe(
            takeUntil(this.destroyer$)
        ).subscribe(() => {
            this.connected = true;
            this.sound.playSound('connect');
            this.toast.success('Socket connected', {icon: '🖖'});
        })

    }
}
