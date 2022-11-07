/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Vendor } from '../entities/vendor';
/** Data services **/
import { VendorDataService } from '../infrastructure/vendor.data.service';

@Injectable({ providedIn: 'root' })
export class VendorFacade {
  /** Private properties **/
  private vendorsSubject = new BehaviorSubject<Vendor[]>([]);

  /** Public properties **/
  vendors$ = this.vendorsSubject.asObservable();

  /** Constructor **/
  constructor(private readonly vendorDataService: VendorDataService) {}

  /** Public methods **/
  loadVendors(): void {
    this.vendorDataService.loadVendors().subscribe({
      next: (vendors) => {
        this.vendorsSubject.next(vendors);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
