/** Angular **/
import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
/** Interceptors **/
import {
  HttpErrorInterceptor,
  HttpLoggingInterceptor,
} from './application/http-interceptors';
/** Services **/
import { AppErrorHandler } from './application/services/app-error-handler.service';
import { LocalStorageService } from './infrastructure/local-storage.service';
import { NotificationService } from './api/services/notification.service';
import { ConfigurationProvider } from './api/providers/configuration.provider';
import { LoaderInterceptor } from './application/http-interceptors/http-loader.interceptor';
import { LoaderService } from './application/services/app-loader.service';
export { ConfigurationProvider, LocalStorageService, NotificationService };

@NgModule({
  imports: [CommonModule],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
     {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoggingInterceptor,
      multi: true,
    },
 
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: LoaderInterceptor,
    //   multi: true,
    // },
 
  ],
})
export class SharedUtilCoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: SharedUtilCoreModule
  ) {
    if (parentModule) {
      throw new Error(
        'SharedUtilCoreModule is already loaded. Import only in AppModule'
      );
    }
  }
}
