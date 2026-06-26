import { Routes } from '@angular/router';
import { Home } from './component/home/home';
import { Actualidad } from './component/actualidad/actualidad';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: Home},
    {path: 'actualidad', component: Actualidad}
];
