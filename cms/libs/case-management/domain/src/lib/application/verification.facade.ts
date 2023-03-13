/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VerificationFacade {

    save():Observable<boolean>{
        //TODO: save api call //NOSONAR   
        return of(true);
      }
}
