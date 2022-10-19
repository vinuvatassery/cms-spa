/** Angular **/
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';

/** Passes HttpErrorResponse to application-wide error handler */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  /** Constructor **/
  constructor(private injector: Injector) {}

  /** Public methods **/
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        error: (err: any) => {
          if (err instanceof HttpErrorResponse) {
            this.handleError(err);
          }
          switch (err.status) {
            case 302:
            case 401:
              break;
          }
        },
      })
    );
  }

  handleError(err: any) {
    const appErrorHandler = this.injector.get(ErrorHandler);
    appErrorHandler.handleError(err);
  }
}
