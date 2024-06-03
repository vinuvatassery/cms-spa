/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {  ColumnVisibilityChangeEvent, FilterService, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State
} from '@progress/kendo-data-query';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { LoadTypes, PremiumType } from '@cms/case-management/domain';

@Component({
  selector: 'cms-financial-claims-batches-reconcile-payments',
  templateUrl: './financial-claims-batches-reconcile-payments.component.html',
  styleUrls: ['./financial-claims-batches-reconcile-payments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchesReconcilePaymentsComponent implements OnInit,OnDestroy {
  @ViewChild('PrintAuthorizationDialog', { read: TemplateRef })
  PrintAuthorizationDialog!: TemplateRef<any>;
  @ViewChild('grid') grid!: GridComponent;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isReconcileGridLoaderShow = false;
  printAuthorizationDialog : any;
  @Input() claimsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() sortValueBatch: any;
  @Input() sortBatch: any;
  @Input() reconcileGridLists$: any;
  @Input() reconcileBreakoutSummary$:any;
  @Input() reconcilePaymentBreakoutList$ :any;
  @Input() batchId: any;
  @Input() exportButtonShow$ : any
  @Input() warrantNumberChange$: any;
  @Input() warrantNumberChangeLoader$: any;
  @Input() letterContentList$ :any;
  @Input() letterContentLoader$ :any;
  @Output() loadReconcileListEvent = new EventEmitter<any>();
  @Output() loadReconcileBreakoutSummaryEvent = new EventEmitter<any>();
  @Output() loadReconcilePaymentBreakoutListEvent = new EventEmitter<any>();;
  @Output() onVendorClickedEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  @Output() warrantNumberChangeEvent = new EventEmitter<any>();
  @Output() loadTemplateEvent = new EventEmitter<any>();
  reconcileGridListsSubscription !: Subscription
  paymentRequestId!:any;
  entityId: any;
  public isBreakoutPanelShow:boolean=true;
  public state!: State;
  public currentDate =  new Date();
  sortColumn = 'Medical Provider';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn: any='ALL';
  searchItem:any=null;
  gridDataResult!: GridDataResult;
  selectedDataRows: any[] = [];
  selectedReconcileDataRows: any[] = [];
  onlyPrintAdviceLetter : boolean = false;
  isSaveClicked : boolean = false;
  startItemNumber: number = 1;
  isStartItemNumberUpdated: boolean = false;
  paymentMethodDesc=null;
  reconcilePaymentGridPagedResult:any =[];
  reconcilePaymentGridUpdatedResult: any=[];
  gridClaimsReconcileDataSubject = new Subject<any>();
  gridClaimsReconcileData$ = this.gridClaimsReconcileDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  datePaymentReconciled:any;
  datePaymentSend:any;
  tAreaCessationMaxLength:any=200;
  datePaymentReconciledRequired= false;
  paymentSentDateRequired= false;
  noteRequired= false;
  pageValidationMessage:any=null;
  paymentMethodType$ = this.lovFacade.paymentMethodType$;
  paymentMethodType:any;
  pageValidationMessageFlag:boolean=false;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  providerTitle:any = 'Medical Provider';
  checkingPaymentRequest!:any;
  totalCount:any;
  isSubmitted:any = false;
  columnChangeDesc:any='Default Columns';
  public reconcileAssignValueBatchForm: FormGroup = new FormGroup({
    datePaymentReconciled: new FormControl('', []),
    datePaymentSend: new FormControl('', []),
    note : new FormControl('', []),
  });
  paymentMethodLovSubscription!:Subscription;
  claimReconcileCount:any=0;
  isRecordForPrint:any=0;
  bulkNoteCounter:any=0;
  showExportLoader = false;
  loadType:any = null;
  loadTypeAllPayments:any = LoadTypes.allPayments
  columns : any = {
    ALL: 'ALL',
    vendorName:this.providerTitle,
    tin:"TIN",
    paymentMethodDesc:"Pmt. Method",
    paymentReconciledDate:"Date Pmt. Reconciled",
    paymentSentDate:"Date Pmt. Sent",
    amountDue:"Amount Due",
    checkNbr:"Warrant Number",
    comments:"Note (optional)"
  }
  dropDropdownColumns : any = [
    {
      columnCode: 'ALL',
      columnDesc: 'All Columns',
    },
    {
      columnCode: 'vendorName',
      columnDesc: this.providerTitle,
    },
    {
      columnCode: 'tin',
      columnDesc: 'TIN',
    },
    {
      columnCode: 'paymentMethodDesc',
      columnDesc: 'Pmt. Method',
    },
    {
      columnCode: 'paymentReconciledDate',
      columnDesc: 'Date Pmt. Reconciled',
    },
    {
      columnCode: 'paymentSentDate',
      columnDesc: 'Date Pmt. Sent',
    },
    {
      columnCode: 'amountDue',
      columnDesc: 'Amount Due',
    },
    {
      columnCode: 'checkNbr',
      columnDesc: 'Warrant Number',
    },
    {
      columnCode: 'comments',
      columnDesc: 'Note (optional)',
    }
  ];

  warrantCalculationArray:any[]=[];
  warrantInfoArray:any[]=[];
  warrantNumberChanged: any = false;
  /** Constructor **/
  constructor(private route: Router,   private dialogService: DialogService, public activeRoute: ActivatedRoute,
    private readonly cd: ChangeDetectorRef, public intl: IntlService, 
    private configurationProvider: ConfigurationProvider,private readonly lovFacade: LovFacade) {

    }

  ngOnInit(): void {
    this.reconcilePaymentGridUpdatedResult = [];
    this.reconcilePaymentGridPagedResult = [];
    this.loadQueryParams();    
    this.lovFacade.getPaymentMethodLov();
    this.paymentMethodSubscription();
    if(this.claimsType === PremiumType.Dental){
      this.providerTitle = 'Dental Provider';
      this.sortColumn = this.providerTitle;
      this.dropDropdownColumns.find((x:any)=>x.columnCode === 'vendorName').columnDesc = this.providerTitle;
    }
    if(this.loadType === LoadTypes.allPayments){
      this.columns.batchName ='Batch #';
      let batch = {columnCode:'batchName',columnDesc:'Batch #'};
      this.dropDropdownColumns.splice(0, 0, batch);
    }
    this.state = {
      skip: 0,
      take: this.pageSizes[2]?.value,
      sort: this.sortBatch,
    };
    this.gridDataHandle();
    this.loadReconcileListGrid();
    this.isBreakoutPanelShow=false;
    const ReconcilePaymentResponseDto =
      {
        batchId : this.batchId,
        entityId : this.entityId,
        claimsType: this.claimsType,
        amountTotal : 0,
        warrantTotal : 0,
        warrantNbr : "",
        paymentToReconcileCount : 0
      }
      this.loadReconcilePaymentSummary(ReconcilePaymentResponseDto);
      this.warrantNumberChangeSubscription();
      this.calculateCharacterCountBulkNote(null);

      this.warrantNumberChangeLoader$.subscribe((response: any) =>
        this.warrantNumberChanged = response
      )
  }

  ngOnDestroy(): void {
    this.paymentMethodLovSubscription.unsubscribe();
    this.reconcileGridListsSubscription.unsubscribe();
  }

  loadQueryParams(){
    this.loadType = this.activeRoute.snapshot.queryParams['loadType'];
  }
  private loadReconcileListGrid(): void {
    this.loadReconcile(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValueBatch,
      this.sortType
    );
  }

  loadReconcile(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isReconcileGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pageSize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter : this.filter === undefined?null:this.filter
    };
    this.loadReconcileListEvent.emit(gridDataRefinerValue);
  }


  onChange(data: any) {
    this.defaultGridState();
    const stateData = this.state;
    this.dataStateChange(stateData);
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
    if(field == "paymentMethodDesc"){
      this.paymentMethodDesc = value;
    }
  }
  

  paymentMethodSubscription(){
    this.paymentMethodLovSubscription = this.paymentMethodType$.subscribe(data=>{
      this.paymentMethodType = data;
    });
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[2]?.value,
      sort: this.sortBatch,
      filter: { logic: 'and', filters: [] },
    };
    this.filter =null;
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  columnChange(event: ColumnVisibilityChangeEvent) {
    let columnsRemoved = false;
    for (const column of this.grid.columns.toArray()){
      if (column.hidden) {
        columnsRemoved = true;
      }
    }
    this.columnChangeDesc = columnsRemoved ? 'Columns Removed' : 'Default Columns';
  }

  allColumnChange(){
    this.searchItem = null;
    this.defaultGridState();
  }
  onSearchChange(data: any) {
    let searchValue = data;
    this.defaultGridState();
    let operator = 'contains';
    this.selectedColumn  =  this.selectedColumn ?? 'vendorName'
    if (data !== '') {

      if (
        this.selectedColumn === 'amountDue'
      ) {
        operator = 'eq';
      }
      else if (
        this.selectedColumn === 'paymentReconciledDate' ||
        this.selectedColumn === 'paymentSentDate'
      ) {
        operator = 'eq';
        searchValue = this.formatSearchValue(data, true);

      }
    }
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'vendorName',
              operator: operator,
              value: searchValue,
            },
          ],
          logic: 'and',
        },
      ],
    };
    const stateData = this.state;
    stateData.filter = this.filterData;
    this.dataStateChange(stateData);

  }
  private formatSearchValue(searchValue: any, isDateSearch: boolean) {
    if (isDateSearch) {
      if (this.isValidDate(searchValue)) {
        return this.intl.formatDate(new Date(searchValue), this.dateFormat);
      }
      else {
        return '';
      }
    }
    return searchValue;
  }

  private isValidDate(searchValue: any) {   
    let dateValue = isNaN(searchValue) && !isNaN(Date.parse(searchValue));
    if(dateValue !== null){
      let dateArray = searchValue.split('/');
      if(dateArray[2].length === 4){
        return dateValue
      }
      else{
        return '';
      }
    }
    return ''
  }

  dataStateChange(stateData: any): void {
    this.sortBatch = stateData.sort;
    this.sortValueBatch = stateData.sort[0]?.field ?? this.sortValueBatch;
    this.sortType = stateData.sort[0]?.dir ?? 'desc';
    this.state = stateData;
    this.sortDir = this.sortBatch[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.filter = stateData?.filter?.filters;

    this.sortColumn = this.columns[stateData.sort[0]?.field];

    if (stateData.filter?.filters.length > 0) {
      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    } else {
      this.filter = null;
      this.isFiltered = false;
    }

    this.loadReconcileListGrid();
  }
  
  setToDefault() {
    this.searchItem = null;
    this.state = {
      skip: 0,
      take: this.pageSizes[2]?.value,
      sort: this.sort,
    };

    this.sortColumn = this.providerTitle;
    this.sortDir = 'Descending';
    this.filter = null;
    this.searchValue = '';
    this.isFiltered = false;
    this.columnsReordered = false;

    this.sortValue = 'vendorName';
    this.sortType = 'desc';
    this.sort = this.sortColumn;

    this.loadReconcileListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadReconcileListGrid();
  }

  assignRowDataToMainList(dataItem: any) {
    let ifExist = this.reconcilePaymentGridUpdatedResult.find((x: any) => x.paymentRequestId === dataItem.paymentRequestId);
    if (ifExist !== undefined) {
      this.reconcilePaymentGridUpdatedResult.forEach((item: any, index: number) => {
        if (item.paymentRequestId === ifExist.paymentRequestId) {
          this.reconcilePaymentGridUpdatedResult[index].paymentRequestId = dataItem.paymentRequestId;
          this.reconcilePaymentGridUpdatedResult[index].clientId = dataItem.clientId;
          this.reconcilePaymentGridUpdatedResult[index].paymentReconciledDate = dataItem.paymentReconciledDate;
          this.reconcilePaymentGridUpdatedResult[index].paymentSentDate = dataItem.paymentSentDate;
          this.reconcilePaymentGridUpdatedResult[index].checkNbr = dataItem.checkNbr;
          this.reconcilePaymentGridUpdatedResult[index].comments = dataItem.comments;
          this.reconcilePaymentGridUpdatedResult[index].datePaymentRecInValid = dataItem?.datePaymentRecInValid;
          this.reconcilePaymentGridUpdatedResult[index].datePaymentRecInValidMsg = dataItem?.datePaymentRecInValidMsg;
          this.reconcilePaymentGridUpdatedResult[index].datePaymentSentInValid = dataItem?.datePaymentSentInValid;
          this.reconcilePaymentGridUpdatedResult[index].datePaymentSentInValidMsg = dataItem?.datePaymentSentInValidMsg;
          this.reconcilePaymentGridUpdatedResult[index].isPrintAdviceLetter = dataItem?.isPrintAdviceLetter;
          this.reconcilePaymentGridUpdatedResult[index].tAreaCessationCounter = dataItem?.tAreaCessationCounter;
          this.reconcilePaymentGridUpdatedResult[index].vendorName = dataItem?.vendorName;
          this.reconcilePaymentGridUpdatedResult[index].amountPaid = dataItem?.amountPaid;
          this.reconcilePaymentGridUpdatedResult[index].paymentMethodCode = dataItem?.paymentMethodCode;
          this.reconcilePaymentGridUpdatedResult[index].batchId = dataItem?.batchId;
          this.reconcilePaymentGridUpdatedResult[index].warrantNumberInValid = dataItem?.warrantNumberInValid;
          this.reconcilePaymentGridUpdatedResult[index].warrantNumberInValidMsg = dataItem?.warrantNumberInValidMsg; 
        }
      });
    }
    else {
      this.reconcilePaymentGridUpdatedResult.push(dataItem);
    }
    this.claimReconcileCount = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.warrantNumberChanged).length;
    this.isRecordForPrint =  this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.isPrintAdviceLetter).length;
  }

  assignPaymentReconciledDateToPagedList() {
    this.reconcilePaymentGridPagedResult.data.forEach((item: any) => {
      if (item.checkNbr !== undefined && item.checkNbr !== '' && item.checkNbr !== null && !item.reconciled) {
        item.paymentReconciledDate = this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].value;
        item.datePaymentRecInValid = false;
        item.datePaymentRecInValidMsg = null;
      }
    });
    this.reconcilePaymentGridPagedResult.data.forEach((item: any) => {
      this.assignRowDataToMainList(item);
    })
  }

  assignPaymentSendDateToPagedList() {
    this.reconcilePaymentGridPagedResult.data.forEach((item: any) => {
      if (item.checkNbr !== undefined && item.checkNbr !== '' && item.checkNbr !== null && !item.reconciled) {
        item.paymentSentDate = this.reconcileAssignValueBatchForm.controls['datePaymentSend'].value;
        item.datePaymentSentInValid = false;
        item.datePaymentSentInValidMsg = null;
      }
    });
    this.reconcilePaymentGridPagedResult.data.forEach((item: any) => {
      this.assignRowDataToMainList(item);
    })
  }

  assignPaymentNoteToPagedList() {
    this.reconcilePaymentGridPagedResult.data.forEach((item: any) => {
      if (item.checkNbr !== null && item.checkNbr !== '' && item.checkNbr !== null && !item.reconciled) {
        item.comments = this.reconcileAssignValueBatchForm.controls['note'].value;
      }
    });
    this.reconcilePaymentGridPagedResult.data.forEach((item: any) => {
      this.assignRowDataToMainList(item);
    })
  }

  assignDataFromUpdatedResultToPagedResult(itemResponse: any) {
    itemResponse.data.forEach((item: any, index: number) => {
      let ifExist = this.reconcilePaymentGridUpdatedResult.find((x: any) => x.paymentRequestId === item.paymentRequestId);
      if (ifExist !== undefined && item.paymentRequestId === ifExist.paymentRequestId) {
        itemResponse.data[index].paymentRequestId = ifExist?.paymentRequestId
        itemResponse.data[index].clientId = ifExist?.clientId
        itemResponse.data[index].paymentReconciledDate = ifExist?.paymentReconciledDate !== null ? new Date(ifExist?.paymentReconciledDate) : ifExist?.paymentReconciledDate;
        itemResponse.data[index].paymentSentDate = ifExist?.paymentSentDate !== null ? new Date(ifExist?.paymentSentDate) : ifExist?.paymentSentDate;
        itemResponse.data[index].checkNbr = ifExist?.checkNbr;
        itemResponse.data[index].comments = ifExist?.comments;
        itemResponse.data[index].datePaymentRecInValid = ifExist?.datePaymentRecInValid;
        itemResponse.data[index].datePaymentRecInValidMsg = ifExist?.datePaymentRecInValidMsg;
        itemResponse.data[index].datePaymentSentInValid = ifExist?.datePaymentSentInValid;
        itemResponse.data[index].datePaymentSentInValidMsg = ifExist?.datePaymentSentInValidMsg;
        itemResponse.data[index].isPrintAdviceLetter = ifExist?.isPrintAdviceLetter;
        itemResponse.data[index].tAreaCessationCounter = ifExist?.tAreaCessationCounter;
        itemResponse.data[index].batchId = ifExist?.batchId;       
        itemResponse.data[index].warrantNumberInValid = ifExist?.warrantNumberInValid;
        itemResponse.data[index].warrantNumberInValidMsg = ifExist?.warrantNumberInValidMsg; 
      }
      else {
        itemResponse.data[index].paymentReconciledDate = itemResponse.data[index].paymentReconciledDate !== null ? new Date(itemResponse.data[index].paymentReconciledDate) : itemResponse.data[index].paymentReconciledDate;
        itemResponse.data[index].paymentSentDate = itemResponse.data[index].paymentSentDate !== null ? new Date(itemResponse.data[index].paymentSentDate) : itemResponse.data[index].paymentSentDate;
        if((itemResponse.data[index].checkNbr !== null && itemResponse.data[index].checkNbr !== '' && itemResponse.data[index].checkNbr !== undefined )){
          itemResponse.data[index].reconciled = true;
        }
      }   
       
    });
    this.reconcilePaymentGridPagedResult = itemResponse;     
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.reconcileGridListsSubscription = this.reconcileGridLists$.subscribe((response: any) => {
      if (response.data.length > 0) {
        this.assignDataFromUpdatedResultToPagedResult(response);
        this.tAreaVariablesInitiation(this.reconcilePaymentGridPagedResult.data);
        this.isReconcileGridLoaderShow = false;
        this.gridClaimsReconcileDataSubject.next(this.reconcilePaymentGridPagedResult);
        if (response?.total >= 0 || response?.total === -1) {
          this.isReconcileGridLoaderShow = false;
        }
        this.cd.detectChanges()
      }
      else {
        this.reconcilePaymentGridPagedResult = response;
        this.isReconcileGridLoaderShow = false;
        this.cd.detectChanges()
      }
    });
    this.isReconcileGridLoaderShow = false;
    this.cd.detectChanges();

  }

  reconcileDateOnChange(control: any) {
    this.reconcileAssignValueBatchForm.controls[control].removeValidators(
      Validators.required
    );
    const datePaymentReconciled = this.reconcileAssignValueBatchForm.controls[control].value
    if (datePaymentReconciled > this.currentDate) {
      if (control === 'datePaymentReconciled') {
        this.datePaymentReconciledRequired = false;
      }
      if (control === 'datePaymentSend') {
        this.paymentSentDateRequired = false;
      }
      this.reconcileAssignValueBatchForm.controls[control].setErrors({ 'incorrect': true });
    }

  }
  reconcileDateBatch() {
    this.reconcileAssignValueBatchForm.markAllAsTouched();
    if (this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].value === null
      || this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].value === '') {
      this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].setValidators([
        Validators.required,
      ]);
      this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].updateValueAndValidity();
    }

    if (this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].errors !== null) {
      if (this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].errors['required']) {
        this.datePaymentReconciledRequired = true;
      }
      else {
        this.datePaymentReconciledRequired = false;
      }
    }
    else {
      this.reconcilePaymentGridUpdatedResult.forEach((item: any) => {
        if (item.checkNbr !== undefined && item.checkNbr !== '' && item.checkNbr !== null && !item.reconciled) {
          item.paymentReconciledDate = this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].value;
          item.datePaymentRecInValid = false;
          item.datePaymentRecInValidMsg = null;
          }
      });
      this.assignPaymentReconciledDateToPagedList();
      this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].updateValueAndValidity();
    }
  }

  paymentSentDateBatch() {
    this.reconcileAssignValueBatchForm.markAllAsTouched();
    if (this.reconcileAssignValueBatchForm.controls['datePaymentSend'].value === null
      || this.reconcileAssignValueBatchForm.controls['datePaymentSend'].value === '') {
      this.reconcileAssignValueBatchForm.controls['datePaymentSend'].setValidators([
        Validators.required,
      ]);
      this.reconcileAssignValueBatchForm.controls['datePaymentSend'].updateValueAndValidity();
    }

    if (this.reconcileAssignValueBatchForm.controls['datePaymentSend'].errors !== null) {
      if (this.reconcileAssignValueBatchForm.controls['datePaymentSend'].errors['required']) {
        this.paymentSentDateRequired = true;
      }
      else {
        this.paymentSentDateRequired = false;
      }
    }
    else {
      this.reconcilePaymentGridUpdatedResult.forEach((item: any) => {
        if ((item.checkNbr !== undefined && item.checkNbr !== '' && item.checkNbr !== null) && !item.reconciled) {
          item.paymentSentDate = this.reconcileAssignValueBatchForm.controls['datePaymentSend'].value;
          item.datePaymentSentInValid = false;
          item.datePaymentSentInValidMsg = null;
        }
      });
      this.assignPaymentSendDateToPagedList();
      this.reconcileAssignValueBatchForm.controls['datePaymentSend'].updateValueAndValidity();
    }
  }

  noteBatch() {
    this.reconcileAssignValueBatchForm.markAllAsTouched();
    if (this.reconcileAssignValueBatchForm.controls['note'].value === null
      || this.reconcileAssignValueBatchForm.controls['note'].value === '') {
      this.reconcileAssignValueBatchForm.controls['note'].setValidators([
        Validators.required,
      ]);
      this.reconcileAssignValueBatchForm.controls['note'].updateValueAndValidity();
    }
    if (this.reconcileAssignValueBatchForm.controls['note'].valid) {
      this.reconcilePaymentGridUpdatedResult.forEach((item: any) => {
        if ((item.checkNbr !== undefined && item.checkNbr !== '' && item.checkNbr !== null) && !item.reconciled) {
          item.comments = this.reconcileAssignValueBatchForm.controls['note'].value;
        }
      });
      this.assignPaymentNoteToPagedList();
    }

  }

  dateChangeListItems(enteredDate: Date, dataItem: any, type: any) {
    if(dataItem.checkNbr !== null && dataItem.checkNbr !== undefined && dataItem.checkNbr !== ''){
      dataItem.warrantNumberChanged = true;
    }
    else{
      dataItem.warrantNumberChanged = false;
    }
    const todayDate = new Date();
    switch (type.toUpperCase()) {
      case "DATE_PAYMENT_RECONCILED":
        if (enteredDate > todayDate) {
          dataItem.datePaymentRecInValid = true;
          dataItem.datePaymentRecInValidMsg = "Reconciled date cannot be a future date.";
        }
        else {
          dataItem.datePaymentRecInValid = false;
          dataItem.datePaymentRecInValidMsg = null
        }
        break;
      case "DATE_PAYMENT_SENT":
        if (enteredDate > todayDate) {
          dataItem.datePaymentSentInValid = true;
          dataItem.datePaymentSentInValidMsg = "Date payment sent cannot be a future date.";
        }
        else {
          dataItem.datePaymentSentInValid = false;
          dataItem.datePaymentSentInValidMsg = null;
        }
        break;
    }    
    this.assignRowDataToMainList(dataItem);
    this.checkErrorCount();
  }

  printAdviceLetterChange(dataItem: any) {
    let ifExist = this.reconcilePaymentGridUpdatedResult.find((x: any) => x.paymentRequestId === dataItem.paymentRequestId);
    if(!dataItem.isPrintAdviceLetter && !ifExist.warrantNumberChanged){           
      this.reconcilePaymentGridUpdatedResult = this.reconcilePaymentGridUpdatedResult.filter((x:any)=>x.paymentRequestId !== dataItem.paymentRequestId);
    }
    else{
      this.assignRowDataToMainList(dataItem);
    }
    if(this.selectedReconcileDataRows !== null && this.selectedReconcileDataRows?.length > 0){
      this.selectedReconcileDataRows = this.reconcilePaymentGridUpdatedResult.find((x: any) => x.paymentRequestId === dataItem.paymentRequestId);
      }
    this.isRecordForPrint =  this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.isPrintAdviceLetter).length;
    this.cd.detectChanges();
  }

  noteChange(dataItem: any) {    
    if(dataItem.checkNbr !== null && dataItem.checkNbr !== undefined && dataItem.checkNbr !== ''){
      dataItem.warrantNumberChanged = true;
    }
    else{
      dataItem.warrantNumberChanged = false;
    }
    this.calculateCharacterCount(dataItem)
    this.assignRowDataToMainList(dataItem);
    this.cd.detectChanges();
  }

  private tAreaVariablesInitiation(dataItem: any) {
    dataItem.forEach((dataItem: any) => {
      this.calculateCharacterCount(dataItem);
    });

  }

  calculateCharacterCount(dataItem: any) {
    let tAreaCessationCharactersCount = dataItem.comments
      ? dataItem.comments.length
      : 0;
    dataItem.tAreaCessationCounter = `${tAreaCessationCharactersCount}/${this.tAreaCessationMaxLength}`;
  }
  calculateCharacterCountBulkNote(note: any) {
    this.reconcileAssignValueBatchForm.controls['note'].removeValidators([
      Validators.required,
    ]);
    this.reconcileAssignValueBatchForm.controls['note'].updateValueAndValidity();
    let bulkNoteCharactersCount = note
      ? note.length
      : 0;
    this.bulkNoteCounter = `${bulkNoteCharactersCount}/${this.tAreaCessationMaxLength}`;
  }

  warrantNumberChange(dataItem: any) {
    if(dataItem.checkNbr !== null && dataItem.checkNbr !== undefined && dataItem.checkNbr !== ''){
      dataItem.warrantNumberChanged = true;
    }
    else{
      dataItem.warrantNumberChanged = false;
    }
    if (this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].value === null
      || this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].value === undefined
      || this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].value === '') {
      dataItem.isPrintAdviceLetter = false;
      dataItem.paymentReconciledDate = this.currentDate;
      dataItem.datePaymentRecInValid = false;
      dataItem.datePaymentRecInValidMsg = null;
    }
    if (dataItem.checkNbr !== '') {
      dataItem.isPrintAdviceLetter = true;      
    }    

    if(dataItem.checkNbr !== null && dataItem.checkNbr !== undefined
      && dataItem.checkNbr !== ''){
      this.checkingPaymentRequest = dataItem.paymentRequestId;
      this.warrantNumberChangeEvent.emit(dataItem);
    }
    else{
      dataItem.warrantNumberChanged = false;
    }
    let isCheckNumberAlreadyExist = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.checkNbr === dataItem.checkNbr 
    && (x.vendorId !== dataItem.vendorId || x.batchId !== dataItem.batchId));
    if (isCheckNumberAlreadyExist.length > 0) {
      dataItem.warrantNumberInValid = true;
      dataItem.warrantNumberInValidMsg = `Duplicate Warrant Number entered in ${isCheckNumberAlreadyExist[0].batchName}.`;
    }
    else {
      dataItem.warrantNumberInValidMsg = null;
      dataItem.warrantNumberInValid = false;
    }
    if (dataItem.checkNbr === null || dataItem.checkNbr === '') {
      dataItem.warrantNumberInValidMsg = null;
      dataItem.warrantNumberInValid = false;
    }
    this.assignRowDataToMainList(dataItem);
    this.checkErrorCount();
  }
 warrantNumberChangeSubscription(){
  this.warrantNumberChange$.subscribe((response:any) =>{
    if(response.length>0){
      let ifExist = this.reconcilePaymentGridUpdatedResult.find((x: any) => x.paymentRequestId === this.checkingPaymentRequest);
      if (ifExist !== undefined) {
        ifExist.warrantNumberInValid = true;
        ifExist.warrantNumberInValidMsg = `Duplicate Warrant Number entered in ${response[0].batchName}.`;
        this.assignUpdatedItemToPagedList();
        this.checkErrorCount();
        this.cd.detectChanges();
      }
    }
  })
 }

  checkErrorCount() {    
    const datePaymentSentInValidCount = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.datePaymentSentInValid);
    const datePaymentRecInValidCount = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.datePaymentRecInValid);
    const warrantNumberInValidCount = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.warrantNumberInValid);
    this.totalCount = datePaymentSentInValidCount.length + datePaymentRecInValidCount.length + warrantNumberInValidCount.length;

    if (this.totalCount === 0) {
      if( this.isSubmitted){
      this.pageValidationMessageFlag = false;
      this.pageValidationMessage = null;
      }
    }
    else {
      this.pageValidationMessageFlag = true;
      this.pageValidationMessage = this.totalCount + " validation errors found, please review each page for errors. ";
    }
  }

  validateReconcileGridRecord() {
    this.reconcilePaymentGridUpdatedResult.forEach((currentPage: any, index: number) => {
      if (currentPage.checkNbr !== null
        && currentPage.checkNbr !== ''
        && currentPage.checkNbr !== undefined) {
        if (currentPage.paymentReconciledDate == null || currentPage.paymentReconciledDate === undefined || currentPage.paymentReconciledDate === '') {
          currentPage.datePaymentRecInValid = true;
          currentPage.datePaymentRecInValidMsg = 'Date payment reconciled is required.';
        }
        if (currentPage.paymentSentDate == null || currentPage.paymentSentDate === undefined || currentPage.paymentSentDate === '') {
          currentPage.datePaymentSentInValid = true;
          currentPage.datePaymentSentInValidMsg = 'Date payment sent is required.';
        }
      }
      else {
        currentPage.datePaymentRecInValid = false;
        currentPage.datePaymentRecInValidMsg = null;
        currentPage.datePaymentSentInValid = false;
        currentPage.datePaymentSentInValidMsg = null;
      }
    });
    this.assignUpdatedItemToPagedList();
  }

  assignUpdatedItemToPagedList() {
    this.reconcilePaymentGridPagedResult.data.forEach((item: any) => {
      let dataItem = this.reconcilePaymentGridUpdatedResult.find((x: any) => x.paymentRequestId === item.paymentRequestId);
      if (dataItem !== undefined) {
        if (item.paymentRequestId === dataItem?.paymentRequestId) {
          item.paymentRequestId = dataItem?.paymentRequestId;
          item.clientId = dataItem?.clientId;
          item.paymentReconciledDate = dataItem?.paymentReconciledDate;
          item.paymentSentDate = dataItem?.paymentSentDate;
          item.checkNbr = dataItem?.checkNbr;
          item.comments = dataItem?.comments;
          item.datePaymentRecInValid = dataItem?.datePaymentRecInValid;
          item.datePaymentRecInValidMsg = dataItem?.datePaymentRecInValidMsg;
          item.datePaymentSentInValid = dataItem?.datePaymentSentInValid;
          item.datePaymentSentInValidMsg = dataItem?.datePaymentSentInValidMsg;
          item.isPrintAdviceLetter = dataItem?.isPrintAdviceLetter;
          item.tAreaCessationCounter = dataItem?.tAreaCessationCounter;
          item.vendorName = dataItem?.vendorName;
          item.amountPaid = dataItem?.amountPaid;
          item.paymentMethodCode = dataItem?.paymentMethodCode;
          item.batchId = dataItem?.batchId;
          item.warrantNumberInValid = dataItem?.warrantNumberInValid;
          item.warrantNumberInValidMsg = dataItem?.warrantNumberInValidMsg;
        }
      }
    })
  }  

  ngDirtyInValid(dataItem: any, control: any, rowIndex: any) {
    let inValid = false;
    if (control === 'paymentReconciledDate') {
      inValid = dataItem.datePaymentRecInValid;
    }
    if (control === 'paymentSentDate') {
      inValid = dataItem.datePaymentSentInValid;
    }
    if (control === 'checkNbr') {
      inValid = dataItem.warrantNumberInValid;
    }
    if (inValid) {
      document.getElementById(control + rowIndex)?.classList.remove('ng-valid');
      document.getElementById(control + rowIndex)?.classList.add('ng-invalid');
      document.getElementById(control + rowIndex)?.classList.add('ng-dirty');
    }
    else {
      document.getElementById(control + rowIndex)?.classList.remove('ng-invalid');
      document.getElementById(control + rowIndex)?.classList.remove('ng-dirty');
      document.getElementById(control + rowIndex)?.classList.add('ng-valid');
    }
    return 'ng-dirty ng-invalid';
  }

  assignPagedGridItemToUpdatedList(dataItem: any) {
    dataItem.forEach((item: any) => {
      this.assignRowDataToMainList(item);
    })
  }

  public onPrintAuthorizationOpenClicked(template: TemplateRef<unknown>): void {
    this.isSubmitted = true;
    this.reconcileAssignValueBatchForm.controls['note'].removeValidators([
      Validators.required,
    ]);
    this.reconcileAssignValueBatchForm.controls['note'].updateValueAndValidity();
    this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].removeValidators([
      Validators.required,
    ]);
    this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].updateValueAndValidity();
    this.reconcileAssignValueBatchForm.controls['datePaymentSend'].removeValidators([
      Validators.required,
    ]);
    this.reconcileAssignValueBatchForm.controls['datePaymentSend'].updateValueAndValidity();
    this.isSaveClicked = true;
    this.validateReconcileGridRecord();
    const isValid = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.datePaymentSentInValid || x.datePaymentRecInValid);
    const datePaymentSentInValidCount = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.datePaymentSentInValid);
    const datePaymentRecInValidCount = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.datePaymentRecInValid);
    const warrantNumberInValidCount = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.warrantNumberInValid);
    this.totalCount = datePaymentSentInValidCount.length + datePaymentRecInValidCount.length + warrantNumberInValidCount.length;
    if (isValid.length > 0) {
      this.pageValidationMessageFlag = true;
      this.pageValidationMessage = this.totalCount +" validation errors found, please review each page for errors. " ;
    }
    else if(this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.checkNbr != null && x.checkNbr !== undefined && x.checkNbr !== '').length <= 0){
      this.pageValidationMessage = null;
      this.pageValidationMessageFlag = true;
    }
    else {
      this.pageValidationMessageFlag = false;
      this.pageValidationMessage = null;
       this.selectedReconcileDataRows = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.checkNbr != null && x.checkNbr !== undefined && x.checkNbr !== '');
      this.selectedReconcileDataRows.forEach((data:any) =>{
        data. paymentReconciledDate =  this.intl.formatDate(data.paymentReconciledDate, this.dateFormat);
        data. paymentSentDate =  this.intl.formatDate(data.paymentSentDate, this.dateFormat);
      })

    }
    if (isValid.length <= 0 && this.selectedReconcileDataRows.length>0) {
      this.printAuthorizationDialog = this.dialogService.open({
        content: template,
        cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
      });
    }
  }

  onPrintAuthorizationCloseClicked(result: any) {
    if (result) {
      this.printAuthorizationDialog.close();
    }
  }
  navToBatchDetails(event: any) {
    this.route.navigate(['/financial-management/claims/' + this.claimsType]);

  }

    toggleBreakoutPanel()
    {
      this.isBreakoutPanelShow=!this.isBreakoutPanelShow;
    }

    onRowSelection(grid:any, selection:any)
    {
      this.warrantCalculationArray=[];
      const data = selection.dataItem;    
      this.isBreakoutPanelShow=true;
      this.entityId=data.entityId; 
      let warrantTotal=0; 
      let bid=this.activeRoute.snapshot.queryParams["bid"];
      this.batchId= data.batchId == '' || data.batchId == null || data.batchId==undefined? bid:data.batchId;
    
      this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.checkNbr != null && x.checkNbr !== undefined && x.checkNbr !== '' && x.entityId == this.entityId && x.batchId==this.batchId).forEach((item: any) => {
        let object={
          vendorId:item?.entityId,
          batchId:item?.batchId,
          paymentRequestId:item?.paymentRequestId,
          warrantNumber:item?.checkNbr
        }
        this.warrantCalculationArray.push(object);
      });

      const ReconcilePaymentResponseDto =
      {
        batchId : this.batchId,
        entityId : data.entityId,
        claimsType: this.claimsType,
        amountTotal : data.amountTotal,
        warrantTotal : warrantTotal,
        warrantNbr : data.checkNbr,
        warrantCalculation:this.warrantCalculationArray,
        paymentToReconcileCount : this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.warrantNumberChanged && x.entityId == this.entityId  && x.checkNbr !== undefined && x.checkNbr !== '').length
      }
      this.claimReconcileCount =  this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.warrantNumberChanged && x.entityId == this.entityId  && x.checkNbr !== undefined && x.checkNbr !== '').length;
      this.loadReconcilePaymentSummary(ReconcilePaymentResponseDto);
      this.warrantInfoArray = [];
      this.warrantInfoArray = ReconcilePaymentResponseDto.warrantCalculation;      
    }

    loadReconcilePaymentSummary(ReconcilePaymentResponseDto:any)
    {
      this.loadReconcileBreakoutSummaryEvent.emit(ReconcilePaymentResponseDto);
    }

  loadReconcilePaymentBreakOutGridList(event: any) {
    this.loadReconcilePaymentBreakoutListEvent.emit({
      batchId: event.batchId,
      entityId: event.entityId,
      claimsType:event.claimsType,
      skipCount:event.skipCount,
      pageSize:event.pagesize,
      sort:event.sortColumn,
      sortType:event.sortType,
      filter:event.filter,
      warrantCalculation : event.warrantCalculation
    });
  }
  getItemNumber() {
    if (!this.isStartItemNumberUpdated) {
      this.isStartItemNumberUpdated = true;
      return this.startItemNumber;
    } else {
      return this.startItemNumber++;
    }
  }

  navToReconcilePayments(){
    this.reconcilePaymentGridUpdatedResult = [];
    if(this.loadType === null || this.loadType === undefined){
      this.route.navigate([`/financial-management/claims/${this.claimsType}/batch`],
      { queryParams :{bid: this.batchId}});
    }
    else{
      this.route.navigate([`/financial-management/claims/${this.claimsType}`]);
    }
  }

  onViewProviderDetailClicked(paymentRequestId:any) {  
    this.onVendorClickedEvent.emit(paymentRequestId);
  }
  onClickedExport(){
    this.showExportLoader = true
    this.exportGridDataEvent.emit()        
    this.exportButtonShow$
    .subscribe((response: any) =>
    {
      if(response)
      {        
         this.showExportLoader = false
        this.cd.detectChanges()
      }

    })
  }
  loadEachLetterTemplate(event:any){
    this.loadTemplateEvent.emit(event);
  }

  onReconcileRecord(event:any){
    this.reconcilePaymentGridPagedResult.data.forEach((item:any) => {
      let ifExist = event?.paymentRequestIds.includes(item.paymentRequestId);
      if(ifExist){
        item.reconciled = true;
        item.warrantNumberChanged = false;
      }
    });
    this.claimReconcileCount = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.warrantNumberChanged).length;
    this.cd.detectChanges();
  }
  
  onBatchNumberClick(dataItem: any) {
    this.route.navigate(
      [`/financial-management/claims/${this.claimsType}/batch`],
      { queryParams: { bid: dataItem?.batchId } }
    );
  }
}

