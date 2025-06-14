import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegistroManualPage } from './registro-manual.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('RegistroManualPage', () => {
  let component: RegistroManualPage;
  let fixture: ComponentFixture<RegistroManualPage>;
  let httpMock: HttpTestingController;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

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

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar usuarios y estaciones en ngOnInit', () => {
    const usuarios = [{ user: 'test' }];
    const estaciones = [{ nombre: 'Est1' }, { nombre: 'Est2' }];

    // Usuarios
    const reqUsuarios = httpMock.expectOne('http://localhost:5000/api/usuarios');
    expect(reqUsuarios.request.method).toBe('GET');
    reqUsuarios.flush(usuarios);

    // Estaciones
    const reqEstaciones = httpMock.expectOne('http://localhost:5000/api/estaciones');
    expect(reqEstaciones.request.method).toBe('GET');
    reqEstaciones.flush(estaciones);

    expect(component.usuarios).toEqual(usuarios);
    expect(component.estaciones).toEqual(['Est1', 'Est2']);
  });

  it('debería enviar registro de ausencia correctamente', fakeAsync(() => {
    component.usuarioSeleccionado = 'testuser';
    component.tipoRegistro = 'ausencia';
    component.observacion = 'Falta justificada';

    spyOn(component, 'mostrarToast').and.returnValue(Promise.resolve());

    component.registrarManual();

    const req = httpMock.expectOne('http://localhost:5000/api/Asistencia/manual');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.usuario).toBe('testuser');
    expect(req.request.body.justificado).toBeTruthy();
    expect(req.request.body.observacion).toBe('Falta justificada');
    req.flush({});

    tick();
    expect(component.mostrarToast).toHaveBeenCalledWith('Registro manual exitoso');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('debería enviar registro de asistencia correctamente', fakeAsync(() => {
    component.usuarioSeleccionado = 'testuser';
    component.tipoRegistro = 'asistencia';
    component.estacionSeleccionada = 'Est1';
    component.observacion = 'Llegó a tiempo';

    spyOn(component, 'mostrarToast').and.returnValue(Promise.resolve());

    component.registrarManual();

    const req = httpMock.expectOne('http://localhost:5000/api/Asistencia/manual');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.usuario).toBe('testuser');
    expect(req.request.body.entrada).toBeTruthy();
    expect(req.request.body.estacion).toBe('Est1');
    expect(req.request.body.observacion).toBe('Llegó a tiempo');
    req.flush({});

    tick();
    expect(component.mostrarToast).toHaveBeenCalledWith('Registro manual exitoso');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('debería mostrar toast de error si falla el registro', fakeAsync(() => {
    component.usuarioSeleccionado = 'testuser';
    component.tipoRegistro = 'ausencia';
    component.observacion = 'Falta';

    spyOn(component, 'mostrarToast').and.returnValue(Promise.resolve());

    component.registrarManual();

    const req = httpMock.expectOne('http://localhost:5000/api/Asistencia/manual');
    req.error(new ErrorEvent('Network error'));

    tick();
    expect(component.mostrarToast).toHaveBeenCalledWith('Error al registrar');
  }));
});
