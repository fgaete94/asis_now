import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiarRolPage } from './cambiar-rol.page';

const routes: Routes = [
  {
    path: '',
    component: CambiarRolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiarRolPageRoutingModule {}
