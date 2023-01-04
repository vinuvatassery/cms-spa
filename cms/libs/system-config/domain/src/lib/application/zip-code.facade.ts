/** Angular **/
import { Injectable } from '@angular/core';

/** External libraries **/
import { Observable } from 'rxjs';

/** Internal libraries **/
import { Counties } from '../entities/counties';
import { State } from '../entities/state';
import { ZipCodeDataService } from '../infrastructure/zip-code.data.service';

@Injectable({ providedIn: 'root' })
export class ZipCodeFacade {

    constructor(private readonly zipCodeDataService: ZipCodeDataService) { }

    getStates(): Observable<State[]> {
        return this.zipCodeDataService.getSates();
    }

    getCounties(stateCode: string): Observable<Counties[]> {
        return this.zipCodeDataService.getCounties(stateCode);
    }
}
