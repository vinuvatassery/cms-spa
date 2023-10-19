/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import {  FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { PremiumType } from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';
@Component({
  selector: 'cms-financial-premiums-batches-reconcile-payments',
  templateUrl: './financial-premiums-batches-reconcile-payments.component.html',
  styleUrls: ['./financial-premiums-batches-reconcile-payments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchesReconcilePaymentsComponent implements OnInit, OnChanges,OnDestroy{
  @ViewChild('PrintAuthorizationDialog', { read: TemplateRef })
  PrintAuthorizationDialog!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isReconcileGridLoaderShow = false;
  printAuthorizationDialog : any;
  LeavePageDialog: any;
  reconcilePaymentGridPagedResult:any =[];
  reconcilePaymentGridUpdatedResult: any=[];
  @Input() premiumsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() reconcileGridLists$: any;
  @Output() loadReconcileListEvent = new EventEmitter<any>();
  @Input() reconcileBreakoutSummary$:any;
  @Input() reconcileBreakoutList$ :any;
  @Input() batchId: any;
  @Input() sortValueBatch: any;
  @Input() sortBatch: any;
  @Input() exportButtonShow$ : any
  @Output() loadReconcileBreakoutSummaryEvent = new EventEmitter<any>();
  @Output() loadReconcilePaymentBreakoutListEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'batch';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  selectedReconcileDataRows: any[] = [];
  onlyPrintAdviceLetter : boolean = false;
  isSaveClicked : boolean = false;
  gridClaimsReconcileDataSubject = new Subject<any>();
  gridClaimsReconcileData$ = this.gridClaimsReconcileDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] }; 
  entityId: any;
  datePaymentReconciledRequired= false;
  paymentSentDateRequired= false;
  tAreaCessationMaxLength:any=200;
  pageValidationMessage:any=null;
  pageValidationMessageFlag:boolean=false;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  providerTitle:any = 'Medical Provider';
  premiumReconcileCount:any =0;
  paymentMethodType$ = this.lovFacade.paymentMethodType$
  paymentMethodDesc=null;
  paymentMethodLovSubscription!:Subscription;
  paymentMethodType:any;
  showExportLoader = false;
  bulkNoteCounter:any=0;
  columns : any = {
    vendorName:"Medical Provider",
    tin:"TIN",
    paymentMethodCode:"Pmt. Method",
    paymentReconciledDate:"Date Pmt. Reconciled",
    paymentSentDate:"Date Pmt. Sent",
    amountPaid:"Pmt. Amount",
    checkNbr:"Warrant Number",
    comments:"Note (optional)"
  }
  dropDropdownColumns : any = [
    {
      columnCode: 'vendorName',
      columnDesc: 'Medical Provider',
    },
    {
      columnCode: 'tin',
      columnDesc: 'TIN',
    },
    {
      columnCode: 'paymentMethodCode',
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
      columnCode: 'amountPaid',
      columnDesc: 'Pmt. Amount',
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

  paymentRequestId: any;
  public isBreakoutPanelShow:boolean=true;
  public currentDate =  new Date();
  public reconcileAssignValueBatchForm: FormGroup = new FormGroup({
    datePaymentReconciled: new FormControl('', []),
    datePaymentSend: new FormControl('', []),
    note : new FormControl('', []),
  });

  
  /** Constructor **/
  constructor(private route: Router,   private dialogService: DialogService, 
    private readonly cd: ChangeDetectorRef, private configurationProvider: ConfigurationProvider, 
    public intl: IntlService,private readonly lovFacade: LovFacade) {}
  
  ngOnInit(): void {
    this.lovFacade.getPaymentMethodLov();
    this.paymentMethodSubscription();
    if(this.premiumsType === PremiumType.Dental){
      this.providerTitle = 'Dental Provider';
    }
    this.state = {
      skip: 0,
      take: this.pageSizes[2]?.value,
      sort: this.sortBatch,
      filter : this.filter === undefined?null:this.filter
    };
    this.gridDataHandle();
    this.loadReconcileListGrid();
    this.isBreakoutPanelShow=false;
    const ReconcilePaymentResponseDto =
      {
        batchId : this.batchId,
        entityId : this.entityId,
        premiumsType: this.premiumsType,
        amountTotal : 0,
        warrantTotal : 0,
        warrantNbr : "",
        paymentToReconcileCount : 0
      }
      this.loadIPBreakoutSummary(ReconcilePaymentResponseDto);
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sortBatch,
      filter : this.filter === undefined?null:this.filter
    };

    this.loadReconcileListGrid();
  }

  ngOnDestroy(): void {
    this.paymentMethodLovSubscription.unsubscribe();
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
      take: this.pageSizes[0]?.value,
      sort: this.sortBatch,
      filter: { logic: 'and', filters: [] },
    };
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  onSearchChange(data: any) {
    let searchValue = data;
    this.defaultGridState();
    let operator = 'startswith';

    if (
      this.selectedColumn === 'amountPaid' 
    ) {
      operator = 'eq';
    }
    else if (
      this.selectedColumn === 'paymentReconciledDate' ||
      this.selectedColumn === 'paymentSentDate'
    ) {
      operator = 'eq';
      searchValue = this.formatSearchValue(data,true);

    }
   
    if(searchValue !== ''){
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
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sortBatch[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.filter = stateData?.filter?.filters;
    this.loadReconcileListGrid();
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
          this.reconcilePaymentGridUpdatedResult[index].paymentRequestId = dataItem?.paymentRequestId;
          this.reconcilePaymentGridUpdatedResult[index].clientId = dataItem?.clientId;
          this.reconcilePaymentGridUpdatedResult[index].paymentReconciledDate = dataItem?.paymentReconciledDate;
          this.reconcilePaymentGridUpdatedResult[index].paymentSentDate = dataItem?.paymentSentDate;
          this.reconcilePaymentGridUpdatedResult[index].checkNbr = dataItem?.checkNbr;
          this.reconcilePaymentGridUpdatedResult[index].comments = dataItem?.comments;
          this.reconcilePaymentGridUpdatedResult[index].datePaymentRecInValid = dataItem?.datePaymentRecInValid;
          this.reconcilePaymentGridUpdatedResult[index].datePaymentRecInValidMsg = dataItem?.datePaymentRecInValidMsg;
          this.reconcilePaymentGridUpdatedResult[index].datePaymentSentInValid = dataItem?.datePaymentSentInValid;
          this.reconcilePaymentGridUpdatedResult[index].datePaymentSentInValidMsg = dataItem?.datePaymentSentInValidMsg;
          this.reconcilePaymentGridUpdatedResult[index].isPrintAdviceLetter = dataItem?.isPrintAdviceLetter;
          this.reconcilePaymentGridUpdatedResult[index].tAreaCessationCounter = dataItem?.tAreaCessationCounter;
          this.reconcilePaymentGridUpdatedResult[index].vendorName = dataItem?.vendorName;
          this.reconcilePaymentGridUpdatedResult[index].amountPaid = dataItem?.amountPaid;
          this.reconcilePaymentGridUpdatedResult[index].paymentMethodCode = dataItem?.paymentMethodCode;
        }
      });
    }
    else {
      this.reconcilePaymentGridUpdatedResult.push(dataItem);
    }
    this.premiumReconcileCount = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.checkNbr != null && x.checkNbr !== '').length;
  }

  assignPaymentReconciledDateToPagedList() {
    this.reconcilePaymentGridPagedResult.data.forEach((item: any) => {
      if (item.checkNbr !== null && item.checkNbr !== '' && item.checkNb !== null) {
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
      if (item.checkNbr !== null && item.checkNbr !== '' && item.checkNb !== null) {
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
      if (item.checkNbr !== null && item.checkNbr !== '' && item.checkNbr !== null) {
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

      }
      else {
        itemResponse.data[index].paymentReconciledDate = itemResponse.data[index].paymentReconciledDate !== null ? new Date(itemResponse.data[index].paymentReconciledDate) : itemResponse.data[index].paymentReconciledDate;
        itemResponse.data[index].paymentSentDate = itemResponse.data[index].paymentSentDate !== null ? new Date(itemResponse.data[index].paymentSentDate) : itemResponse.data[index].paymentSentDate;
      }

    });

    this.reconcilePaymentGridPagedResult = itemResponse;
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.reconcileGridLists$.subscribe((response: any) => {
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
        if (item.checkNbr !== null && item.checkNbr !== '' && item.checkNbr !== null) {
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
        if (item.checkNbr !== null && item.checkNbr !== '' && item.checkNbr !== null) {
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
        if (item.checkNbr !== null && item.checkNbr !== '' && item.checkNbr !== null) {
          item.comments = this.reconcileAssignValueBatchForm.controls['note'].value;
        }
      });
      this.assignPaymentNoteToPagedList();
    }

  }

  dateChangeListItems(enteredDate: Date, dataItem: any, type: any) {
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
  }

  printAdviceLetterChange(dataItem: any) {
    this.assignRowDataToMainList(dataItem);
  }
  noteChange(dataItem: any) {
    this.calculateCharacterCount(dataItem)
    this.assignRowDataToMainList(dataItem);
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

  warrantNumberChange(dataItem: any) {
    if (this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].value === null
      || this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].value === undefined
      || this.reconcileAssignValueBatchForm.controls['datePaymentReconciled'].value === '') {
      dataItem.isPrintAdviceLetter = false;
      dataItem.paymentReconciledDate = this.currentDate;
      dataItem.datePaymentRecInValid = false;
      dataItem.datePaymentRecInValidMsg = null;
    }
    if (dataItem.checkNbr !== '' && dataItem.acceptsReportsFlag == 'Y') {
      dataItem.isPrintAdviceLetter = true;
    }
    this.assignRowDataToMainList(dataItem);
    let isCheckNumberAlreadyExist = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.checkNbr === dataItem.checkNbr && x.vendorId !== dataItem.vendorId);
    if (isCheckNumberAlreadyExist.length > 0) {
      dataItem.warrantNumberInValid = true;
      dataItem.warrantNumberInValidMsg = 'Duplicate Warrant Number entered.'
    }
    else {
      dataItem.warrantNumberInValidMsg = null;
      dataItem.warrantNumberInValid = false;
    }
    if (dataItem.checkNbr === null || dataItem.checkNbr === '') {
      dataItem.warrantNumberInValidMsg = null;
      dataItem.warrantNumberInValid = false;
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
    this.isSaveClicked = true;
    this.validateReconcileGridRecord();
    const isValid = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.datePaymentSentInValid || x.datePaymentRecInValid);
    const datePaymentSentInValidCount = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.datePaymentSentInValid);
    const datePaymentRecInValidCount = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.datePaymentRecInValid);
    const totalCount = datePaymentSentInValidCount.length + datePaymentRecInValidCount.length;
    if (isValid.length > 0) {
      this.pageValidationMessageFlag = true;
      this.pageValidationMessage = "Validation errors found, please review each page for errors " +
        totalCount + " is the, total number of validation errors found.";
    }
    else if(this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.checkNbr != null && x.checkNbr !== undefined && x.checkNbr !== '').length <= 0){
      this.pageValidationMessage = "No data for reconcile and print.";
      this.pageValidationMessageFlag = true;
    }
    else {
      this.pageValidationMessageFlag = false;
      this.pageValidationMessage = "validation errors are cleared";
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
    this.route.navigate(['/financial-management/premiums/' + this.premiumsType]);

  }

  public onLeavePageOpenClicked(template: TemplateRef<unknown>): void {
    this.LeavePageDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

 
  onLeavePageCloseClicked(result: any) {
    if (result) { 
      this.LeavePageDialog.close();
    }
  }
 
  toggleBreakoutPanel()
    {
      this.isBreakoutPanelShow=!this.isBreakoutPanelShow;
    }

  onRowSelection(grid:any, selection:any)
    {
      const data = selection.selectedRows[0].dataItem;
      this.isBreakoutPanelShow=true;
      this.entityId=data.entityId;
      this.paymentRequestId = data.paymentRequestId;
      let warrantTotal=0;    
      this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.checkNbr != null && x.checkNbr !== undefined && x.checkNbr !== '' && x.entityId == this.entityId).forEach((item: any) => {
        warrantTotal = warrantTotal + item.amountPaid;
      });
      const ReconcilePaymentResponseDto =
      {
        batchId : this.batchId,
        entityId : data.entityId,
        premiumsType: this.premiumsType,
        amountTotal : data.amountTotal,
        warrantTotal : data.amountPaid,
        warrantNbr : data.checkNbr,
        paymentToReconcileCount : data.checkNbr == null || data.checkNbr == undefined ? 0 : 1
      }
      this.loadIPBreakoutSummary(ReconcilePaymentResponseDto);
    }

    loadIPBreakoutSummary(ReconcilePaymentResponseDto:any)
    {
      this.loadReconcileBreakoutSummaryEvent.emit(ReconcilePaymentResponseDto);
    }

    loadReconcilePaymentBreakOutGridList(event: any) {
    this.loadReconcilePaymentBreakoutListEvent.emit({
      batchId: event.batchId,
      entityId: event.entityId,
      premiumsType:event.premiumsType,
      skipCount:event.skipCount,
      pageSize:event.pagesize,
      sort:event.sortColumn,
      sortType:event.sortType,
      filter:event.filter
    });
  }

  navToReconcilePayments(){
    this.route.navigate([`/financial-management/premiums/${this.premiumsType}/batch`],
    { queryParams :{bid: this.batchId}});
  }

  onProviderNameClick(event:any){
    this.onProviderNameClickEvent.emit(event)
  }

  calculateCharacterCountBulkNote(note: any) {
    let bulkNoteCharactersCount = note
      ? note.length
      : 0;
    this.bulkNoteCounter = `${bulkNoteCharactersCount}/${this.tAreaCessationMaxLength}`;
  }
}

