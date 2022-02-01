import {Injectable} from '@angular/core';
import {catchError} from "rxjs/operators";

export interface Sounds {
    connect: HTMLAudioElement;
    disconnect: HTMLAudioElement;
    knock: HTMLAudioElement;
    ready: HTMLAudioElement;
    win: HTMLAudioElement;
    loose: HTMLAudioElement;
    draw: HTMLAudioElement;
    create: HTMLAudioElement;
    playCross: HTMLAudioElement;
    playNought: HTMLAudioElement;
}

export type SoundNames = 'connect' | 'disconnect' | 'knock' | 'win' | 'loose'
    | 'create' | 'playCross' | 'playNought' | 'draw' | 'ready';

@Injectable({
    providedIn: 'root'
})
export class SoundService {
    // sounds: Sounds;
    soundFx: HTMLAudioElement = new Audio();
    soundFxNames = {
        connect: './assets/sounds/connect.mp3',
        disconnect: './assets/sounds/disconnect.mp3',
        knock: './assets/sounds/knock.mp3',
        ready: './assets/sounds/ready.mp3',
        win: './assets/sounds/win.mp3',
        loose: './assets/sounds/loose.mp3',
        draw: './assets/sounds/draw.mp3',
        create: './assets/sounds/create.mp3',
        playCross: './assets/sounds/playCross.mp3',
        playNought: './assets/sounds/playNought.mp3',

    }
    constructor() {
        // this.sounds = {
        //     connect: new Audio('./assets/sounds/connect.mp3'),
        //     disconnect: new Audio('./assets/sounds/disconnect.mp3'),
        //     knock: new Audio('./assets/sounds/knock.mp3'),
        //     ready: new Audio('./assets/sounds/ready.mp3'),
        //     win: new Audio('./assets/sounds/win.mp3'),
        //     loose: new Audio('./assets/sounds/loose.mp3'),
        //     draw: new Audio('./assets/sounds/draw.mp3'),
        //     create: new Audio('./assets/sounds/create.mp3'),
        //     playCross: new Audio('./assets/sounds/playCross.mp3'),
        //     playNought: new Audio('./assets/sounds/playNought.mp3'),
        // }
    }

    playSound(soundName: SoundNames) {
        // this.soundFx.src = this.soundFxNames[soundName];
        // this.soundFx.play().then(() => {
        //     console.log(`soundFx ${soundName} played!`);
        // }).catch((err)=> {
        //     console.log('err', err);
        // });
        // // this.sounds[soundName].play().then(() => {
        // //     console.log(`sound ${soundName} played!`);
        // // });
    }
}
