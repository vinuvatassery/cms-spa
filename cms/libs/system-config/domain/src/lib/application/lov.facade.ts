/** Angular **/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  private lovcaseoriginSubject = new BehaviorSubject<Lov[]>([]);
      /** Public properties **/
  lovs$ = this.lovSubject.asObservable();
  ovcascade$ = this.lovcascadeSubject.asObservable();
  caseoriginlov$ = this.lovcaseoriginSubject.asObservable();

        /** Public methods **/

  getLovsbyParent(lovType: string, parentCode: string): void {
    this.lovDataService.getLovsbyParent(lovType, parentCode).subscribe({
      next: (lovResponse) => {
        this.lovcascadeSubject.next(lovResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  getLov(lovType: string): Observable<Lov[]> {
    return this.lovDataService.getLovsbyType(lovType);
  }

  getLovByParent(lovType: string, parentCode: string): Observable<Lov[]> {
    return this.lovDataService.getLovsbyParent(lovType, parentCode);
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
