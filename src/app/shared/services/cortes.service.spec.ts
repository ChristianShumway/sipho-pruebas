import { TestBed } from '@angular/core/testing';

import { CortesService } from './cortes.service';

describe('CortesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CortesService = TestBed.get(CortesService);
    expect(service).toBeTruthy();
  });
});
