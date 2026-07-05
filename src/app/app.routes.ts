import { Routes } from '@angular/router';
import { Home } from './component/home/home';
import { Actualidad } from './component/actualidad/actualidad';
import { Calendario } from './component/calendario/calendario';
import { Infobanda } from './component/infobanda/infobanda';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: Home},
    {path: 'actualidad', component: Actualidad},
    {path: 'calendario', component: Calendario},
    {path: 'infobanda', component: Infobanda}
];
