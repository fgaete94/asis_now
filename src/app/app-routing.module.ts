import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/auth/sing-up/sign-up.module').then(m => m.SignUpPageModule)
  
  },
    {
    path: 'reg-entrada',
    loadChildren: () => import('./pages/reg_entrada/reg-entrada/reg-entrada.module').then( m => m.RegEntradaPageModule)
  },

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },

 



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
