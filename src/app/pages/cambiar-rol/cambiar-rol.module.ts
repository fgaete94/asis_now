import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiarRolPageRoutingModule } from './cambiar-rol-routing.module';

import { CambiarRolPage } from './cambiar-rol.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambiarRolPageRoutingModule
  ],
  declarations: [CambiarRolPage]
})
export class CambiarRolPageModule {}
