import { TestBed } from '@angular/core/testing';

import { VitrinaService } from './vitrina.service';

describe('VitrinaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VitrinaService = TestBed.get(VitrinaService);
    expect(service).toBeTruthy();
  });
});
