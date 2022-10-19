/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { VendorFacade } from '@cms/financial-management/domain';

@Component({
  selector: 'financial-management-vendor-page',
  templateUrl: './vendor-page.component.html',
  styleUrls: ['./vendor-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorPageComponent implements OnInit {
  /** Public properties **/
  vendors$ = this.vendorFacade.vendors$;

  /** Constructor **/
  constructor(private readonly vendorFacade: VendorFacade) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadVendors();
  }

  /** Private methods **/
  private loadVendors(): void {
    this.vendorFacade.loadVendors();
  }
}
