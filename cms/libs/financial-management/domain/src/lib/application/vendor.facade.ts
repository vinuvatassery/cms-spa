import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Vendor } from '../entities/vendor';
import { VendorDataService } from '../infrastructure/vendor.data.service';

@Injectable({ providedIn: 'root' })
export class VendorFacade {
  private vendorListSubject = new BehaviorSubject<Vendor[]>([]);
  vendorList$ = this.vendorListSubject.asObservable();

  constructor(private vendorDataService: VendorDataService) {}

  load(): void {
    this.vendorDataService.load().subscribe({
      next: (vendorList) => {
        this.vendorListSubject.next(vendorList);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
