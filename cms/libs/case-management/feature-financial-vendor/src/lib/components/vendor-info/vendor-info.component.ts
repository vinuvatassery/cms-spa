import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FinancialVendorFacade, FinancialVendorTypeCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-vendor-info',
  templateUrl: './vendor-info.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorInfoComponent implements OnInit {

  @Input() profileInfoTitle!: string;
  selectedVendorInfo$ = this.financialVendorFacade.selectedVendor$;
  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  vendorDetail!: any;
  vendorId!: string;
  openEditDailog: boolean = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  addressGridView = [];
  providerType: string = this.vendorTypes.DentalProviders;
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit Address",
      icon: "edit",
      click: (data: any): void => {
        console.log(data);
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Deactivate Address",
      icon: "block",
      click: (data: any): void => {
        console.log(data);
      },
    },
    {
      buttonType: "btn-h-danger",
      text: "Delete Address",
      icon: "delete",
      click: (data: any): void => {
        console.log(data);
      },
    },
  ];

  public get vendorTypes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }

  constructor(private financialVendorFacade: FinancialVendorFacade,
    private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.vendorId = this.activeRoute.snapshot.queryParams['v_id'];
    this.loadVendorInfo();
  }

  loadVendorInfo() {
    this.financialVendorFacade.getVendorDetails(this.vendorId);
    this.financialVendorFacade.selectedVendor$.subscribe((details: any) => {
      this.vendorDetail = details;
    });
  }


  closeEditModal(isEditSuccessfull: boolean) {
    this.openEditDailog = false;
    if(isEditSuccessfull){
      this.loadVendorInfo();
    }
  }

}
