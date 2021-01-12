import { TestBed } from '@angular/core/testing';

import { CuentasPorRecibirService } from './cuentas-por-recibir.service';

describe('CuentasPorRecibirService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CuentasPorRecibirService = TestBed.get(CuentasPorRecibirService);
    expect(service).toBeTruthy();
  });
});
