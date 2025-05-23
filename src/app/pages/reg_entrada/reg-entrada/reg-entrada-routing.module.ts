import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegEntradaPage } from './reg-entrada.page';

const routes: Routes = [
  {
    path: '',
    component: RegEntradaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegEntradaPageRoutingModule {}
