/** Angular **/
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
/** External libraries **/
import { finalize, tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements HttpInterceptor {
  /** Public methods **/
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const started = Date.now();
    let ok: string;

    // extend server response observable with logging
    return next.handle(req).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // Succeeds when there is a response; ignore other events
            ok = event instanceof HttpResponse ? 'succeeded' : '';
          }
        }, 
        error: () => {
          // Operation failed; error is an HttpErrorResponse
          ok = 'failed';
        } 
      }),
      // Log when response observable either completes or errors
      finalize(() => {
        const elapsed = Date.now() - started;
        const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
        console.log(msg);
      })
    );
  }
}
