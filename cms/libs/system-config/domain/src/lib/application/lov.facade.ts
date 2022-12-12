/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Lov } from '../entities/lov';
import { LovType } from '../enums/lov-types.enum';
/** Data services **/
import { LovDataService } from '../infrastructure/lov.data.service';

@Injectable({ providedIn: 'root' })
export class LovFacade {

  constructor(
    private readonly lovDataService: LovDataService,

  ) { }
  
  /** Private properties **/
  private lovSubject = new BehaviorSubject<Lov[]>([]);
  private lovcascadeSubject = new BehaviorSubject<Lov[]>([]);
  private lovRelationShipSubject = new BehaviorSubject<Lov[]>([]);
  private lovcaseoriginSubject = new BehaviorSubject<Lov[]>([]);
      /** Public properties **/
  lovs$ = this.lovSubject.asObservable();
  ovcascade$ = this.lovcascadeSubject.asObservable();
  lovRelationShip$ = this.lovRelationShipSubject.asObservable();
  caseoriginlov$ = this.lovcaseoriginSubject.asObservable();

        /** Public methods **/

 getLovsbyParent(lovType : string,parentCode : string): void {
  this.lovDataService.getLovsbyParent(lovType, parentCode).subscribe({
    next: (lovResponse) => {
      this.lovcascadeSubject.next(lovResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}

getRelationShipsLovs(): void {
  this.lovDataService.getLovsbyType(LovType.RelationshipCode).subscribe({
    next: (relationsResponse) => {
      this.lovRelationShipSubject.next(relationsResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}


getCaseOriginLovs(): void {
  this.lovDataService.getLovsbyType(LovType.CaseOrigin).subscribe({
    next: (lovcaseoriginResponse) => {
      this.lovcaseoriginSubject.next(lovcaseoriginResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}
}
