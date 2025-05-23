import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegEntradaPageRoutingModule } from './reg-entrada-routing.module';

import { RegEntradaPage } from './reg-entrada.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegEntradaPageRoutingModule
  ],
  declarations: [RegEntradaPage]
})
export class RegEntradaPageModule {}
