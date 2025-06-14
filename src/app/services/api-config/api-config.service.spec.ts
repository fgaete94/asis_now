import { TestBed } from '@angular/core/testing';
import { ApiConfigService } from './api-config.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

describe('ApiConfigService', () => {
  let service: ApiConfigService;
  let httpMock: HttpTestingController;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;

  beforeEach(() => {
    toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiConfigService,
        { provide: ToastController, useValue: toastCtrlSpy }
      ]
    });
    service = TestBed.inject(ApiConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería hacer GET correctamente', () => {
    const mockData = { test: 'ok' };
    service.get<any>('test').subscribe(resp => {
      expect(resp.body).toEqual(mockData);
    });
    const req = httpMock.expectOne(`${environment.API_URL}/test`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData, { status: 200, statusText: 'OK' });
  });

  it('debería hacer POST correctamente', () => {
    const mockData = { test: 'ok' };
    service.post<any>('test', { foo: 'bar' }).subscribe(resp => {
      expect(resp.body).toEqual(mockData);
    });
    const req = httpMock.expectOne(`${environment.API_URL}/test`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ foo: 'bar' });
    req.flush(mockData, { status: 201, statusText: 'Created' });
  });

  it('debería hacer PATCH correctamente', () => {
    const mockData = { test: 'ok' };
    service.patch<any>('test', { foo: 'bar' }).subscribe(resp => {
      expect(resp.body).toEqual(mockData);
    });
    const req = httpMock.expectOne(`${environment.API_URL}/test`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ foo: 'bar' });
    req.flush(mockData, { status: 200, statusText: 'OK' });
  });

  it('debería hacer DELETE correctamente', () => {
    const mockData = { test: 'ok' };
    service.delete<any>('test').subscribe(resp => {
      expect(resp.body).toEqual(mockData);
    });
    const req = httpMock.expectOne(`${environment.API_URL}/test`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockData, { status: 200, statusText: 'OK' });
  });

  it('debería mostrar un toast', async () => {
    const toastSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve(toastSpy));
    await service.presentToast({ message: 'Hola', duration: 1000 });
    expect(toastCtrlSpy.create).toHaveBeenCalledWith({ message: 'Hola', duration: 1000 });
    expect(toastSpy.present).toHaveBeenCalled();
  });
});
