import { TestBed } from '@angular/core/testing';
import { UbicacionService } from './ubicacion-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UbicacionService', () => {
  let service: UbicacionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UbicacionService]
    });
    service = TestBed.inject(UbicacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería enviar la ubicación correctamente', () => {
    const lat = 10;
    const lng = 20;
    service.enviarUbicacion(lat, lng).subscribe(resp => {
      expect(resp.lat).toBe(lat);
      expect(resp.lng).toBe(lng);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/ubicacion');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ lat, lng });
    req.flush({ lat, lng });
  });
});
