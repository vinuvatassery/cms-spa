import { ChangeDetectionStrategy, Component,ChangeDetectorRef,Input, ViewChildren, QueryList } from '@angular/core';
import { PaymentsFacade,BillingAddressFacade,VendorContactsFacade, ContactResponse ,FinancialVendorTypeCode, FinancialVendorProviderTabCode } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ActivatedRoute } from '@angular/router';
import { GridComponent } from '@progress/kendo-angular-grid';
import { take } from 'rxjs';


@Component({
  selector: 'cms-payment-addresses',
  templateUrl: './payment-addresses.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentAddressesComponent {
  @Input() vendorId: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isPaymentsAddressGridLoaderShow = false;
  public sortValue = this.paymentsFacade.sortValue;
  public sortType = this.paymentsFacade.sortType;
  public pageSizes = this.paymentsFacade.gridPageSizes;
  public gridSkipCount = this.paymentsFacade.skipCount;
  public sort = this.paymentsFacade.sort;
  public state!: State;
  paymentsAddressGridView$ = this.paymentBillingFacade.billingAddressData$;
  isPaymentAddressDetailShow = false;
  isContactDetailShow = false;
  isPaymentAddressDetailIsEdit = false;
  isPaymentAddressDeactivateShow = false;
  isPaymentAddressDeleteShow = false;
  VendorAddressId:any;
  billingAddressObj: any[] = [];
  tabCode: string = '';
  addressId: any;
  isShowHistoricalData = false;
  addEditTitleText = 'Add Payment Address';
  manufacturerAddEditTitleText = 'Add Address';
  financialVendorType: typeof FinancialVendorTypeCode = FinancialVendorTypeCode;
  @ViewChildren(GridComponent) private grid !: QueryList<GridComponent>;
  IsAddContactDisabled:boolean=true;
  isContactAddressDeactivateShow = false;
  paymentAddressInnerGridLists = [
    {
      Name: 'FName LName',
      Description: 'FName LName',
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
      type: 'Edit',
      click: (data: any): void => {;
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Address',
      type: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        this.clickOpenDeactivatePaymentAddressDetails();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Address',
      type: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        this.clickOpenDeletePaymentAddressDetails();
      },
    },
  ];
  contactResponse: ContactResponse[] = [];
  /** Constructor **/
  constructor(private readonly paymentsFacade: PaymentsFacade,private readonly paymentBillingFacade: BillingAddressFacade,private readonly vendorcontactFacade: VendorContactsFacade,private route: ActivatedRoute, private readonly cdr: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.vendorcontactFacade.loadMailCodes(this.vendorId);
    this.vendorcontactFacade.mailCodes$.subscribe((mailCode: any) => {
      if(mailCode.length>0)
      {
        this.IsAddContactDisabled=false;
        this.cdr.detectChanges();
      }else{
        this.IsAddContactDisabled=true;
      }
    })
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.tabCode = this.route.snapshot.queryParams['tab_code'];
    this.getTabCode();
    this.loadPaymentsAddressListGrid();
  }

  ngOnChanges(): void {
    this.vendorcontactFacade.loadMailCodes(this.vendorId);
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  pageSelectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPaymentsAddressListGrid();
  }
  public onDetailCollapse(e: any): void {
  }

  public onDetailExpand(e: any): void {
    this.VendorAddressId=e.dataItem.vendorAddressId;

  }
  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.loadPaymentsAddressListGrid();
  }

  loadPaymentsAddressListGrid() {
    this.paymentBillingFacade.loadPaymentsAddressListGrid(
      this.tabCode,
      this.state.skip ?? 0,
      this.state.take ?? 0,
      this.sortValue,
      this.sortType,
      this.vendorId,
      this.isShowHistoricalData
    );
  }




  clickOpenAddEditPaymentAddressDetails() {
    this.addEditTitleText = 'Add Payment Address'
    this.manufacturerAddEditTitleText = 'Add Address'
    this.isPaymentAddressDetailShow = true;
    this.isPaymentAddressDetailIsEdit = false;
  }

  clickOpenEditPaymentAddressDetails() {
    this.isPaymentAddressDetailShow = true;
    this.isPaymentAddressDetailIsEdit = true;
  }

  clickCloseAddEditPaymentAddressDetails() {
    this.isPaymentAddressDetailShow = false;
  }
  clickOpenAddContactDetails() {
    this.paymentsAddressGridView$.pipe(take(1)).subscribe(({data})=>{
      data.forEach((item:any, idx:number) => {
        this.grid.last.collapseRow((this.state.skip ?? 0) + idx);
      })
    })
    this.isContactDetailShow = true;
  }
  onClose(isClosed: any) {
    if (isClosed) {
      this.clickCloseAddContactDetails();
    }
  }

  clickCloseAddContactDetails() {
    this.isContactDetailShow = false;
  }

  closePaymentAddressDetails(event: any) {
    if (event === 'saved') {
      this.loadPaymentsAddressListGrid();
    }
    this.clickCloseAddEditPaymentAddressDetails();
  }

  clickOpenDeactivatePaymentAddressDetails() {
    this.isPaymentAddressDeactivateShow = true;
  }



  clickCloseDeactivatePaymentAddress(isSuccess: boolean): void {
    this.isPaymentAddressDeactivateShow = false;
    this.clickCloseAddEditPaymentAddressDetails();
    if (isSuccess)
      this.loadPaymentsAddressListGrid();
  }

  clickOpenDeletePaymentAddressDetails() {
    this.isPaymentAddressDeleteShow = true;
  }
  clickCloseDeletePaymentAddress(isSuccess: boolean): void {
    this.isPaymentAddressDeleteShow = false;
    if (isSuccess)
      this.loadPaymentsAddressListGrid();
  }

  getTabCode() {
    switch (this.tabCode) {
      case FinancialVendorProviderTabCode.Manufacturers:
        this.tabCode = FinancialVendorTypeCode.Manufacturers;
        break;
      case FinancialVendorProviderTabCode.InsuranceVendors:
        this.tabCode = FinancialVendorTypeCode.InsuranceVendors;
        break;
      case FinancialVendorProviderTabCode.Pharmacy:
        this.tabCode = FinancialVendorTypeCode.Pharmacy;
        break;
      case FinancialVendorProviderTabCode.DentalProvider:
        this.tabCode = FinancialVendorTypeCode.DentalProviders;
        break;
      case FinancialVendorProviderTabCode.MedicalProvider:
        this.tabCode = FinancialVendorTypeCode.MedicalProviders;
        break;
      default:
        this.tabCode = '';
        break;
    }
  }

  handleOptionClick(dataItem: any, type: any) {
    if (type == 'Delete') {
      this.addressId = dataItem.vendorAddressId ?? this.addressId;
      this.clickOpenDeletePaymentAddressDetails();
    }
    else if (type == 'Edit') {
      this.addressId = dataItem.vendorAddressId ?? this.addressId;
      this.billingAddressObj = dataItem;
      this.addEditTitleText = 'Edit Payment Address'
      this.manufacturerAddEditTitleText = 'Edit Address'
      this.clickOpenEditPaymentAddressDetails();
    }
    else if (type == 'Deactivate') {
      this.addressId = dataItem.vendorAddressId ?? this.addressId;
      this.clickOpenDeactivatePaymentAddressDetails();
    }
    this.cdr.detectChanges();
  }
  onGetHistoricalPaymentAddressData()
  {
    this.loadPaymentsAddressListGrid();
  }
  onEditDeactivateClicked(event:any)
  {
    this.handleOptionClick(event,'Deactivate');
  }
  public columnChange(e: any) {
    this.cdr.detectChanges();
  }
  clickCloseDeactivateContactAddress() {
    this.isContactAddressDeactivateShow = false;
  }
  onDeactiveCancel(isCancel: any) {
    if (isCancel) {
      this.clickCloseDeactivateContactAddress();
    }
  }
}
