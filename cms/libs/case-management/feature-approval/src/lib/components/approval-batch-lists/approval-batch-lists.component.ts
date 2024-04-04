import {
  Component,
  EventEmitter,
  OnInit,
  OnChanges,
  Input,
  Output,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {
  CompositeFilterDescriptor,
  State,
  SortDescriptor
} from '@progress/kendo-data-query';
import { Subject, BehaviorSubject, first, Subscription} from 'rxjs';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
import { PendingApprovalPaymentTypeCode } from '@cms/case-management/domain';
import { UserLevel, UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'productivity-tools-approval-batch-lists',
  templateUrl: './approval-batch-lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalBatchListsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() approvalId?: string | null;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() batchDetailPaymentsList$: any;
  @Input() batchDetailModalSourceList: any;
  @Input() selectedPaymentType: any;
  @Input() paymentStatusLovList: any;
  @Input() paymentMethodLovList: any;
  @Input() isSendBackMode: any;
  @Input() userLevel: any;
  @Input() approvalPaymentProfilePhoto$!: any;
  @Output() closeViewPaymentsBatchClickedEvent = new EventEmitter();
  @Output() loadBatchDetailPaymentsListEvent = new EventEmitter<any>();
  @Output() batchModalSaveClickedEvent = new EventEmitter<any>();
  readonly paymentTypeCode = PendingApprovalPaymentTypeCode;
  readonly UserLevel = UserLevel;
  public state!: State;
  isBatchDetailPaymentsGridLoaderShow = new BehaviorSubject<boolean>(true);
  sortColumn = 'itemNbr';
  sortDir = 'Ascending';
  sortColumnName = '';
  sortType = 'asc';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  sort: SortDescriptor[] = [{
    field: this.sortColumn,
    dir: 'asc',
  }];
  batchDetailPaymentsList: any;
  batchId?: string | null;
  index: number = 0;
  batch: any;
  tAreaSendBackNotesMaxLength: any = 200;
  approveBatchCount: any = 0;
  sendbackBatchCount: any = 0;
  sendBackPaymentCount: any = 0;
  approveStatus: string = 'APPROVED';
  sendbackStatus: string = 'SEND_BACK';
  sendbackNotesRequireMessage: string = 'Send Back Note is required.';
  atleastOnePaymentRequireMessage: string = 'Selection of at least one payment is required.';

  gridBatchDetailPaymentsDataSubject = new Subject<any>();
  gridBatchDetailPaymentsData$ =
    this.gridBatchDetailPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  columns: any; 
  vendorNameField: any;
  paymentMethodFilter = '';
  paymentStatusFilter = '';
  public width = '100%';
  public height = '100%';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  approvalBatchListSubscription = new Subscription();
  approvalBatchListProfilePhotoSubject = new Subject();

  constructor(private readonly cd: ChangeDetectorRef,) {}

  ngOnInit(): void {
    this.loadColumnsData();
    this.tAreaVariablesInitiation(this.batch);
    if(this.isSendBackMode){
      this.onBatchSendbackClicked(this.batch);
    }
    this.loadBatchPaymentListGrid();    
    this.gridDataHandle();
    this.paymentSelectionDataHandle();
    this.approveAndSendbackCount();
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[2]?.value,
      sort: this.sort,
    };
    this.getCurrentBatchId();
  }

  private loadColumnsData(){
    switch(this.selectedPaymentType){
      case PendingApprovalPaymentTypeCode.InsurancePremium:
        this.vendorNameField = 'Insurance Vendor';
        break;
      case PendingApprovalPaymentTypeCode.TpaClaim:
        this.vendorNameField = 'Provider Name';
        break;
      case PendingApprovalPaymentTypeCode.PharmacyClaim:
        this.vendorNameField = 'Pharmacy Name';
        break;
    }
    
    this.columns = {
      itemNbr: 'Item #',
      invoiceNbr: 'Invoice ID',
      vendorName: this.vendorNameField,
      premiumCount: 'Item Count',
      amountDue: 'Total Due',
      premiumTotalAmount: 'Total Amount',
      paymentMethodCode: 'Payment Method',
      serviceCount: 'Service Count',
      clientFullName: 'Client Name',
      nameOnInsuranceCard: 'Name on Primary Insurance Card',
      clientId: 'Client ID',
      drugName: 'Drug Name',
      ndcCode: 'NDC Code',
      rxQty: 'RX Qty',
      rxType: 'Unit',
      prescriptionTotalAmount: 'Total Amount Paid',
      daySupply: 'Days Supply',
      prescriptionFillDate: 'Fill Date',
      paymentStatusCode: 'Payment Status',
      prescriptionNbr: 'Prescription #',
      pcaCode: 'PCA Code',
      mailCode: 'Mail Code',
    }
  }

  getCurrentBatchId() {
    let index = this.batchDetailModalSourceList.findIndex(
      (x: any) => x.approvalId === this.approvalId
    );
    if (index >= 0) {
      this.index = index;
      this.batchId = this.batchDetailModalSourceList[index].paymentRequestBatchId;
      this.batch = this.batchDetailModalSourceList[index];
    }
  }

  onScrollViewItemChanged(args: any) {
    this.index = args.index;
    this.batchId = args.item.paymentRequestBatchId;
    this.approvalId = args.item.approvalId;
    this.batch = this.batchDetailModalSourceList[this.index];
    this.defaultGridState();
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

  approveAndSendbackCount() {
    this.approveBatchCount = 0;
    this.sendbackBatchCount = 0;
    this.batchDetailModalSourceList.forEach((item: any) => {
      this.approveBatchCount =
        item.batchStatus == this.approveStatus
          ? this.approveBatchCount + 1
          : this.approveBatchCount;
      this.sendbackBatchCount =
        item.batchStatus == this.sendbackStatus
          ? this.sendbackBatchCount + 1
          : this.sendbackBatchCount;
    });
    this.calculateSendBackPaymentCount();
  }

  calculateSendBackPaymentCount(){
    this.sendBackPaymentCount = this.batch?.paymentRequestIds?.length;
  }

  onBatchApproveClicked(item: any) {
    item.approveButtonDisabled = false;
    item.sendBackButtonDisabled = true;
    item.sendBackNotes = '';
    item.sendBackNotesInValidMsg = '';
    item.sendBackNotesInValid = false;
    item.atleastOnePaymentInValidMsg=null;
    item.atleastOnePaymentInValid = false;
    this.clearPaymentSelection();
    if (
      item.batchStatus === undefined ||
      item.batchStatus === '' ||
      item.batchStatus === null
    ) {
      item.batchStatus = this.approveStatus;
    } else if (item.batchStatus == this.approveStatus) {
      item.batchStatus = '';
    } else if (item.batchStatus == this.sendbackStatus) {
      item.batchStatus = this.approveStatus;
    }
    this.sendBackNotesChange(item);
    this.approveAndSendbackCount();
  }

  onBatchSendbackClicked(item: any) {
    item.approveButtonDisabled = true;
    item.sendBackButtonDisabled = false;
    item.sendBackNotes = '';
    if(
      item.batchStatus === undefined ||
      item.batchStatus === '' ||
      item.batchStatus === null ||
      item.batchStatus === this.approveStatus
    ){
      item.batchStatus = this.sendbackStatus;
      item.sendBackNotesInValidMsg = this.sendbackNotesRequireMessage;
      item.sendBackNotesInValid = true;
      if(this.batch.totalPayments == 1){
        this.selectAllPayments();
      }
      else{
        item.atleastOnePaymentInValidMsg = this.atleastOnePaymentRequireMessage;
        item.atleastOnePaymentInValid = true;
        this.clearPaymentSelection();
      }
    } else if (item.batchStatus == this.sendbackStatus) {
      item.batchStatus = '';
      item.sendBackNotesInValidMsg = '';
      item.sendBackNotesInValid = false;
      item.sendBackButtonDisabled = true;
      item.atleastOnePaymentInValidMsg = null;
      item.atleastOnePaymentInValid = false;
      this.clearPaymentSelection();
    }
    this.sendBackNotesChange(item);
    this.approveAndSendbackCount();
  }

  onPaymentSendbackClicked(selected: any, item: any) {
    if(selected){
      if(this.batch.batchStatus != this.sendbackStatus){
        this.onBatchSendbackClicked(this.batch);
      }
      item.isSendBack = true;
      let index = this.batch.paymentRequestIds.findIndex((x: any) => x == item.paymentRequestId);
      if(index === -1){
        this.batch.paymentRequestIds.push(item.paymentRequestId);
      }
      this.batch.atleastOnePaymentInValidMsg = null;
      this.batch.atleastOnePaymentInValid = false;
    }
    else{
      let index = this.batch.paymentRequestIds.findIndex((x: any) => x == item.paymentRequestId);
      if(index >= 0){
        this.batch.paymentRequestIds.splice(index, 1);
      }
      item.isSendBack = false;
      if(this.batch.paymentRequestIds.length <= 0){
        if(this.batch.batchStatus == this.sendbackStatus){
          this.onBatchSendbackClicked(this.batch);
        }
      }
    }
    this.calculateSendBackPaymentCount();
  }

  clearPaymentSelection(){
    if(this.batchDetailPaymentsList){
      this.batchDetailPaymentsList.data.forEach((paymentItem: any) => {
        paymentItem.isSendBack = false;
      });
    }
    this.batch.paymentRequestIds = [];
  }

  selectAllPayments(){
    let isValidSelection = false;
    if(this.batchDetailPaymentsList){
      this.batchDetailPaymentsList.data.forEach((paymentItem: any) => {
        paymentItem.isSendBack = true;
        let index = this.batch.paymentRequestIds.findIndex((x: any) => x == paymentItem.paymentRequestId);
        if(index === -1){
          this.batch.paymentRequestIds.push(paymentItem.paymentRequestId);
        }
        isValidSelection = true;
      });
    }  
    if(isValidSelection){
      this.batch.atleastOnePaymentInValidMsg = null;
      this.batch.atleastOnePaymentInValid = false;
    }
  }

  assignDataToSourceList(dataItem: any, index: any) {
    this.batchDetailModalSourceList[index].sendBackNotesInValidMsg =
      dataItem?.sendBackNotesInValidMsg;
    this.batchDetailModalSourceList[index].sendBackNotesInValid =
      dataItem?.sendBackNotesInValid;
    this.batchDetailModalSourceList[index].tAreaCessationCounter =
      dataItem?.tAreaCessationCounter;
    this.batchDetailModalSourceList[index].batchStatus = dataItem?.batchStatus;
    this.batchDetailModalSourceList[index].sendBackNotes =
      dataItem?.sendBackNotes;
    this.batchDetailModalSourceList[index].atleastOnePaymentInValidMsg =
      dataItem?.atleastOnePaymentInValidMsg;
    this.batchDetailModalSourceList[index].atleastOnePaymentInValid =
      dataItem?.atleastOnePaymentInValid;  
    this.batchDetailModalSourceList[index].paymentRequestIds =
      dataItem?.paymentRequestIds;  
  }

  onBatchModalSaveClicked() {
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
    this.isBatchDetailPaymentsGridLoaderShow.next(true);
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sort: sortValue,
      sortType: sortTypeValue ?? 'asc',
      filter: this.state?.["filter"]?.["filters"] ?? []
    };
    let batchId = this.batchId;
    let selectedPaymentType = this.selectedPaymentType;
    this.loadBatchDetailPaymentsListEvent.emit({
      gridDataRefinerValue,
      batchId,
      selectedPaymentType,
    });
  }

  gridDataHandle() {
    this.batchDetailPaymentsList$
    .subscribe((response: any) => {
      let gridData = {
        data: response.data,
        total: response.total,
      };
      this.batchDetailPaymentsList = gridData;
      if (response?.total >= 0 || response?.total === -1) {
        this.isBatchDetailPaymentsGridLoaderShow.next(false);
      }
      if(response.data.length > 0){
      if(this.batch.totalPayments == 1 && this.batch.batchStatus == this.sendbackStatus){
        this.batchDetailPaymentsList.data.forEach((item: any) => {
          item.isSendBack = true;
        });
      }
      else{
        this.batchDetailPaymentsList.data.forEach((item: any) => {
          item.isSendBack = this.batch.paymentRequestIds.some((id:any) => id === item.paymentRequestId);
        });
      }
      this.calculateSendBackPaymentCount();       
      this.gridBatchDetailPaymentsDataSubject.next(this.batchDetailPaymentsList);
      }
    });
  }

  ngOnDestroy(): void {
    this.approvalBatchListSubscription?.unsubscribe();
  }

  paymentSelectionDataHandle(){
    this.gridBatchDetailPaymentsData$
    .pipe(first(response => response != null))
    .subscribe((response: any) => {
      if(this.batch.totalPayments == 1 && this.batch.batchStatus == this.sendbackStatus){
        this.selectAllPayments();
      }
      else{
        this.batchDetailPaymentsList.data.forEach((item: any) => {
          item.isSendBack = this.batch.paymentRequestIds.some((id:any) => id === item.paymentRequestId);
        });
      }
      this.calculateSendBackPaymentCount();
    });
  }

  defaultGridState() {
    this.sortColumn = 'itemNbr';
    this.sort = [{
      field: this.sortColumn,
      dir: 'asc',
    }];
    this.state = {
      skip: 0,
      take: this.pageSizes[2]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumn = this.columns[stateData.sort[0]?.field];
    this.filter = stateData?.filter?.filters;
    if(stateData.filter?.filters.length > 0)
    {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = []
      for(const filter of stateData.filter.filters)
      {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy =  filterList.toString();
    }
    else
    {
      this.filter = "";
      this.isFiltered = false
    }

    if (!this.filteredBy.includes('Payment Method'))
    this.paymentMethodFilter = '';
    if (!this.filteredBy.includes('Payment Status'))
    this.paymentStatusFilter = '';
    this.loadBatchPaymentListGrid();
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentMethodCode') {
      this.paymentMethodFilter = value;
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
