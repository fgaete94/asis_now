import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteSupervisorPage } from './reporte-supervisor.page';

describe('ReporteSupervisorPage', () => {
  let component: ReporteSupervisorPage;
  let fixture: ComponentFixture<ReporteSupervisorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteSupervisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
