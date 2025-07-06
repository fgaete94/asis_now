import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteFinalTurnoPage } from './reporte-final-turno.page';

const routes: Routes = [
  {
    path: '',
    component: ReporteFinalTurnoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteFinalTurnoPageRoutingModule {}
