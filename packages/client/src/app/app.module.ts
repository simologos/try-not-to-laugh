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
import {FormsModule} from '@angular/forms';
import { VideoComponent } from './video/video.component';

const config: SocketIoConfig = { url: 'http://localhost:8000/notification', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    HomeComponent,
    LandingComponent,
    LobbyComponent,
    WebcamComponent,
    ChatComponent,
    VideoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    WebcamModule,
    SocketIoModule.forRoot(config),
    FormsModule,
  ],
  providers: [    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
