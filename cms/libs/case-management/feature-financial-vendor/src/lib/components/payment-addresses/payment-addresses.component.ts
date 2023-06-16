import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { PaymentsFacade, BillingAddressFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ActivatedRoute } from '@angular/router';
import { FinancialVendorTypeCode,FinancialVendorProviderTabCode } from '@cms/case-management/domain';

@Component({
  selector: 'cms-payment-addresses',
  templateUrl: './payment-addresses.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentAddressesComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isPaymentsAddressGridLoaderShow = false;
  public sortValue = this.paymentsFacade.sortValue;
  public sortType = this.paymentsFacade.sortType;
  public pageSizes = this.paymentsFacade.gridPageSizes;
  public gridSkipCount = this.paymentsFacade.skipCount;
  public sort = this.paymentsFacade.sort;
  public state!: State;
  paymentsAddressGridView$ = this.paymentsFacade.billingAddressData$;
  isPaymentAddressDetailShow = false;
  isPaymentAddressDeactivateShow = false;
  isPaymentAddressDeleteShow = false;
  billingAddressObj: any[] = [];
  tabCode: string = '';
  addressId: any;
  paymentAddressInnerGridLists = [
    {
      Name: 'FName LName',
      Description:'FName LName',
      PremiumAmount: '500.00',
      PhoneNumber: 'XXXXXX',
      FaxNumber: 'XXXXXX',
      EmailAddress: 'XXXXXX',
      EffectiveDate: 'XXXXXX',
      by: 'XX',
    },
  ];



  public paymentAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Address',
      icon: 'edit',
      type: "Edit",
      click: (data: any): void => {},
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Address',
      icon: 'block',
      type: "Deactivate",
      click: (data: any): void => {},
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Address',
      icon: 'delete',
      type: "Delete",
      click: (data: any): void => {},
    },
  ];

   /** Constructor **/
   //constructor(private readonly paymentsFacade: PaymentsFacade,
   constructor(private readonly paymentsFacade: BillingAddressFacade,
    private route: ActivatedRoute, private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };

    this.getTabCode();
    this.loadPaymentsAddressListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  // updating the pagination info based on dropdown selection
  pageSelectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPaymentsAddressListGrid();
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.loadPaymentsAddressListGrid();
  }
  loadPaymentsAddressListGrid() {
    this.paymentsFacade.loadPaymentsAddressListGrid(
      this.tabCode,
      this.state.skip ?? 0,//this.gridSkipCount,
      this.state.take ?? 0,//this.pageSizes[0]?.value,
      this.sortValue,
      this.sortType
    );
  }



  clickOpenAddEditPaymentAddressDetails() {
    this.isPaymentAddressDetailShow = true;
  }

  clickCloseAddEditPaymentAddressDetails() {
    this.isPaymentAddressDetailShow = false;
  }

  clickOpenDeactivatePaymentAddressDetails() {
    this.isPaymentAddressDeactivateShow = true;
  }

  clickCloseDeactivatePaymentAddress(isSuccess: boolean): void {
    this.isPaymentAddressDeactivateShow = false;
    if(isSuccess)
      this.loadPaymentsAddressListGrid();
  }

  clickOpenDeletePaymentAddressDetails() {
    this.isPaymentAddressDeleteShow = true;
  }
  clickCloseDeletePaymentAddress(isSuccess: boolean): void {
    this.isPaymentAddressDeleteShow = false;
    if(isSuccess)
      this.loadPaymentsAddressListGrid();
  }

  getTabCode() {
    this.route.queryParams.subscribe(params => {
      let _tabCode = params['tab_code'];
      console.log(_tabCode);
      switch (_tabCode) {
        case FinancialVendorProviderTabCode.Manufacturers://'mnfc':
          this.tabCode = FinancialVendorTypeCode.Manufacturers;
          break;
        case FinancialVendorProviderTabCode.InsuranceVendors://'ins_vend':
          this.tabCode = FinancialVendorTypeCode.InsuranceVendors;
          break;
        case FinancialVendorProviderTabCode.Pharmacy://'phrm':
          this.tabCode = FinancialVendorTypeCode.Pharmacy;
          break;
        case FinancialVendorProviderTabCode.DentalProvider://'dent_prv':
          this.tabCode = FinancialVendorTypeCode.DentalProviders;
          break;
        case FinancialVendorProviderTabCode.MedicalProvider://'med_prv':
          this.tabCode = FinancialVendorTypeCode.MedicalProviders;
          break;
        default:
          this.tabCode = ''; // Set a default value if none of the cases match
          break;
      }
    });
  }

  handleOptionClick(dataItem: any, type: any) {
    debugger;
    if (type == 'Delete') {
      this.addressId = dataItem.vendorAddressId ?? this.addressId;
      this.clickOpenDeletePaymentAddressDetails();
    }
    else if (type == 'Edit') {
      this.addressId = dataItem.vendorAddressId ?? this.addressId;

      //this.addressId = dataItem.vendorAddressId;
      this.clickOpenAddEditPaymentAddressDetails();
    }
    else if (type == 'Deactivate') {
      this.addressId = dataItem.vendorAddressId ?? this.addressId;
      this.clickOpenDeactivatePaymentAddressDetails();
    }
    this.cdr.detectChanges();
  }
}
