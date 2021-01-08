import { TestBed } from '@angular/core/testing';

import { ArqueoService } from './arqueo.service';

describe('ArqueoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArqueoService = TestBed.get(ArqueoService);
    expect(service).toBeTruthy();
  });
});
