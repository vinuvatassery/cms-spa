import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './http-interceptors/http-error.interceptor';
import { HttpLoggingInterceptor } from './http-interceptors/http-logging.interceptor';
import { AppErrorHandlerService } from './app-error-handler.service';

@NgModule({
  imports: [CommonModule],
  providers:[AppErrorHandlerService,
    {
    provide:HTTP_INTERCEPTORS,
    useClass:HttpLoggingInterceptor, multi:true
  },
{
  provide:HTTP_INTERCEPTORS,
  useClass:HttpErrorInterceptor, multi:true
},
{
  provide:ErrorHandler,
  useClass:AppErrorHandlerService
}],
})
export class SharedUtilCoreModule {}
