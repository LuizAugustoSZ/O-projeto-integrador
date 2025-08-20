import { Routes } from '@angular/router';
import { LoginUserPage } from './login-user/login-user.page';
import { RegisterUserPage } from './register-user/register-user.page';

export const routes: Routes = [
  { path: '', redirectTo: 'login-user', pathMatch: 'full' },
  { path: 'login-user', component: LoginUserPage },
  { path: 'register-user', component: RegisterUserPage },
  { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage) }
];
