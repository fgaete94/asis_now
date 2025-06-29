import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegistroManualPage } from './registro-manual.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

describe('RegistroManualPage', () => {
  let component: RegistroManualPage;
  let fixture: ComponentFixture<RegistroManualPage>;
  let httpMock: HttpTestingController;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastElementSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastElementSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve(toastElementSpy));

    await TestBed.configureTestingModule({
      declarations: [RegistroManualPage],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ToastController, useValue: toastCtrlSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroManualPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería enviar registro de asistencia correctamente', fakeAsync(() => {
    component.usuarioSeleccionado = 'usuario1';
    component.tipoRegistro = 'asistencia';
    component.estacionSeleccionada = 'Estacion1';
    component.observacion = 'Observación';

    component.registrarManual();

    // Simula respuesta para usuarios y estaciones en ngOnInit
    httpMock.expectOne('http://localhost:5000/api/usuarios').flush([]);
    httpMock.expectOne('http://localhost:5000/api/estaciones').flush([]);

    // Simula respuesta para el POST de asistencia
    const req = httpMock.expectOne('http://localhost:5000/api/Asistencia/manual');
    expect(req.request.method).toBe('POST');
    req.flush({});

    tick();

    expect(toastCtrlSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Registro manual exitoso',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    }));
    expect(toastElementSpy.present).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('debería mostrar toast de error si falla el registro', fakeAsync(() => {
    component.usuarioSeleccionado = 'usuario1';
    component.tipoRegistro = 'asistencia';
    component.estacionSeleccionada = 'Estacion1';
    component.observacion = 'Observación';

    component.registrarManual();

    // Simula respuesta para usuarios y estaciones en ngOnInit
    httpMock.expectOne('http://localhost:5000/api/usuarios').flush([]);
    httpMock.expectOne('http://localhost:5000/api/estaciones').flush([]);

    // Simula error en el POST de asistencia
    const req = httpMock.expectOne('http://localhost:5000/api/Asistencia/manual');
    req.error(new ErrorEvent('Error'));

    tick();

    expect(toastCtrlSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Error al registrar',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    }));
    expect(toastElementSpy.present).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
