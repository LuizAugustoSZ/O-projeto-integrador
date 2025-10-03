import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'little-car',
        loadComponent: () => import('./little-car/little-car.page').then(m => m.LittleCarPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: 'search-results',
        loadComponent: () => import('./search-results/search-results.page').then(m => m.SearchResultsPage)
      },
      {
        path: 'product-page/:id',
        loadComponent: () => import('./product-page/product-page.page').then(m => m.ProductPage)
      },
      {

        path: 'category-page/:id',
        loadComponent: () => import('./category-page/category-page.page').then(m => m.CategoryPage)
      },
      {
        path: 'more',
        loadComponent: () => import('./more/more.page').then( m => m.MorePage)
      },
      {
        path: 'register-product',
        loadComponent: () => import('./register-product/register-product.page').then(m => m.RegisterProductPage)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'login-user',
    loadComponent: () => import('./login-user/login-user.page').then(m => m.LoginUserPage)
  },
  {
    path: 'register-user',
    loadComponent: () => import('./register-user/register-user.page').then(m => m.RegisterUserPage)
  },
  {
    path: 'payment',
    loadComponent: () => import('./payment/payment.page').then(m => m.PaymentPage)
  },
  {
    path: '**',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  },

];