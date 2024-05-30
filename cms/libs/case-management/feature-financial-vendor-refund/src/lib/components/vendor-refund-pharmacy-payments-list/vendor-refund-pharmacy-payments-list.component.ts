/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade, UserManagementFacade } from '@cms/system-config/domain';
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'cms-vendor-refund-pharmacy-payments-list',
  templateUrl: './vendor-refund-pharmacy-payments-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorRefundPharmacyPaymentsListComponent implements OnInit, OnChanges, OnDestroy {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isClaimsLoaderShow = false;
  /** Constructor **/
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() vendorId: any;
  @Input() clientId: any;
  @Input() refundType: any;
  @Output() loadVendorRefundProcessListEvent = new EventEmitter<any>();
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  public state!: State;
  @Input() claimsListData$: any;
  private clientClaimsListDataSubject =  new Subject<any>();
  clientClaimListData$ = this.clientClaimsListDataSubject.asObservable();
  clientclaimsData$=this.financialVendorRefundFacade.clientClaimsListData$

  @Output() loadClaimsListEvent = new EventEmitter<any>();

  sortColumn = 'vendorName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  selectedPharmacyClaims:any[]=[]
  gridClaimsDataSubject = new Subject<any>();
  gridClaimsData$ = this.gridClaimsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  gridVendorsRefundDataSubject = new Subject<any>();
  gridVendorsRefundData$ = this.gridVendorsRefundDataSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  vendorRefundPaymentListSubject = new Subject();;
  pharmacyPurchaseProfileSubscription = new Subscription();
  vendorRefundPaymentListProfilePhoto$ = this.financialVendorRefundFacade.vendorRefundPaymentListProfilePhotoSubject
  @Output() selectedClaimsChangeEvent = new EventEmitter<any>();
  selectedPaymentRequestType: any = '';
  selectedPaymentMethod: any = '';
  paymentRequestTypeData :any[] =[];
  paymentRequestType$ = this.lovFacade.paymentRequestType$;
  paymentType$ = this.lovFacade.paymentMethodType$;
  paymentTypeData :any[] =[];

  deliveryMethodLov$ = this.lovFacade.deliveryMethodLov$;
  deliveryMethodLovData: any[] = [];
  selectedDeliveryMethod: any = '';

  paymentStatus$ = this.lovFacade.paymentStatus$;
  paymentStatusLovData :any[] = [];
  selectedPaymentStatus: any = ''


  constructor(
    public financialVendorRefundFacade:FinancialVendorRefundFacade,
    private readonly userManagementFacade: UserManagementFacade,
    private readonly cdr: ChangeDetectorRef,
    private lovFacade: LovFacade,
  ) { }

  ngOnInit(): void {
    this.lovFacade.getCoPaymentRequestTypeLov();
    this.lovFacade.getPaymentMethodLov();
    this.getPaymentRequestTypeLov();
    this.getPaymentTypeLov();
    this.loadFinancialRecentRefundListGrid();   
    this.lovFacade.getDeliveryMethodLovs(); 
    this.getDeliveryMethodLovs();
    this.lovFacade.getPaymentStatusLov();
    this.getPaymentStatusLovs();
  }

  selectedKeysChange(selection: any) {

    this.selectedClaimsChangeEvent.emit(selection)
    this.selectedPharmacyClaims = selection;
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadFinancialRecentRefundListGrid()
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.loadFinancialRecentRefundListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialRecentRefundListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.pharmacyPurchaseProfileSubscription = this.clientclaimsData$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.clientClaimsListDataSubject.next(this.gridDataResult);
    });
  }

  ngOnDestroy(): void {
    this.pharmacyPurchaseProfileSubscription?.unsubscribe();
  }
  
  private loadFinancialRecentRefundListGrid(): void {
    this.loadRefundProcess(
      this.vendorId,
      this.clientId,
      this.refundType,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadRefundProcess(
    vendorId: string,
    clientId: number,
    refundType: string,
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    const gridDataRefinerValue = {
      vendorId: vendorId,
      clientId: clientId,
      refundType: refundType,
      skipCount: skipCountValue,
      pageSize: maxResultCountValue,
      sort: sortValue,
      sortType: sortTypeValue,
      filter : this.state?.["filter"]?.["filters"] ?? []
    };
    this. loadRecentRefundClaimsGrid(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadRecentRefundClaimsGrid(data: any) {
    this.financialVendorRefundFacade.loadRefundClaimsListGrid(data);
  }
  onProviderNameClick(event:any){
    this.onProviderNameClickEvent.emit(event.paymentRequestId)
  }

  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    filterService.filter({
        filters: [{
          field: field,
          operator: "eq",
          value:value.lovDesc
      }],
        logic: "or"
    });
  }

  getPaymentRequestTypeLov(){
    this.paymentRequestType$.subscribe({
        next: (data: any) => {
          this.paymentRequestTypeData=data;
        }
      });
  }

  getPaymentTypeLov(){
    this.paymentType$.subscribe({
        next: (data: any) => {
          this.paymentTypeData=data;
        }
      });
  }

  getDeliveryMethodLovs() {
    this.deliveryMethodLov$.subscribe({
      next: (data: any) => {
        this.deliveryMethodLovData = data;
      }
    });
  }

  onPaymentListGridFilterChange(filterdata: any){
    const paymentMethodDesc = filterdata.filters.find((item: any) => { return item.filters.some((filter: any) => filter.field == 'paymentMethodDesc'); });
    const paymentTypeDesc = filterdata.filters.find((item: any) => { return item.filters.some((filter: any) => filter.field == 'paymentTypeDesc'); });
    const rxqtype = filterdata.filters.find((item: any) => { return item.filters.some((filter: any) => filter.field == 'rxqtype'); });
    const paymentStatusDesc = filterdata.filters.find((item: any) => { return item.filters.some((filter: any) => filter.field == 'paymentStatusDesc'); });

    if(!paymentMethodDesc) this.selectedPaymentMethod = '';
    if(!paymentTypeDesc) this.selectedPaymentRequestType = '';
    if(!rxqtype) this.selectedDeliveryMethod = ''
    if(!paymentStatusDesc) this.selectedPaymentStatus = ''
    
    this.state.filter = filterdata;
  }

  getPaymentStatusLovs() {
    this.paymentStatus$.subscribe({
      next: (data: any) => {
        this.paymentStatusLovData = data;
      }
    });
  }

}
