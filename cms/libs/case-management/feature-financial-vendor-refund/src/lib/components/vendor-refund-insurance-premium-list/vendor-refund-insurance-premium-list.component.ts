/** Angular **/
import {
  AfterViewInit,
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
import { SelectableDirective } from '@progress/kendo-angular-dropdowns';
import { FilterService, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';

@Component({
  selector: 'cms-vendor-refund-insurance-premium-list',
  templateUrl: './vendor-refund-insurance-premium-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorRefundInsurancePremiumListComponent  implements OnInit, OnChanges {
  @ViewChild('filterResetConfirmationDialogTemplate', { read: TemplateRef })
  filterResetConfirmationDialogTemplate!: TemplateRef<any>;
 
  @ViewChild(GridComponent) grid!: GridComponent;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  isClientClaimsLoaderShow = false;
  /** Constructor **/
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  public state!: State;
  @Input() vendorId: any;
  @Input() clientId: any;
  @Output() loadVendorRefundProcessListEvent = new EventEmitter<any>();
 @Input() isEdit = false
 @Input() editPaymentRequestId:any
  @Input() clientClaimsListData$: any;
  @Output() loadClientClaimsListEvent = new EventEmitter<any>();
  paymentStatusType:any;
  public selectedClaims: any[] = [];
  paymentStatusCode =null
  sortColumn = 'clientId';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  selectedInsuranceClaims :any[] =[]
  gridClientClaimsDataSubject = new Subject<any>();
  gridClientClaimsData$ = this.gridClientClaimsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  financialPremiumsProcessData$ = this.financialVendorRefundFacade.financialPremiumsProcessData$;
  premiumsListData$ =   this.financialVendorRefundFacade.premiumsListData$;
  @Input() selectedInsurancePremiumIds:any[]  =[]
  filterResetDialog: any;
  constructor( private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,private dialogService: DialogService)
  {
 
  }
  selectedKeysChange(selection: any) {
    this.selectedInsuranceClaims = selection;
  }
  ngOnInit(): void {
    
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.selectedInsuranceClaims =  (this.selectedInsurancePremiumIds && this.selectedInsurancePremiumIds.length >0)?
                                    this.selectedInsurancePremiumIds : this.selectedInsuranceClaims
                                     
    this.loadRefundClaimsListGrid();
    
  }
  ngOnChanges(): void {  
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadRefundClaimsListGrid();
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

  loadRefundClaimsGrid(data: any) {
    if(this.isEdit){
      this.financialVendorRefundFacade.getInsuranceRefundEditInformation(this.editPaymentRequestId,data)
    }else{
      this.financialVendorRefundFacade.loadMedicalPremiumList(data);

    }
  }
  
  dataStateChange(stateData: any): void {
    debugger
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
    this.isClientClaimsLoaderShow = true;
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
    this.financialPremiumsProcessData$.subscribe((data: GridDataResult) => {
      
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridClientClaimsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isClientClaimsLoaderShow = false;
      }
    });
    this.isClientClaimsLoaderShow = false;

  }
  filterChange(filter: CompositeFilterDescriptor): void {  
    this.filterData = filter;
 
  }
  openResetDialog( template: TemplateRef<unknown>)
  {
    this.filterResetDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  resetButtonClosed(result: any) {
    if (result) {
 
      this.filterResetDialog.close();
    }
  }
  
  resetFilterClicked(action: any,) {
    if (action) {
      this.selectedClaims=[]
      this.clearSelection();
      this.loadRefundClaimsListGrid();
     this.filterResetDialog.close();
    }
  }
  private clearSelection(): void {  
    if (this.grid) {
        this.selectedInsuranceClaims = [];
    }
  }
  

}
