import { ErrorHandler, Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private injector:Injector) {
    
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(tap(
      {
        error: (error: any)=>{
          if(error instanceof HttpErrorResponse){
              this.handlerror(error);
          }
          switch(error.status){
            case 302:
            case 401:
              break;
          }
        }
      }
    ));
  }
  handlerror(error:any){
    const appErrorHandler =this.injector.get(ErrorHandler);
    appErrorHandler.handleError(error);
  }
}
