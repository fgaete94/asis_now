import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteIncidentesPage } from './reporte-incidentes.page';

const routes: Routes = [
  {
    path: '',
    component: ReporteIncidentesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteIncidentesPageRoutingModule {}
