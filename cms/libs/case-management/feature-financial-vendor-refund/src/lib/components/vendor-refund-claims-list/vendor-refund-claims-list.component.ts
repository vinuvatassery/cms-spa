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
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FinancialClaimsFacade, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade, UserManagementFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FilterService, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject, Subscription } from 'rxjs';
 
@Component({
  selector: 'cms-vendor-refund-claims-list',
  templateUrl: './vendor-refund-claims-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorRefundClaimsListComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('filterResetConfirmationDialogTemplate', { read: TemplateRef })
  filterResetConfirmationDialogTemplate!: TemplateRef<any>;
  paymentStatusLovSubscription!:Subscription;
  @ViewChild(GridComponent) grid!: GridComponent;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isClaimsLoaderShow = false;
  selectedTpaClaims:any[] =[]
  /** Constructor **/
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() vendorId: any;
  @Input() clientId: any;
  @Output() loadVendorRefundProcessListEvent = new EventEmitter<any>();
  @Output() onProviderNameClickEvent = new EventEmitter<any>()
  public state!: State;
  @Input() claimsListData$: any;
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
  @Input() tpaPaymentReqIds:any[]=[]
  providerDetailsDialog: any;
  gridClaimsDataSubject = new Subject<any>();
  gridClaimsData$ = this.gridClaimsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  tpaData$ = this.financialVendorRefundFacade.tpaData$;
  filterResetDialog: any;
  paymentStatusCode =null;
  paymentStatusType:any;
  paymentStatuses$ = this.lovFacade.paymentStatus$;
  @Output() claimsCount = new EventEmitter<any>();
  cliams:any[]=[];
  tpaVendorRefundProfilePhotoSubject = new Subject();
  tpaDataListSubscription = new Subscription();;
  tpaVendorRefundProfilePhoto$ = this.financialVendorRefundFacade.tpaVendorRefundProfilePhotoSubject
  constructor( private readonly financialClaimsFacade: FinancialClaimsFacade, private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,private dialogService: DialogService,   private readonly lovFacade : LovFacade,
    private readonly userManagementFacade: UserManagementFacade,
    private readonly cdr: ChangeDetectorRef){
 
  }
 
 
  ngOnInit(): void {
    this.lovFacade.getPaymentStatusLov()
    this.paymentStatusSubscription();
    this.lovFacade.getPaymentStatusLov()
    this.paymentStatusSubscription();
    this.selectedTpaClaims =  (this.tpaPaymentReqIds && this.tpaPaymentReqIds.length >0)?
    this.tpaPaymentReqIds : this.selectedTpaClaims
    this.loadRefundClaimsListGrid();
    this.tpaDataListSubscription = this.tpaData$.subscribe((res:any)=>{
      this.claimsCount.emit(this.selectedTpaClaims.length)
      this.cliams=res.data;
  })
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: 5,
      sort: this.sort,
    };
 
    this.loadRefundClaimsListGrid();
  }
 
 
  loadClaimsList (  
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
    ) {
      this.isClaimsLoaderShow = true;
      const gridDataRefinerValue = {
        skipCount: skipCountValue,
        pagesize: maxResultCountValue,
        sortColumn: sortValue,
        sortType: sortTypeValue,
      };
    this.loadClaimsListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
 
  dataStateChange(stateData: any): void {
   
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    
    this.loadRefundClaimsListGrid();
 
  }
 
  selectedKeysChange(selection: any) {  
      this.selectedTpaClaims = selection;
      this.claimsCount.emit(this.selectedTpaClaims.length)    
  }
  pageSelectionChange(data: any) {
    this.filterResetDialog.close();
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadRefundClaimsListGrid();
  }
 
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  loadRefundClaimsGrid(data: any) {
 
    this.financialVendorRefundFacade.loadTPARefundList(data);
  }
  private loadRefundClaimsListGrid(): void {
    this.loadClaimsProcess(
      this.vendorId,
      this.clientId,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadClaimsProcess(
    vendorId: string,
    clientId: number,
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
   
    const gridDataRefinerValue = {
      vendorId: vendorId,
      clientId: clientId,
      skipCount: skipCountValue,
      pageSize: maxResultCountValue,
      sort: sortValue,
      sortType: sortTypeValue,
      filter : this.state?.["filter"]?.["filters"] ?? []
    };
    this. loadRefundClaimsGrid(gridDataRefinerValue);
    this.gridDataHandle();
 
  }
  gridDataHandle() {
    this.tpaData$.subscribe((data: GridDataResult) => {
     
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridClaimsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isClaimsLoaderShow = false;
      }
    });
    this.isClaimsLoaderShow = false;
 
  }

  resetButtonClosed(result: any) {
    if (result) {
 
      this.filterResetDialog.close();
    }
  }
 

  paymentStatusSubscription()
  {
    this.paymentStatusLovSubscription = this.paymentStatuses$.subscribe(data=>{
      this.paymentStatusType = data;
    });
  }
 
  ngOnDestroy(): void {
    this.paymentStatusLovSubscription.unsubscribe();
    this.tpaDataListSubscription?.unsubscribe();
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
    if(field == "paymentStatusCode"){
      this.paymentStatusCode = value;
    }
  }
 
    
  onProviderNameClick(event:any){
    this.onProviderNameClickEvent.emit(event)
  }


}