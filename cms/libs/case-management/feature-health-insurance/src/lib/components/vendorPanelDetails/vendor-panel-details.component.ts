import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialVendorFacade, FinancialVendorProviderTabCode } from '@cms/case-management/domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'case-management-vendor-panel-details',
  templateUrl: './vendor-panel-details.component.html'
})
export class VendorPanelDetailsComponent {
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
  private route: Router,
){

}
  ngOnInit(): void {
    this.loadVendorInfo()

    this.loadVendorPnelInfo();
  }

  private loadVendorPnelInfo() {
    this.selectedVendor$.subscribe({
      next:(value:any) => {
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
  get financeManagementTabs(): typeof FinancialVendorProviderTabCode {
    return FinancialVendorProviderTabCode;
  }
  onVendorProfileViewClicked() {
    const query = {
      queryParams: {
        v_id: this.vendorData.vendorId,
        tab_code: FinancialVendorProviderTabCode.InsuranceVendors
      },
    };
    this.route.navigate(['/financial-management/vendors/profile'], query)
    this.closeViewProviderClicked()
  }
  
}

