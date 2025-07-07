import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReporteSupervisorPage } from './reporte-supervisor.page';
import { EstacionesServiceService } from 'src/app/services/estaciones/estaciones-service.service';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ReporteSupervisorPage', () => {
  let component: ReporteSupervisorPage;
  let fixture: ComponentFixture<ReporteSupervisorPage>;
  let estacionesServiceSpy: jasmine.SpyObj<EstacionesServiceService>;
  let reportesServiceSpy: jasmine.SpyObj<ReportesService>;
  let authServiceSpy: jasmine.SpyObj<AuthServiceService>;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    estacionesServiceSpy = jasmine.createSpyObj('EstacionesServiceService', ['getBaseUrlInfo']);
    reportesServiceSpy = jasmine.createSpyObj('ReportesService', ['enviarReporte']);
    authServiceSpy = jasmine.createSpyObj('AuthServiceService', ['getDecryptedUserData']);
    toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ReporteSupervisorPage],
      providers: [
        { provide: EstacionesServiceService, useValue: estacionesServiceSpy },
        { provide: ReportesService, useValue: reportesServiceSpy },
        { provide: AuthServiceService, useValue: authServiceSpy },
        { provide: ToastController, useValue: toastCtrlSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteSupervisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar estaciones en ngOnInit', () => {
    const mockEstaciones = [{ nombre: 'Est1' }, { nombre: 'Est2' }];
    estacionesServiceSpy.getBaseUrlInfo.and.returnValue(of(mockEstaciones));
    component.ngOnInit();
    expect(component.estaciones).toEqual(mockEstaciones);
  });

  it('debería manejar error al cargar estaciones', () => {
    estacionesServiceSpy.getBaseUrlInfo.and.returnValue(throwError(() => new Error('error')));
    component.ngOnInit();
    expect(component.estaciones).toEqual([]);
  });

  it('no debería enviar reporte si faltan campos', fakeAsync(() => {
    spyOn(component, 'mostrarToast').and.returnValue(Promise.resolve());
    component.estacionSeleccionada = '';
    component.descripcion = '';
    component.enviarReporte();
    expect(component.mostrarToast).toHaveBeenCalledWith('Debes seleccionar una estación y escribir una descripción.');
  }));

  it('debería enviar reporte correctamente', fakeAsync(async () => {
    component.estacionSeleccionada = 'Est1';
    component.descripcion = 'Texto de prueba';
    authServiceSpy.getDecryptedUserData.and.returnValue(Promise.resolve({ user: 'felipe' }));
    reportesServiceSpy.enviarReporte.and.returnValue(of({}));
    spyOn(component, 'mostrarToast').and.returnValue(Promise.resolve());

    await component.enviarReporte();
    tick();

    expect(reportesServiceSpy.enviarReporte).toHaveBeenCalledWith({
      usuario: 'felipe',
      estacion: 'Est1',
      descripcion: 'Texto de prueba',
      imagenUrl: '',
    });
    expect(component.mostrarToast).toHaveBeenCalledWith('Reporte enviado correctamente');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('debería mostrar error si falla el envío del reporte', fakeAsync(async () => {
    component.estacionSeleccionada = 'Est1';
    component.descripcion = 'Texto de prueba';
    authServiceSpy.getDecryptedUserData.and.returnValue(Promise.resolve({ user: 'felipe' }));
    reportesServiceSpy.enviarReporte.and.returnValue(throwError(() => new Error('error')));
    spyOn(component, 'mostrarToast').and.returnValue(Promise.resolve());

    await component.enviarReporte();
    tick();

    expect(component.mostrarToast).toHaveBeenCalledWith('Error al enviar el reporte');
  }));

  it('debería navegar a home al cancelar', () => {
    component.cancelar();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería mostrar un toast', async () => {
    const toastSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve(toastSpy));
    await component.mostrarToast('Mensaje');
    expect(toastCtrlSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({ message: 'Mensaje' }));
    expect(toastSpy.present).toHaveBeenCalled();
  });
});
