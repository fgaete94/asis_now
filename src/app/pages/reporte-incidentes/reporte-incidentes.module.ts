import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReporteIncidentesPageRoutingModule } from './reporte-incidentes-routing.module';

import { ReporteIncidentesPage } from './reporte-incidentes.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReporteIncidentesPageRoutingModule,
    SharedModule
  ],
  declarations: [ReporteIncidentesPage]
})
export class ReporteIncidentesPageModule {}
