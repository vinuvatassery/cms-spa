/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VerificationFacade {


    private providerChange =  new Subject<string>();

      /** Public properties **/
    providerValue$ = this.providerChange.asObservable();

    providerValueChange(provider:string){
      this.providerChange.next(provider);
    }
    save():Observable<boolean>{
        //TODO: save api call   
        return of(true);
      }
}
