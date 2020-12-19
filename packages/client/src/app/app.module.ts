import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from './app-routing.module';
import { LandingComponent } from './landing/landing.component';
import { LobbyComponent } from './lobby/lobby.component';
import { WebcamComponent } from './webcam/webcam.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './_interceptors/auth.interceptor';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {WebcamModule} from 'ngx-webcam';
import { ChatComponent } from './chat/chat.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { VideoComponent } from './video/video.component';
import { RoundPrepareComponent } from './round-prepare/round-prepare.component';
import { RoundComponent } from './round/round.component';
import { PlayersComponent } from './players/players.component';
import {YouTubePlayerModule} from '@angular/youtube-player';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LibraryComponent } from './library/library.component';

const config: SocketIoConfig = { url: '/notification', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    HomeComponent,
    LandingComponent,
    LobbyComponent,
    WebcamComponent,
    ChatComponent,
    VideoComponent,
    RoundPrepareComponent,
    RoundComponent,
    PlayersComponent,
    LibraryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    WebcamModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    YouTubePlayerModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  providers: [    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
