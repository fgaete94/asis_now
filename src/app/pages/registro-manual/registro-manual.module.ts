import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroManualPageRoutingModule } from './registro-manual-routing.module';

import { RegistroManualPage } from './registro-manual.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroManualPageRoutingModule,
    SharedModule,
  ],
  declarations: [RegistroManualPage]
})
export class RegistroManualPageModule {}
