import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ReporteSupervisorPage } from './reporte-supervisor.page';
import { EstacionesServiceService } from 'src/app/services/estaciones/estaciones-service.service';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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

    const toastElementSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    // Mock para ToastController.create que retorna un objeto con present()
    toastCtrlSpy.create.and.returnValue(Promise.resolve(toastElementSpy));

    await TestBed.configureTestingModule({
      declarations: [ReporteSupervisorPage],
      providers: [
        { provide: EstacionesServiceService, useValue: estacionesServiceSpy },
        { provide: ReportesService, useValue: reportesServiceSpy },
        { provide: AuthServiceService, useValue: authServiceSpy },
        { provide: ToastController, useValue: toastCtrlSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteSupervisorPage);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar estaciones en ngOnInit', () => {
    const estacionesMock = [{ nombre: 'A' }, { nombre: 'B' }];
    estacionesServiceSpy.getBaseUrlInfo.and.returnValue(of(estacionesMock));
    component.ngOnInit();
    expect(component.estaciones).toEqual(estacionesMock);
  });

  it('debería manejar error al cargar estaciones', () => {
    estacionesServiceSpy.getBaseUrlInfo.and.returnValue(throwError(() => new Error('error')));
    component.ngOnInit();
    expect(component.estaciones).toEqual([]);
  });

  it('no debería enviar reporte si faltan campos', fakeAsync(() => {
    spyOn(component, 'mostrarToast').and.callThrough();
    component.estacionSeleccionada = '';
    component.descripcion = '';
    component.enviarReporte();
    tick();
    expect(component.mostrarToast).toHaveBeenCalledWith('Debes seleccionar una estación y escribir una descripción.');
    expect(reportesServiceSpy.enviarReporte).not.toHaveBeenCalled();
    flush();
  }));

  it('debería mostrar error si falla el envío del reporte', fakeAsync(() => {
    component.estacionSeleccionada = 'A';
    component.descripcion = 'desc';
    authServiceSpy.getDecryptedUserData.and.returnValue(Promise.resolve({ user: 'supervisor' }));
    reportesServiceSpy.enviarReporte.and.returnValue(throwError(() => new Error('error')));
    spyOn(component, 'mostrarToast').and.callThrough();

    component.enviarReporte();
    tick(); // Espera la promesa de getDecryptedUserData
    tick(); // Espera el observable de enviarReporte
    expect(component.mostrarToast).toHaveBeenCalledWith('Error al enviar el reporte');
    expect(component.cargando).toBeFalse();
    flush();
  }));

  it('debería enviar reporte correctamente', fakeAsync(() => {
    component.estacionSeleccionada = 'A';
    component.descripcion = 'desc';
    authServiceSpy.getDecryptedUserData.and.returnValue(Promise.resolve({ user: 'supervisor' }));
    reportesServiceSpy.enviarReporte.and.returnValue(of({}));
    spyOn(component, 'mostrarToast').and.callThrough();

    component.enviarReporte();
    tick(); // Espera la promesa de getDecryptedUserData
    tick(); // Espera el observable de enviarReporte
    expect(component.mostrarToast).toHaveBeenCalledWith('Reporte enviado correctamente');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    expect(component.cargando).toBeFalse();
    flush();
  }));

  it('debería mostrar un toast', fakeAsync(async () => {
    await component.mostrarToast('Mensaje');
    expect(toastCtrlSpy.create).toHaveBeenCalledWith({
      message: 'Mensaje',
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
  }));

  it('debería navegar a home al cancelar', () => {
    component.cancelar();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });
});
