/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { DentalInsurance } from '../entities/dental-insurance';
/** Data services **/
import { DentalInsuranceDataService } from '../infrastructure/dental-insurance.data.service';

@Injectable({ providedIn: 'root' })
export class DentalInsuranceFacade {
  /** Private properties **/
  private dentalInsurancesSubject = new BehaviorSubject<DentalInsurance[]>([]);

  /** Public properties **/
  dentalInsurances$ = this.dentalInsurancesSubject.asObservable();

  /** Constructor**/
  constructor(
    private readonly dentalInsuranceDataService: DentalInsuranceDataService
  ) {}

  /** Public methods **/
  loadDentalInsurances(): void {
    this.dentalInsuranceDataService.loadDentalInsurances().subscribe({
      next: (dentalInsurancesResponse) => {
        this.dentalInsurancesSubject.next(dentalInsurancesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
