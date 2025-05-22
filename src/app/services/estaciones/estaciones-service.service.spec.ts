import { TestBed } from '@angular/core/testing';

import { EstacionesServiceService } from './estaciones-service.service';

describe('EstacionesServiceService', () => {
  let service: EstacionesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstacionesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
