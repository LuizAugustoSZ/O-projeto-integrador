import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login-user',
    pathMatch: 'full',
  },
  {
    path: 'login-user',
    loadComponent: () => import('./login-user/login-user.page').then( m => m.LoginUserPage)
  },
  {
    path: 'register-user',
    loadComponent: () => import('./register-user/register-user.page').then( m => m.RegisterUserPage)
  },
  {
    path: 'register-product',
    loadComponent: () => import('./register-product/register-product.page').then( m => m.RegisterProductPage)
  },
  {
    path: 'little-car',
    loadComponent: () => import('./little-car/little-car.page').then(m => m.LittleCarPage)
  },
  {
    path: 'product-page',
    loadComponent: () => import('./product-page/product-page.page').then( m => m.ProductPage)
  },
  {
      path: 'product-page/:id',
    loadComponent: () => import('./product-page/product-page.page').then(m => m.ProductPage)
  },
  {
      path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'payment',
  loadComponent: () => import('./payment/payment.page').then( m => m.PaymentPage)
},
  
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }


];

