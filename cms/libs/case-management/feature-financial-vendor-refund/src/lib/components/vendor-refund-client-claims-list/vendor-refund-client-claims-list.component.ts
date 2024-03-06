/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  @Input() confirmClicked: any;
  public state!: State;
  @Input() clientClaimsListData$: any;
  @Output() loadClientClaimsListEvent = new EventEmitter<any>();
  @Output() selectedVendorRefundsListEvent = new EventEmitter<any>();
  selectedPharmacyClaimsPayments :any[] =[]
  @Input() isEdit = false
  @Output() selectedClaimsChangeEvent = new EventEmitter<any>();
  sortColumn = 'clientId';
  sortDir = 'Ascending';
  columnsReordered = false;
  filterResetDialog: any;
  filteredBy = '';
  gridState : any;
  paymentStatusType:any;
  public selectedClaims: any[] = [];
  paymentStatusCode =null
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  gridData: any;
@Input() selectedpharmacyClaimsPaymentReqIds:any[]=[]
selectedPharmacyClaims:any[]=[]
public selectedVendorRefunds: any = [];
  isRefundGridClaimShow=false;
private clientClaimsListDataSubject =  new Subject<any>();
  clientClaimListData$ = this.clientClaimsListDataSubject.asObservable();
  clientclaimsData$=this.financialVendorRefundFacade.clientClaimsListData$;
  pharmacyClaimsListProfile$ = this.financialVendorRefundFacade.pharmacyClaimsListProfileSubject;

  gridClientClaimsDataSubject = new Subject<any>();
  gridClientClaimsData$ = this.gridClientClaimsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  constructor(
    public financialVendorRefundFacade:FinancialVendorRefundFacade,
    private dialogService: DialogService,private readonly cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[2]?.value,
      sort: this.sort,
    };
    this.selectedPharmacyClaimsPayments =  (this.selectedpharmacyClaimsPaymentReqIds && this.selectedpharmacyClaimsPaymentReqIds.length >0)?
    this.selectedpharmacyClaimsPaymentReqIds : this.selectedPharmacyClaimsPayments
    this.loadRefundClaimsListGrid();
    this.clientclaimsData$.subscribe((res:any)=>{
      this.claimsCount.emit(this.selectedPharmacyClaimsPayments.length)
  })
  }
  resetFilterClicked(action: any,) {
    if (action) {
      this.setGridDataState();
      this.selectedClaims=[];
      this.clearSelection();
      this.loadRefundClaimsListGrid();
     this.filterResetDialog.close();
    }
  }
  resetButtonClosed(result: any) {
    if (result) {
      this.state.sort = [];
      this.cdr.detectChanges();
      this.filterResetDialog.close();
    }
  }
  private clearSelection(): void {  
        this.selectedPharmacyClaims = [];
        this.selectedPharmacyClaimsPayments=[]
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
      take: this.pageSizes[2]?.value,
      sort: this.sort,
    };
    this.loadRefundClaimsListGrid();
    if(this.confirmClicked) {
      this.selectedVendorRefundsListEvent.emit(this.selectedPharmacyClaims)
    }
    this.cdr.detectChanges();
  }
  dataStateChange(stateData: any): void {
    if(stateData.filter?.filters.length > 0)
    {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      if(stateFilter.field ==="ndc"){
        stateFilter.value = stateFilter.value.replace(/-/g, "")
      }
      this.filter = stateFilter.value;
    }
    this.openResetDialog(this.filterResetConfirmationDialogTemplate);
   this.gridState = stateData;
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
      this.gridData = data;
      if(this.gridData.data != null){
      this.selectedPharmacyClaims = this.gridData.data.filter((i: any) =>  this.selectedPharmacyClaimsPayments.includes( i.perscriptionFillId));
      }
      this.gridDataResult = data;
      this.clientClaimsListDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isClientClaimsLoaderShow = false;
      }
    });
    this.isClientClaimsLoaderShow = true;

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
    this.cdr.detectChanges();
    this. loadRefundClaimsGrid(gridDataRefinerValue);
    this.gridDataHandle();
  
  }
  loadRefundClaimsGrid(data: any) {
    this.financialVendorRefundFacade.loadRefundClaimsListGrid(data);
  }
  selectedRXKeysChange(selection: any[]) {
    this.selectedPharmacyClaims = this.gridData.data.filter((i: any) => selection.includes( i.perscriptionFillId));
  
   const uniqueOriginalWarrants = [...new Set(this.selectedPharmacyClaims.map(obj => obj.warrantNbr))];
   if(uniqueOriginalWarrants.length>1)
   {
     this.financialVendorRefundFacade.errorShowHideSnackBar("Select a claim with Same warrant number")
     this.claimsCount.emit(0)
     this.selectedClaimsChangeEvent.emit([])
     this.selectedPharmacyClaims =[]
     this.selectedPharmacyClaimsPayments=[]
     this.cdr.detectChanges();
   }
     if(uniqueOriginalWarrants.length<=1)
       {
         this.claimsCount.emit(this.selectedPharmacyClaims.length)
         this.selectedClaimsChangeEvent.emit(selection)
       }   

  }
  setGridDataState(){
    this.sort = this.gridState.sort;
    this.sortValue = this.gridState.sort[0]?.field ?? this.sortValue;
    this.sortType = this.gridState.sort[0]?.dir ?? 'asc';
    this.state = this.gridState;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
  }
}
