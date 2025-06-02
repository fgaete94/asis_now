import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteAsistenciaPage } from './reporte-asistencia.page';

const routes: Routes = [
  {
    path: '',
    component: ReporteAsistenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteAsistenciaPageRoutingModule {}
