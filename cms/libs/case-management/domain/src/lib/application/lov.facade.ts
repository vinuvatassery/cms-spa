/** Angular **/
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Lov } from '../entities/lov';

/** Data services **/
import { LovDataService } from '../infrastructure/lov.data.service';

@Injectable({ providedIn: 'root' })

export class LovFacade {

    constructor(
        private readonly lovDataService: LovDataService,
    
      ) { }
    

      /** Private properties **/
    private lovSubject = new BehaviorSubject<Lov[]>([]);

       /** Public properties **/
    lovs$ = this.lovSubject.asObservable();

         /** Public methods **/
 loadCaseOrigins(lovType : string): void {
    this.lovDataService.loadCaseOrigins(lovType).subscribe({
      next: (lovResponse) => {
        this.lovSubject.next(lovResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

}