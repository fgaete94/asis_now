import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteAsistenciaPage } from './reporte-asistencia.page';

describe('ReporteAsistenciaPage', () => {
  let component: ReporteAsistenciaPage;
  let fixture: ComponentFixture<ReporteAsistenciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteAsistenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
