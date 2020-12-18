import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GameComponent} from './game/game.component';
import {HomeComponent} from './home/home.component';
import {LandingComponent} from './landing/landing.component';
import {LobbyComponent} from './lobby/lobby.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'game/:id', component: GameComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'lobby/:id', component: LobbyComponent },
  { path: '', component: LandingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
