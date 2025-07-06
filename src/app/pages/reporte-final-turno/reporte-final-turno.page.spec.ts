import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteFinalTurnoPage } from './reporte-final-turno.page';

describe('ReporteFinalTurnoPage', () => {
  let component: ReporteFinalTurnoPage;
  let fixture: ComponentFixture<ReporteFinalTurnoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteFinalTurnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
