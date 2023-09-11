import { ChangeDetectionStrategy, Component,ChangeDetectorRef,Input, ViewChildren, QueryList } from '@angular/core';
import { PaymentsFacade,BillingAddressFacade,VendorContactsFacade, ContactResponse ,FinancialVendorTypeCode, FinancialVendorProviderTabCode, StatusFlag } from '@cms/case-management/domain';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ActivatedRoute } from '@angular/router';
import { FilterService, GridComponent } from '@progress/kendo-angular-grid';
import { take } from 'rxjs';
import { LovFacade } from '@cms/system-config/domain';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider } from '@cms/shared/util-core';


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
  public gridFilter: CompositeFilterDescriptor={logic:'and',filters:[]};
  paymentRunDateMonthlyValue = null;
  paymentMethodValue = null;
  paymentMethodVendorlov$ = this.lovFacade.paymentMethodVendorlov$;
  paymentRunDatelov$ = this.lovFacade.paymentRunDatelov$;
  yesOrNoLov$ = this.lovFacade.yesOrNoLov$;
  paymentMethodVendorlovs:any=[];
  paymentRunDatelovs:any=[];
  yesOrNoLovs:any=[];
  filters:any=[];
  filteredBy = "";
  isFiltered = false;
  sortColumn: any;
  sortDir = "";
  columnsReordered = false;
  searchValue = "";
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  paymentAddressInnerGridLists = [
    {
      mailCode: 'Mail Code',
      nameOnCheck: 'Name on Check',
      nameOnEnvelope: 'Name on Envelope',
      paymentMethodCode: 'Payment Method',
      paymentRunDateMonthly: 'Payment Run Date',
      acceptsCombinedPaymentsFlag: 'Accept Combined Payments?',
      acceptsReportsFlag: 'Accepts Reports?',
      address1: 'Address 1',
      address2: 'Address 2',
      cityCode: 'City',
      state: 'State',
      zip: 'Zip',
      specialHandlingDesc: 'Special Handling',
      effectiveDate: 'Effective Dates',
      creatorId: 'By'
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
  constructor(private readonly paymentsFacade: PaymentsFacade,
    private readonly paymentBillingFacade: BillingAddressFacade,
    private readonly vendorcontactFacade: VendorContactsFacade,
    private route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private readonly lovFacade: LovFacade,
    public readonly  intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider)
    { }


  ngOnInit(): void {
    this.lovFacade.getVendorPaymentRunDatesLovs();
    this.lovFacade.getVendorPaymentMethodLovs();
    this.lovFacade.getYesOrNoLovs();
    this.loadVendorPaymentRunDatesLovs()
    this.loadVenderPaymentMethodsLovs();
    this.loadYesOrNoLovs();
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
  public rowClass = (args:any) => ({
    "table-row-disabled": (args.dataItem.activeFlag != StatusFlag.Yes),
  });
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
    this.filters = JSON.stringify(stateData.filter?.filters)
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.setGridState(stateData);
    this.loadPaymentsAddressListGrid();
  }

  loadPaymentsAddressListGrid() {
    const paymentAddressListParams = {
      vendorTypeCode: this.tabCode,
      skipcount: this.state.skip ?? 0,
      maxResultCount: this.state.take ?? 0,
      sort: this.sortValue,
      sortType: this.sortType,
      vendorId: this.vendorId,
      isShowHistoricalData: this.isShowHistoricalData,
      filters: this.filters
    };

    this.paymentBillingFacade.loadPaymentsAddressListGrid(paymentAddressListParams);
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

  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    filterService.filter({
        filters: [{
          field: field,
          operator: "eq",
          value:value.lovCode
      }],
        logic: "or"
    });
  }

  private loadYesOrNoLovs() {
    this.yesOrNoLov$
    .subscribe({
      next: (data: any) => {
        this.yesOrNoLovs=data;
      }
    });
  }

  private loadVenderPaymentMethodsLovs() {
    this.paymentMethodVendorlov$
    .subscribe({
      next: (data: any) => {
        this.paymentMethodVendorlovs=data;
      }
    });
  }

  private loadVendorPaymentRunDatesLovs() {
    this.paymentRunDatelov$
    .subscribe({
      next: (data: any) => {
        this.paymentRunDatelovs=data;
      }
    });
  }

  public setGridState(stateData: any): void {
    this.state = stateData;

    const filters = stateData.filter?.filters ?? [];

    for (let val of filters) {
      if (val.field === 'effectiveDate') {
        this.intl.formatDate(val.value, this.dateFormat);
      }
    }
    const filterList = this.state?.filter?.filters ?? [];
    this.filters = JSON.stringify(filterList);
    this.filteredBy = filterList.toString();

    if (filters.length > 0) {
      const filterListData = filters.map((filter:any) => this.paymentAddressInnerGridLists[filter?.filters[0]?.field]);
      this.isFiltered = true;
      this.filteredBy = filterListData.toString();
      this.cdr.detectChanges();
    }
    else {
      this.isFiltered = false;
    }

    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? "";
    this.sortType = stateData.sort[0]?.dir ?? "";
    this.state = stateData;
    this.sortColumn = this.paymentAddressInnerGridLists[stateData.sort[0]?.field];
    this.sortDir = "";
    if(this.sort[0]?.dir === 'asc'){
      this.sortDir = 'Ascending';
    }
    if(this.sort[0]?.dir === 'desc'){
      this.sortDir = 'Descending';
    }
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filters = JSON.stringify(filter);
  }
}
