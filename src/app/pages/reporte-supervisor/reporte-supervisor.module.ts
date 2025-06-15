import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReporteSupervisorPageRoutingModule } from './reporte-supervisor-routing.module';

import { ReporteSupervisorPage } from './reporte-supervisor.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReporteSupervisorPageRoutingModule,
    SharedModule
  ],
  declarations: [ReporteSupervisorPage]
})
export class ReporteSupervisorPageModule {}
