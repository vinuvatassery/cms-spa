import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable,} from '@angular/core';

@Injectable()
export class AppErrorHandlerService extends ErrorHandler {

  constructor() {
    super();
   }

   HandleError(error: Error| HttpErrorResponse){
    const message= "An error occured," +error;
    console.log(message);
    super.handleError(error);
   }
}
