import { TestBed } from '@angular/core/testing';

import { RemisionService } from './remision.service';

describe('RemisionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RemisionService = TestBed.get(RemisionService);
    expect(service).toBeTruthy();
  });
});
