import { TestBed } from '@angular/core/testing';

import { UtilOIDCAuthGuard } from './utilOIDCAuth.guard';

describe('AuthGuard', () => {
  let guard: UtilOIDCAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UtilOIDCAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
