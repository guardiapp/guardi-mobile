import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { vigilantGuard } from './vigilant.guard';

describe('vigilantGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => vigilantGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
