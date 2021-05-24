import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameListComponent } from './game-list/game-list.component';
import { GameComponent } from './game/game.component';

import { environment } from "../environments/environment";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotToastModule } from '@ngneat/hot-toast';
import { NoughtOrCrossPipe } from './nought-or-cross.pipe';

const config: SocketIoConfig = { url: environment.SOCKET_ENDPOINT, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    GameListComponent,
    GameComponent,
    NoughtOrCrossPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    HotToastModule.forRoot({
      position: 'bottom-left',
      duration: 3000,
      reverseOrder: true,
    }),
  ],
  providers: [NoughtOrCrossPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
