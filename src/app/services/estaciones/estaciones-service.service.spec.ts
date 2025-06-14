import { TestBed } from '@angular/core/testing';
import { EstacionesServiceService } from './estaciones-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('EstacionesServiceService', () => {
  let service: EstacionesServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EstacionesServiceService]
    });
    service = TestBed.inject(EstacionesServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener estaciones correctamente', () => {
    const mockEstaciones = [{ nombre: 'Est1' }, { nombre: 'Est2' }];
    service.getBaseUrlInfo().subscribe(data => {
      expect(data).toEqual(mockEstaciones);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/estaciones');
    expect(req.request.method).toBe('GET');
    req.flush(mockEstaciones);
  });

  it('debería manejar errores al obtener estaciones', () => {
    service.getBaseUrlInfo().subscribe({
      next: () => fail('debería fallar'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('http://localhost:5000/api/estaciones');
    req.flush('Error del servidor', { status: 500, statusText: 'Server Error' });
  });
});
