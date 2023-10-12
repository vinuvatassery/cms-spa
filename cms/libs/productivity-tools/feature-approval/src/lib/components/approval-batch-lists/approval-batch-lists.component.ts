import { Component, EventEmitter, OnInit, OnChanges,Input, Output, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
@Component({
  selector: 'productivity-tools-approval-batch-lists',
  templateUrl: './approval-batch-lists.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalBatchListsComponent implements OnInit, OnChanges{
  @Input() approvalId?: string | null;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchDetailPaymentsList$: any;
  @Input() batchDetailModalSourceList:any;
  @Input() selectedPaymentType:any;
  @Output() closeViewPaymentsBatchClickedEvent = new EventEmitter();
  @Output() loadBatchDetailPaymentsListEvent = new EventEmitter<any>();
  @Output() batchModalSaveClickedEvent = new EventEmitter<any>();
  public state!: State;
  isBatchDetailPaymentsGridLoaderShow = false;
  sortColumn = 'paymentNbr';
  sortDir = 'Ascending';
  sortColumnName = '';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  batchId?: string | null;
  index: number = 0;
  tAreaSendBackNotesMaxLength:any = 100;
  approveBatchCount:any=0;
  sendbackBatchCount:any=0;
  approveStatus:string="APPROVED";
  sendbackStatus:string="SEND_BACK";
  sendbackNotesRequireMessage:string = "Send Back Note is required.";

  gridBatchDetailPaymentsDataSubject = new Subject<any>();
  gridBatchDetailPaymentsData$ = this.gridBatchDetailPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  gridColumns: { [key: string]: string } = {
    paymentNbr: 'Item #',
    invoiceNbr: 'Invoice ID',
    vendorName: 'Provider Name',
    amountDue: 'Total Due',
    paymentMethodCode: 'Payment Method',
    serviceCount: 'Service Count',
    clientFullName: 'Client Name',
    nameOnInsuranceCard: 'Name on Primary Insurance Card',
    clientId: 'Client ID',
    paymentStatusCode: 'Payment Status',
  };
  paymentMethods = ['CHECK', 'ACH', 'SPOTS'];
  paymentStatusList = [
    'SUBMITTED',
    'PENDING_APPROVAL',
    'DENIED',
    'MANAGER_APPROVED',
    'PAYMENT_REQUESTED',
    'ONHOLD',
    'FAILED',
    'PAID',
  ];
  paymentMethodFilter = '';
  paymentTypeFilter = '';
  paymentStatusFilter = '';
  public width = "100%";
  public height = "100%";
  public formUiStyle: UIFormStyle = new UIFormStyle();

  constructor(private readonly cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.tAreaVariablesInitiation(this.batchDetailModalSourceList);
    this.getCurrentBatchId();
    this.loadBatchPaymentListGrid();
    this.approveAndSendbackCount();
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[2]?.value,
      sort: this.sort,
    };
    this.loadBatchPaymentListGrid();
  }

  getCurrentBatchId(){
    let index = this.batchDetailModalSourceList.findIndex((x: any) => x.approvalId === this.approvalId);
    if (index >= 0) {
      this.index = index;
      this.batchId = this.batchDetailModalSourceList[index].paymentRequestBatchId;
    }
  }

  onScrollViewItemChanged(args:any){
    this.index = args.index;
    this.batchId = args.item.paymentRequestBatchId;
    this.loadBatchPaymentListGrid();
  }

  sendBackNotesChange(item: any) {
    this.calculateCharacterCount(item);
    this.assignDataToSourceList(item, this.index);
  }
  
  private tAreaVariablesInitiation(item: any) {
      this.calculateCharacterCount(item);
  }

  calculateCharacterCount(item: any) {
    let tAreaSendBackNotesCharactersCount = item.sendBackNotes
      ? item.sendBackNotes.length
      : 0;
      item.tAreaCessationCounter = `${tAreaSendBackNotesCharactersCount}/${this.tAreaSendBackNotesMaxLength}`;
  }

  approveAndSendbackCount()
  {
      this.approveBatchCount=0;
      this.sendbackBatchCount=0;
      this.batchDetailModalSourceList.forEach((item: any, index: number) => {        
      this.approveBatchCount = item.batchStatus == this.approveStatus ? this.approveBatchCount + 1 : this.approveBatchCount;
      this.sendbackBatchCount = item.batchStatus == this.sendbackStatus ? this.sendbackBatchCount + 1 : this.sendbackBatchCount;
    });
  }

  onApproveClicked(item: any, index: any)
  {
    item.approveButtonDisabled=false;
    item.sendBackButtonDisabled=true;
    item.sendBackNotes="";
    if(item.batchStatus === undefined || item.batchStatus === '' || item.batchStatus === null)
    {
      item.batchStatus=this.approveStatus;
    } 
    else if(item.batchStatus == this.approveStatus)   
    {
      item.batchStatus="";
      item.sendBackNotesInValidMsg="";
      item.sendBackNotesInValid = false;
      item.sendBackButtonDisabled=true;
    }
    else if(item.batchStatus == this.sendbackStatus) 
    {
      item.batchStatus=this.approveStatus;
      item.sendBackNotesInValidMsg="";
      item.sendBackNotesInValid = false;  
      item.sendBackButtonDisabled=true;
    }
    this.sendBackNotesChange(item);
    this.assignDataToSourceList(item, index);
    this.approveAndSendbackCount();
  }

  onSendbackClicked(item: any, index: any)
  {
    item.approveButtonDisabled=true;
    item.sendBackButtonDisabled=false;
    if(item.batchStatus === undefined || item.batchStatus === '' || item.batchStatus === null)
    {
      item.batchStatus=this.sendbackStatus;  
      item.sendBackNotesInValidMsg= this.sendbackNotesRequireMessage;
      item.sendBackNotesInValid = true;    
    }   
    else if(item.batchStatus == this.sendbackStatus)   
    {
      item.batchStatus="";
      item.sendBackNotesInValidMsg="";
      item.sendBackNotesInValid = false;
      item.sendBackButtonDisabled=true;
    }
    else
    {
      item.batchStatus=this.sendbackStatus;
      item.sendBackNotesInValidMsg=this.sendbackNotesRequireMessage;
      item.sendBackNotesInValid = true;
      item.sendBackButtonDisabled=false;
    } 
   
    this.sendBackNotesChange(item);    
    this.assignDataToSourceList(item, index);
    this.approveAndSendbackCount(); 
  }

  assignDataToSourceList(dataItem: any, index : any) {
          this.batchDetailModalSourceList[index].sendBackNotesInValidMsg = dataItem?.sendBackNotesInValidMsg;
          this.batchDetailModalSourceList[index].sendBackNotesInValid = dataItem?.sendBackNotesInValid;
          this.batchDetailModalSourceList[index].tAreaCessationCounter = dataItem?.tAreaCessationCounter;          
          this.batchDetailModalSourceList[index].batchStatus = dataItem?.batchStatus;
          this.batchDetailModalSourceList[index].sendBackNotes = dataItem?.sendBackNotes;
  }

  onBatchModalSaveClicked(){
    this.batchModalSaveClickedEvent.emit(this.batchDetailModalSourceList);
  }

  closeViewPaymentsBatchClicked() {
    this.closeViewPaymentsBatchClickedEvent.emit(true);
  }

  private loadBatchPaymentListGrid(): void {
    this.loadBatchPayment(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  loadBatchPayment(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isBatchDetailPaymentsGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: this.sortColumn ?? 'paymentNbr',
      sortType: sortTypeValue ?? 'asc',
      filter: this.filter,
    };
    let batchId = this.batchId;
    let selectedPaymentType = this.selectedPaymentType;
    this.loadBatchDetailPaymentsListEvent.emit({gridDataRefinerValue, batchId, selectedPaymentType});
    this.gridDataHandle();
  }

  gridDataHandle() {
    this.batchDetailPaymentsList$.subscribe((data: any) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridBatchDetailPaymentsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isBatchDetailPaymentsGridLoaderShow = false;
      }
    });
    this.isBatchDetailPaymentsGridLoaderShow = false;
  }

  onChange(data: any) {
    this.defaultGridState();
    const stateData = this.state;
    this.dataStateChange(stateData);
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[2]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumn = stateData.sort[0]?.field;
    this.sortColumnName = this.gridColumns[this.sortColumn];
    this.filter = stateData?.filter?.filters;
    this.loadBatchPaymentListGrid();
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentMethodCode') {
      this.paymentMethodFilter = value;
    } else if (field === 'paymentTypeCode') {
      this.paymentTypeFilter = value;
    } else if (field === 'paymentStatusCode') {
      this.paymentStatusFilter = value;
    }

    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'or',
    });
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchPaymentListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
}
