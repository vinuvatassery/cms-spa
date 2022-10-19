/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Lov } from '../entities/lov';
/** Data services **/
import { LovDataService } from '../infrastructure/lov.data.service';

@Injectable({ providedIn: 'root' })
export class LovFacade {
  /** Private properties **/
  private lovSubject = new BehaviorSubject<Lov[]>([]);

  /** Public properties **/
  lovs$ = this.lovSubject.asObservable();

  /** Constructor **/
  constructor(private readonly lovDataService: LovDataService) {}

  /** Public methods **/
  loadLovs(): void {
    this.lovDataService.loadLovs().subscribe({
      next: (lovList) => {
        this.lovSubject.next(lovList);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
