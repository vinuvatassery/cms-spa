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
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Component({
  selector: 'cms-financial-claims-batches-reconcile-payments',
  templateUrl: './financial-claims-batches-reconcile-payments.component.html',
  styleUrls: ['./financial-claims-batches-reconcile-payments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchesReconcilePaymentsComponent implements OnInit {
  @ViewChild('PrintAuthorizationDialog', { read: TemplateRef })
  //reconcileAssignValueBatchForm!: FormGroup;
  PrintAuthorizationDialog!: TemplateRef<any>;
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
  @Output() loadReconcileListEvent = new EventEmitter<any>();
  @Output() loadReconcileBreakoutSummaryEvent = new EventEmitter<any>();
  @Output() loadReconcilePaymentBreakoutListEvent = new EventEmitter<any>();
  entityId: any;
  public isBreakoutPanelShow:boolean=true;
  public state!: State;
  public currentDate =  new Date();
  sortColumn = 'batch';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  selectedDataRows: any[] = [];
  selectedReconcileDataRows: any[] = [];
  onlyPrintAdviceLetter : boolean = false;
  isSaveClicked : boolean = false;
  startItemNumber: number = 1;
  isStartItemNumberUpdated: boolean = false;

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
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  providerTitle:any = 'Medical Provider';
  public reconcileAssignValueBatchForm: FormGroup = new FormGroup({
    datePaymentReconciled: new FormControl('', []),
    datePaymentSend: new FormControl('', []),
    note : new FormControl('', []),
  });
  claimReconcileCount:any=0;
  /** Constructor **/
  constructor(private route: Router,   private dialogService: DialogService, public activeRoute: ActivatedRoute,
    private readonly cd: ChangeDetectorRef, public intl: IntlService, private configurationProvider: ConfigurationProvider) {

    }

  ngOnInit(): void {
    if(this.claimsType === 'dental'){
      this.providerTitle = 'Dental Provider';
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

  dataStateChange(stateData: any): void {
    this.sortBatch = stateData.sort;
    this.sortValueBatch = stateData.sort[0]?.field ?? this.sortValueBatch;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sortBatch[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.filter = stateData?.filter?.filters;

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
        }
      });
    }
    else {
      this.reconcilePaymentGridUpdatedResult.push(dataItem);
    }
    this.claimReconcileCount = this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.checkNbr != null && x.checkNbr !== '').length;
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
    if (dataItem.checkNbr !== '') {
      dataItem.isPrintAdviceLetter = true
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
      this.pageValidationMessage = "validation errors found, please review each page for errors " +
        totalCount + " is the total number of validation errors found.";
    }
    else if(this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.checkNbr != null && x.checkNbr !== undefined && x.checkNbr !== '').length <= 0){
      this.pageValidationMessage = "No data for reconcile and print";
    }
    else {
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
    this.route.navigate(['/financial-management/claims/' + this.claimsType]);

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
      var warrantTotal=0;    
      this.reconcilePaymentGridUpdatedResult.filter((x: any) => x.checkNbr != null && x.checkNbr !== undefined && x.checkNbr !== '' && x.entityId == this.entityId).forEach((item: any) => {
        warrantTotal = warrantTotal + item.amountPaid;
      });
      const ReconcilePaymentResponseDto =
      {
        batchId : this.batchId,
        entityId : data.entityId,
        claimsType: this.claimsType,
        amountTotal : data.amountTotal,
        warrantTotal : warrantTotal,
        warrantNbr : data.checkNbr,
        paymentToReconcileCount : data.checkNbr == null || data.checkNbr == undefined ? 0 : 1
      }
      this.loadReconcilePaymentSummary(ReconcilePaymentResponseDto);
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
      filter:event.filter
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
    this.route.navigate([`/financial-management/claims/${this.claimsType}/batch`],
    { queryParams :{bid: this.batchId}});
  }
}

