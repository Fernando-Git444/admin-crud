import { Routes } from '@angular/router';
import { AdministradoresComponent } from './administradores/administradores';

export const routes: Routes = [
  { path: '', redirectTo: '/administradores', pathMatch: 'full' },
  { path: 'administradores', component: AdministradoresComponent }
];