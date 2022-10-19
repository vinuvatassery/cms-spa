/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SmokingCessationFacade {

    save(): Observable<boolean> {
        //TODO: save api call   
        return of(true);
    }
}
