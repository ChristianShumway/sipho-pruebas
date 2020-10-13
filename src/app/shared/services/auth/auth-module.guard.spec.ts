import { TestBed, async, inject } from '@angular/core/testing';

import { AuthModuleGuard } from './auth-module.guard';

describe('AuthModuleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthModuleGuard]
    });
  });

  it('should ...', inject([AuthModuleGuard], (guard: AuthModuleGuard) => {
    expect(guard).toBeTruthy();
  }));
});
