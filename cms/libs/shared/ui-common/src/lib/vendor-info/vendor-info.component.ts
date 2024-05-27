import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FinancialVendorFacade } from '@cms/case-management/domain';

@Component({
  selector: 'common-vendor-info',
  templateUrl: './vendor-info.component.html',
  styleUrls: ['./vendor-info.component.scss'],
})
export class VendorInfoComponent {

  vendorProfile: any;
  emailAddress: any;
  phoneNbr: any;
  @Input() updateProviderPanelSubject$: Observable<any> | undefined;
  @Input() vendorId: any

  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();
  @Output() getProviderPanelEvent = new EventEmitter<any>();
  selectedVendor$ = this.financialVendorFacade.selectedVendor$;
  vendorData: any;

constructor(    public activeRoute: ActivatedRoute,
  private readonly changeDetectorRef: ChangeDetectorRef,
  private financialVendorFacade: FinancialVendorFacade,
){

}
  ngOnInit(): void {
    //this.vendorId = this.vendorId ? this.vendorId : this.activeRoute.snapshot.queryParams['pid'];
    this.loadVendorInfo()

    this.loadVendorPnelInfo();
  }

  private loadVendorPnelInfo() {
    this.selectedVendor$.subscribe({
      next:(value:any) => {
        debugger
        this.vendorData = value;
      },
      error:(err) => {
      },
    });
  }

  loadVendorInfo() {
    this.financialVendorFacade.getVendorDetails(this.vendorId);
  }
  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }
  
}
