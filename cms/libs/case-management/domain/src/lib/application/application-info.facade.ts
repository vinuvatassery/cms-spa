import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({ providedIn: 'root' })
export class ApplicationInfoFacade {

    //private validateApplicationInfoSubject = new BehaviorSubject<any>([]);
  
    /** Public properties **/
    // validate$ = this.validateApplicationInfoSubject.asObservable();
   
    // validate(validated:any):void{
    //     this.validateApplicationInfoSubject.next(validated);
    // }
   
}
