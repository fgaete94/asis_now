import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteIncidentesPage } from './reporte-incidentes.page';

describe('ReporteIncidentesPage', () => {
  let component: ReporteIncidentesPage;
  let fixture: ComponentFixture<ReporteIncidentesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteIncidentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
