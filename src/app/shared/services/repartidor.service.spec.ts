import { TestBed } from '@angular/core/testing';

import { RepartidorService } from './repartidor.service';

describe('RepartidorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RepartidorService = TestBed.get(RepartidorService);
    expect(service).toBeTruthy();
  });
});
