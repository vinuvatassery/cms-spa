import { TestBed } from '@angular/core/testing';

import { HttpLoggingInterceptor } from './http-logging.interceptor';

describe('HttpLoggingInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpLoggingInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpLoggingInterceptor = TestBed.inject(HttpLoggingInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
