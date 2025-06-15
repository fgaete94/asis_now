import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteSupervisorPage } from './reporte-supervisor.page';

const routes: Routes = [
  {
    path: '',
    component: ReporteSupervisorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteSupervisorPageRoutingModule {}
