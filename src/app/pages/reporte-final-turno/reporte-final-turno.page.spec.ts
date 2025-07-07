import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteFinalTurnoPage } from './reporte-final-turno.page';
import { AsistenciaService } from 'src/app/services/asistencia/asistencia.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ReporteFinalTurnoPage', () => {
  let component: ReporteFinalTurnoPage;
  let fixture: ComponentFixture<ReporteFinalTurnoPage>;
  let asistenciaServiceSpy: jasmine.SpyObj<AsistenciaService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    asistenciaServiceSpy = jasmine.createSpyObj('AsistenciaService', ['obtenerAsistenciasTurnoActual']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ReporteFinalTurnoPage],
      providers: [
        { provide: AsistenciaService, useValue: asistenciaServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteFinalTurnoPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar asistencias correctamente', () => {
    const mockData = [
      { usuario: 'user1', entrada: '2024-07-06T08:00:00', salida: '2024-07-06T16:00:00', estacion: 'Estación 1' }
    ];
    asistenciaServiceSpy.obtenerAsistenciasTurnoActual.and.returnValue(of(mockData));
    component.cargarAsistencias();
    expect(component.cargando).toBeFalse();
    expect(component.asistencias).toEqual(mockData);
  });

  it('debe manejar error al cargar asistencias', () => {
    asistenciaServiceSpy.obtenerAsistenciasTurnoActual.and.returnValue(throwError(() => new Error('error')));
    component.cargarAsistencias();
    expect(component.cargando).toBeFalse();
    expect(component.asistencias).toEqual([]);
  });

  it('debe navegar a home al cancelar', () => {
    component.cancelar();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debe llamar a autoTable y guardar PDF al generarPDF', () => {
    // Espía jsPDF y autoTable
    const saveSpy = jasmine.createSpy('save');
    const textSpy = jasmine.createSpy('text');
    const jsPDFSpy = function () {
      return { text: textSpy, save: saveSpy };
    } as any;
    const autoTableSpy = jasmine.createSpy('autoTable');

    // Reemplaza los imports globales temporalmente
    (window as any).jsPDF = jsPDFSpy;
    (window as any).autoTable = autoTableSpy;

    component.asistencias = [
      { usuario: 'user1', entrada: new Date(), salida: new Date(), estacion: 'Estación 1' }
    ];

    // Llama al método
    component.generarPDF();

    expect(textSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
    expect(autoTableSpy).toHaveBeenCalled();
  });
});
