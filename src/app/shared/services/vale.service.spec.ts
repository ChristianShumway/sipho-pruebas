import { TestBed } from '@angular/core/testing';

import { ValeService } from './vale.service';

describe('ValeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValeService = TestBed.get(ValeService);
    expect(service).toBeTruthy();
  });
});
