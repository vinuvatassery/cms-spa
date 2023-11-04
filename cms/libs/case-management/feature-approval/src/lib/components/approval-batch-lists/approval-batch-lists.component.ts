import {
  Component,
  EventEmitter,
  OnInit,
  OnChanges,
  Input,
  Output,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject, BehaviorSubject } from 'rxjs';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
@Component({
  selector: 'productivity-tools-approval-batch-lists',
  templateUrl: './approval-batch-lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalBatchListsComponent implements OnInit, OnChanges {
  @Input() approvalId?: string | null;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchDetailPaymentsList$: any;
  @Input() batchDetailModalSourceList: any;
  @Input() selectedPaymentType: any;
  @Input() paymentStatusLovList: any;
  @Input() paymentMethodLovList: any;
  @Output() closeViewPaymentsBatchClickedEvent = new EventEmitter();
  @Output() loadBatchDetailPaymentsListEvent = new EventEmitter<any>();
  @Output() batchModalSaveClickedEvent = new EventEmitter<any>();
  public state!: State;
  isBatchDetailPaymentsGridLoaderShow = new BehaviorSubject<boolean>(true);
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
  tAreaSendBackNotesMaxLength: any = 100;
  approveBatchCount: any = 0;
  sendbackBatchCount: any = 0;
  approveStatus: string = 'APPROVED';
  sendbackStatus: string = 'SEND_BACK';
  sendbackNotesRequireMessage: string = 'Send Back Note is required.';

  gridBatchDetailPaymentsDataSubject = new Subject<any>();
  gridBatchDetailPaymentsData$ =
    this.gridBatchDetailPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  columns: any; 
  vendorNameField: any;
  amountDueField: any;
  paymentMethodFilter = '';
  paymentStatusFilter = '';
  public width = '100%';
  public height = '100%';
  public formUiStyle: UIFormStyle = new UIFormStyle();

  constructor(private readonly cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[2]?.value,
      sort: this.sort,
    };
    this.loadColumnsData();
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

  private loadColumnsData()
  {
    switch(this.selectedPaymentType){
      case "INSURANCE_PREMIUM":
        this.vendorNameField = 'Insurance Vendor';
        this.amountDueField = 'Total Amount';
        break;
      case "TPA_CLAIM" :
        this.vendorNameField = 'Provider Name';
        this.amountDueField = 'Total Due';
        break;
      case "PHARMACY_CLAIM" :
        this.vendorNameField = 'Pharmacy Name';
        this.amountDueField = '';
        break;
    }
    
    this.columns = {
      paymentNbr: 'Item #',
      invoiceNbr: 'Invoice ID',
      vendorName: this.vendorNameField,
      premiumCount: 'Item Count',
      amountDue: this.amountDueField,
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
      this.batchId =
        this.batchDetailModalSourceList[index].paymentRequestBatchId;
    }
  }

  onScrollViewItemChanged(args: any) {
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

  approveAndSendbackCount() {
    this.approveBatchCount = 0;
    this.sendbackBatchCount = 0;
    this.batchDetailModalSourceList.forEach((item: any, index: number) => {
      this.approveBatchCount =
        item.batchStatus == this.approveStatus
          ? this.approveBatchCount + 1
          : this.approveBatchCount;
      this.sendbackBatchCount =
        item.batchStatus == this.sendbackStatus
          ? this.sendbackBatchCount + 1
          : this.sendbackBatchCount;
    });
  }

  onApproveClicked(item: any, index: any) {
    item.approveButtonDisabled = false;
    item.sendBackButtonDisabled = true;
    item.sendBackNotes = '';
    if (
      item.batchStatus === undefined ||
      item.batchStatus === '' ||
      item.batchStatus === null
    ) {
      item.batchStatus = this.approveStatus;
    } else if (item.batchStatus == this.approveStatus) {
      item.batchStatus = '';
      item.sendBackNotesInValidMsg = '';
      item.sendBackNotesInValid = false;
      item.sendBackButtonDisabled = true;
    } else if (item.batchStatus == this.sendbackStatus) {
      item.batchStatus = this.approveStatus;
      item.sendBackNotesInValidMsg = '';
      item.sendBackNotesInValid = false;
      item.sendBackButtonDisabled = true;
    }
    this.sendBackNotesChange(item);
    this.assignDataToSourceList(item, index);
    this.approveAndSendbackCount();
  }

  onSendbackClicked(item: any, index: any) {
    item.approveButtonDisabled = true;
    item.sendBackButtonDisabled = false;
    if (
      item.batchStatus === undefined ||
      item.batchStatus === '' ||
      item.batchStatus === null
    ) {
      item.batchStatus = this.sendbackStatus;
      item.sendBackNotesInValidMsg = this.sendbackNotesRequireMessage;
      item.sendBackNotesInValid = true;
    } else if (item.batchStatus == this.sendbackStatus) {
      item.batchStatus = '';
      item.sendBackNotesInValidMsg = '';
      item.sendBackNotesInValid = false;
      item.sendBackButtonDisabled = true;
    } else {
      item.batchStatus = this.sendbackStatus;
      item.sendBackNotesInValidMsg = this.sendbackNotesRequireMessage;
      item.sendBackNotesInValid = true;
      item.sendBackButtonDisabled = false;
    }

    this.sendBackNotesChange(item);
    this.assignDataToSourceList(item, index);
    this.approveAndSendbackCount();
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
    this.gridDataHandle();
  }

  gridDataHandle() {
    this.batchDetailPaymentsList$.subscribe((response: any) => {
      let gridData = {
        data: response.data,
        total: response.total,
      };
      this.gridDataResult = gridData;
      this.gridBatchDetailPaymentsDataSubject.next(this.gridDataResult);
      if (response?.total >= 0 || response?.total === -1) {
        this.isBatchDetailPaymentsGridLoaderShow.next(false);
      }
    });
  }

  onChange(data: any) {
    this.defaultGridState();
    const stateData = this.state;
    stateData.filter = this.filterData;
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
