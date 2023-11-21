/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import {GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';

@Component({
  selector: 'cms-vendor-refund-client-claims-list',
  templateUrl: './vendor-refund-client-claims-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorRefundClientClaimsListComponent implements OnInit, OnChanges {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @ViewChild('filterResetConfirmationDialogTemplate', { read: TemplateRef })
  filterResetConfirmationDialogTemplate!: TemplateRef<any>;
  @ViewChild(GridComponent) grid!: GridComponent;
  isClientClaimsLoaderShow = false;
  /** Constructor **/
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() vendorId: any;
  @Input() clientId: any;
  @Input()refundType:any;
  @Output() loadVendorRefundProcessListEvent = new EventEmitter<any>();
  @Output() claimsCount = new EventEmitter<any>();
  public state!: State;
  @Input() clientClaimsListData$: any;
  @Output() loadClientClaimsListEvent = new EventEmitter<any>();
  sortColumn = 'clientId';
  sortDir = 'Ascending';
  columnsReordered = false;
  filterResetDialog: any;
  filteredBy = '';
  paymentStatusType:any;
  public selectedClaims: any[] = [];
  paymentStatusCode =null
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
@Input() selectedpharmacyClaimsPaymentReqIds:any[]=[]
selectedPharmacyClaims:any[]=[]
  isRefundGridClaimShow=false;
private clientClaimsListDataSubject =  new Subject<any>();
  clientClaimListData$ = this.clientClaimsListDataSubject.asObservable();
  clientclaimsData$=this.financialVendorRefundFacade.clientClaimsListData$

  gridClientClaimsDataSubject = new Subject<any>();
  gridClientClaimsData$ = this.gridClientClaimsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
   
  constructor(
    public financialVendorRefundFacade:FinancialVendorRefundFacade,private dialogService: DialogService
  ) { }
  ngOnInit(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.selectedPharmacyClaims =  (this.selectedpharmacyClaimsPaymentReqIds && this.selectedpharmacyClaimsPaymentReqIds.length >0)?
    this.selectedpharmacyClaimsPaymentReqIds : this.selectedPharmacyClaims
    this.loadRefundClaimsListGrid();
    this.clientclaimsData$.subscribe((res:any)=>{
      this.claimsCount.emit(this.selectedPharmacyClaims.length)
  })
  }

  selectedKeysChange(selection: any) {
    this.selectedPharmacyClaims = selection;
    this.claimsCount.emit(this.selectedPharmacyClaims.length)
    
  }
  resetFilterClicked(action: any,) {
    if (action) {
      this.selectedClaims=[]
      this.clearSelection();
      this.loadRefundClaimsListGrid();
     this.filterResetDialog.close();
    }
  }
  resetButtonClosed(result: any) {
    if (result) {
 
      this.filterResetDialog.close();
    }
  }
  private clearSelection(): void {  
    if (this.grid) {
        this.selectedPharmacyClaims = [];
    }
  }
  openResetDialog( template: TemplateRef<unknown>)
  {
    this.filterResetDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadRefundClaimsListGrid();
  }
  dataStateChange(stateData: any): void {
    this.openResetDialog(this.filterResetConfirmationDialogTemplate);
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
   this.loadRefundClaimsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() { 
    this. clientclaimsData$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.clientClaimsListDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isClientClaimsLoaderShow = false;
      }
    });
    this.isClientClaimsLoaderShow = false;

  }
  private loadRefundClaimsListGrid(): void {
    this.loadClaimsProcess(
      this.vendorId,
      this.clientId,
      this.refundType,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadClaimsProcess(
    vendorId: string,
    clientId: number,
    refundType: string,
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isClientClaimsLoaderShow = true;
    const gridDataRefinerValue = {
      vendorId: vendorId,
      clientId: clientId,
      refundType : refundType,
      skipCount: skipCountValue,
      pageSize: maxResultCountValue,
      sort: sortValue,
      sortType: sortTypeValue,
      filter : this.state?.["filter"]?.["filters"] ?? []
    };
    this. loadRefundClaimsGrid(gridDataRefinerValue);
    this.gridDataHandle();
  
  }
  loadRefundClaimsGrid(data: any) {
    this.financialVendorRefundFacade.loadRefundClaimsListGrid(data);
  }
}
