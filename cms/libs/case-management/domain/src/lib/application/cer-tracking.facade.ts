/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Cer } from '../entities/cer';
/** Data services **/
import { CerDataService } from '../infrastructure/cer.data.service';

@Injectable({ providedIn: 'root' })
export class CerTrackingFacade {
  /** Private properties **/
  private cerSubject = new BehaviorSubject<Cer[]>([]);
  private cerGridSubject = new BehaviorSubject<any>([]);
  private ddlCerSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  cer$ = this.cerSubject.asObservable();
  cerGrid$ = this.cerGridSubject.asObservable();
  ddlCer$ = this.ddlCerSubject.asObservable();

  /** Constructor**/
  constructor(private readonly cerDataService: CerDataService) {}

  /** Public methods **/
  loadCer(): void {
    this.cerDataService.loadCer().subscribe({
      next: (cerResponse) => {
        this.cerSubject.next(cerResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadCerGrid(): void {
    this.cerDataService.loadCerGrid().subscribe({
      next: (cerGridResponse) => {
        this.cerGridSubject.next(cerGridResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlCer(): void {
    this.cerDataService.loadDdlCer().subscribe({
      next: (ddlCerResponse) => {
        this.ddlCerSubject.next(ddlCerResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
