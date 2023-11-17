import { Component, OnInit } from '@angular/core';
import { VendorFacade } from '@cms/financial-management/domain';

@Component({
  selector: 'financial-management-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss'],
})
export class VendorComponent implements OnInit {
  vendorList$ = this.vendorFacade.vendorList$;

  constructor(private vendorFacade: VendorFacade) {}

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.vendorFacade.load();
  }
}
