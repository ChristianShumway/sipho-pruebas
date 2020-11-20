import { TestBed } from '@angular/core/testing';

import { DevolucionPedidoService } from './devolucion-pedido.service';

describe('DevolucionPedidoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DevolucionPedidoService = TestBed.get(DevolucionPedidoService);
    expect(service).toBeTruthy();
  });
});
