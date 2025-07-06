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
    path: 'cambiar-rol',
    loadChildren: () => import('./pages/cambiar-rol/cambiar-rol.module').then( m => m.CambiarRolPageModule)
  },
  {
    path: 'reporte-asistencia',
    loadChildren: () => import('./pages/reporte-asistencia/reporte-asistencia.module').then( m => m.ReporteAsistenciaPageModule)
  },
  {
    path: 'registro-manual',
    loadChildren: () => import('./pages/registro-manual/registro-manual.module').then( m => m.RegistroManualPageModule)
  },
  {
    path: 'reporte-supervisor',
    loadChildren: () => import('./pages/reporte-supervisor/reporte-supervisor.module').then( m => m.ReporteSupervisorPageModule)
  },
  {
    path: 'reporte-incidentes',
    loadChildren: () => import('./pages/reporte-incidentes/reporte-incidentes.module').then( m => m.ReporteIncidentesPageModule)
  },
    {
    path: 'reporte-final-turno',
    loadChildren: () => import('./pages/reporte-final-turno/reporte-final-turno.module').then( m => m.ReporteFinalTurnoPageModule)
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
