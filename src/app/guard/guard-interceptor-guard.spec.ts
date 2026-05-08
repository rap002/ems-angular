import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guardInterceptorGuard } from './guard-interceptor-guard';

describe('guardInterceptorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => guardInterceptorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
