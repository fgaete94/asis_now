import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReporteFinalTurnoPageRoutingModule } from './reporte-final-turno-routing.module';

import { ReporteFinalTurnoPage } from './reporte-final-turno.page';
import { share } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReporteFinalTurnoPageRoutingModule,
    SharedModule,
  ],
  declarations: [ReporteFinalTurnoPage]
})
export class ReporteFinalTurnoPageModule {}
