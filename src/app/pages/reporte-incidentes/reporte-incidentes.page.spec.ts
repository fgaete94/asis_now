import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteIncidentesPage } from './reporte-incidentes.page';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ReporteIncidentesPage', () => {
  let component: ReporteIncidentesPage;
  let fixture: ComponentFixture<ReporteIncidentesPage>;
  let reportesServiceSpy: jasmine.SpyObj<ReportesService>;

  beforeEach(async () => {
    reportesServiceSpy = jasmine.createSpyObj('ReportesService', ['obtenerReportes']);

    await TestBed.configureTestingModule({
      declarations: [ReporteIncidentesPage],
      providers: [
        { provide: ReportesService, useValue: reportesServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteIncidentesPage);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar y ordenar los reportes por fecha descendente', () => {
    const mockReportes = [
      { usuario: 'a', estacion: 'X', descripcion: 'desc1', fecha: '2025-06-10T10:00:00Z' },
      { usuario: 'b', estacion: 'Y', descripcion: 'desc2', fecha: '2025-06-12T10:00:00Z' }
    ];
    reportesServiceSpy.obtenerReportes.and.returnValue(of(mockReportes));
    component.ngOnInit();
    expect(component.reportes[0].fecha).toBe('2025-06-12T10:00:00Z');
    expect(component.reportes[1].fecha).toBe('2025-06-10T10:00:00Z');
    expect(component.cargando).toBeFalse();
  });

  it('debería manejar error al cargar reportes', () => {
    reportesServiceSpy.obtenerReportes.and.returnValue(throwError(() => new Error('error')));
    component.ngOnInit();
    expect(component.reportes).toEqual([]);
    expect(component.cargando).toBeFalse();
  });
});
