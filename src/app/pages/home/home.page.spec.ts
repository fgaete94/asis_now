import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { Router } from '@angular/router';
import { AsistenciaService } from 'src/app/services/asistencia/asistencia.service';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { ToastController, NavController } from '@ionic/angular';
import { EstacionesServiceService } from 'src/app/services/estaciones/estaciones-service.service';
import { UbicacionService } from 'src/app/services/ubicacion-service/ubicacion-service.service';
import { of, throwError } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let asistenciaServiceSpy: jasmine.SpyObj<AsistenciaService>;
  let authServiceSpy: jasmine.SpyObj<AuthServiceService>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let estacionesServiceSpy: jasmine.SpyObj<EstacionesServiceService>;
  let ubicacionServiceSpy: jasmine.SpyObj<UbicacionService>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    asistenciaServiceSpy = jasmine.createSpyObj('AsistenciaService', ['registrarAsistencia']);
    authServiceSpy = jasmine.createSpyObj('AuthServiceService', ['getDecryptedUserData']);
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    estacionesServiceSpy = jasmine.createSpyObj('EstacionesServiceService', ['getBaseUrlInfo']);
    ubicacionServiceSpy = jasmine.createSpyObj('UbicacionService', ['enviarUbicacion']);
    navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateForward']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AsistenciaService, useValue: asistenciaServiceSpy },
        { provide: AuthServiceService, useValue: authServiceSpy },
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: EstacionesServiceService, useValue: estacionesServiceSpy },
        { provide: UbicacionService, useValue: ubicacionServiceSpy },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar estaciones correctamente', () => {
    const estaciones = [{ nombre: 'Est1', linea: 'Linea 1' }];
    estacionesServiceSpy.getBaseUrlInfo.and.returnValue(of(estaciones));
    component.obtenerEstacionesInfo();
    expect(component.estacionesInfo).toEqual(estaciones);
  });

  it('debería manejar error al cargar estaciones', () => {
    estacionesServiceSpy.getBaseUrlInfo.and.returnValue(throwError(() => new Error('error')));
    component.obtenerEstacionesInfo();
    expect(component.estacionesInfo).toEqual([]);
  });

  it('debería navegar a cambiar rol', () => {
    component.irACambiarRol();
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/cambiar-rol');
  });

  it('debería navegar a asistencia colaboradores', () => {
    component.irAAsistenciaColaboradores();
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/asistencia-colaboradores');
  });

  it('debería navegar a reportes', () => {
    component.irAReportes();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/reporte-asistencia']);
  });

  it('debería navegar a registro manual', () => {
    component.irARegistroManual();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/registro-manual']);
  });

  it('debería mostrar toast', async () => {
    const toastSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastControllerSpy.create.and.returnValue(Promise.resolve(toastSpy));
    await component.mostrarToast('mensaje');
    expect(toastControllerSpy.create).toHaveBeenCalled();
    expect(toastSpy.present).toHaveBeenCalled();
  });

  it('debería obtener el rol del usuario', async () => {
    authServiceSpy.getDecryptedUserData.and.returnValue(Promise.resolve({ rol: 2 }));
    await component.obtenerRolUsuario();
    expect(component.userRol).toBe(2);
    expect(component.rolCargado).toBeTrue();
  });

  // Puedes agregar pruebas para registrarEntrada y registrarSalida usando mocks de Geolocation y AsistenciaService
});
