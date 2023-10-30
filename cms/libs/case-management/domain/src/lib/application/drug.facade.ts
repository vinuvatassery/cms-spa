/** Angular **/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DrugDataService } from '../infrastructure/drug.data.service.';

@Injectable({ providedIn: 'root' })
export class DrugFacade {

  /** Public properties **/
  drugLoaderSubject = new Subject<boolean>();
  drugLoaderChange$ = this.drugLoaderSubject.asObservable();
  drugChangeSubject = new Subject<any[]>();
  drugChange$ = this.drugChangeSubject.asObservable();
  constructor(private readonly drugDataService: DrugDataService) { }

  /** Public methods **/

  addDrug(dto: any) {
    return this.drugDataService.addDrug(dto);
  }

}
