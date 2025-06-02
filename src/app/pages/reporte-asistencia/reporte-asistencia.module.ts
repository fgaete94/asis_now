import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReporteAsistenciaPageRoutingModule } from './reporte-asistencia-routing.module';

import { ReporteAsistenciaPage } from './reporte-asistencia.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReporteAsistenciaPageRoutingModule,
    SharedModule,
  ],
  declarations: [ReporteAsistenciaPage]
})
export class ReporteAsistenciaPageModule {}
