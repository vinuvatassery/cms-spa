/** Angular **/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  private lovcascadeSubject = new BehaviorSubject<Lov[]>([]);
  /** Public properties **/
  lovs$ = this.lovSubject.asObservable();
  ovcascade$ = this.lovcascadeSubject.asObservable();

  /** Public methods **/
  getLovsbyType(lovType: string): void {
    this.lovDataService.getLovsbyType(lovType).subscribe({
      next: (lovResponse) => {
        this.lovSubject.next(lovResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

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
}
