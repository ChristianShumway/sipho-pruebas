import { TestBed } from '@angular/core/testing';

import { CortesPendientesService } from './cortes-pendientes.service';

describe('CortesPendientesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CortesPendientesService = TestBed.get(CortesPendientesService);
    expect(service).toBeTruthy();
  });
});
