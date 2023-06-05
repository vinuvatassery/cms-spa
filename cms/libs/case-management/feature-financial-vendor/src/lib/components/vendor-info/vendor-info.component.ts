import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FinancialVendorFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-vendor-info',
  templateUrl: './vendor-info.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorInfoComponent implements OnInit {
  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  vendorDetail!: any;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  addressGridView = [];
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

  constructor(private financialVendorFacade: FinancialVendorFacade) { }

  ngOnInit() {
    this.financialVendorFacade.selectedVendor$.subscribe((vendor: any)=> {
      this.vendorDetail = vendor;
    });
  }
}
