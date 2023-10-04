/** Angular **/
import { 
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { Router } from '@angular/router';
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subject, debounceTime } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LovFacade } from '@cms/system-config/domain';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Component({
  selector: 'productivity-tools-approvals-payments-list',
  templateUrl: './approvals-payments-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsPaymentsListComponent implements OnInit, OnChanges{ 
  isSubmitApprovalPaymentItems = false;
  isViewPaymentsBatchDialog = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isApprovalPaymentsGridLoaderShow = false;
  selectedApprovalId?: string | null = null;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() approvalsPaymentsLists$: any;
  @Input() approvalsPaymentsMainLists$: any;
  @Input() pendingApprovalSubmittedSummary$: any;
  @Input() batchDetailPaymentsList$: any;
  @Output() loadApprovalsPaymentsGridEvent = new EventEmitter<any>();
  @Output() loadApprovalsPaymentsMainListEvent = new EventEmitter<any>();
  @Output() loadSubmittedSummaryEvent = new EventEmitter<any>();
  @Output() loadBatchDetailPaymentsGridEvent = new EventEmitter<any>();
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

  approveStatus:string="APPROVE";
  sendbackStatus:string="SENDBACK";
  hasPaymentPendingApproval:boolean=false;
  sendbackNotesRequireMessage:string = "Send Back Notes is required.";
  tAreaCessationMaxLength:any=100;
  approveBatchCount:any=0;
  sendbackBatchCount:any=0;
  pageValidationMessage:any=null;
  isApproveAllClicked : boolean = false;
  approvalsPaymentsGridPagedResult:any =[];
  approvalsPaymentsGridUpdatedResult: any=[];
  selectedApprovalSendbackDataRows: any[] = [];
  selectedBatchIds: any = [];
  totalAmountSubmitted:any=0;
  requestedCheck:any=0;
  requestedACHPayments:any=0;
  requestedDORHoldPayments:any=0;
  gridApprovalPaymentsMainListDataSubject = new Subject<any>();
  gridApprovalPaymentsMainList$ = this.gridApprovalPaymentsMainListDataSubject.asObservable();

  approvalPaymentsSubmittedSummaryDataSubject = new Subject<any>();
  approvalPaymentsSubmittedSummaryData$ = this.approvalPaymentsSubmittedSummaryDataSubject.asObservable();
  selectedPaymentType: any;
  batchDetailModalSourceList:any;

  gridApprovalPaymentsDataSubject = new Subject<any>();
  gridApprovalPaymentsBatchData$ = this.gridApprovalPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  gridColumns: { [key: string]: string } = {
    ALL: 'All Columns',
    batchName: 'Batch',
    providerCount: 'Provider Count',
    totalAmountDue: 'Total Amount',
    carrierCount: 'Carrier Count',
    totalPayments: 'Pmt Count',
    totalClaims: 'Premium Count',
    creationTime: 'Date Approval Requested'
  };

  searchColumnList: { columnName: string, columnDesc: string }[] = [
    { columnName: 'ALL', columnDesc: 'All Columns' },
    { columnName: 'batchName', columnDesc: 'Batch' },
    { columnName: 'creationTime', columnDesc: 'Date Approval Requested' },
  ];
  selectedSearchColumn = 'ALL';
  filteredByColumnDesc = '';
  showDateSearchWarning = false;
  columnChangeDesc = 'Default Columns'
  searchText = '';
  private searchSubject = new Subject<string>();
  
  private depositDetailsDialog: any;

  pendingApprovalPaymentType$ = this.lovFacade.pendingApprovalPaymentType$;
  
  /** Constructor **/
  constructor(private route: Router, 
    private dialogService: DialogService,private readonly cd: ChangeDetectorRef,
    private lovFacade: LovFacade,
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider) {}

  ngOnInit(): void {
    this.gridDataHandle();
    this.loadApprovalPaymentsListGrid();    
    this.lovFacade.getPandingApprovalPaymentTypeLov();
    this.addSearchSubjectSubscription();
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadApprovalPaymentsListGrid();
  }

  searchColumnChangeHandler(value: string) {
    this.filter = [];
    this.showDateSearchWarning = value === 'creationTime';
    if (this.searchText) {
      this.onPendingApprovalSearch(this.searchText);
    }
  }

  onPendingApprovalSearch(searchValue: any) {console.log('searchValue',searchValue);
    const isDateSearch = searchValue.includes('/');
    this.showDateSearchWarning = isDateSearch || this.selectedSearchColumn === 'creationTime';
    searchValue = this.formatSearchValue(searchValue, isDateSearch);
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    //this.searchSubject.next(searchValue);
    this.onChange(searchValue);
  }

  performPendingApprovalSearch(data: any) {
    this.defaultGridState();
    const operator = (['creationTime']).includes(this.selectedSearchColumn) ? 'eq' : 'startswith';
    // data = this.selectedSearchColumn === 'appropriationYear' ? data.toLowerCase().replace('ay', '') : data;
    if (this.selectedSearchColumn === 'creationTime' && (!this.isValidDate(data) && data !== '')) {
      return;
    }
    // if ((['pcaCode', 'appropriationYear']).includes(this.selectedSearchColumn) && isNaN(Number(data))) {
    //   return;
    // }
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'batchName',
              operator: operator,
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };
    const stateData = this.state;
    stateData.filter = this.filterData;
    this.dataStateChange(stateData);
    this.loadApprovalPaymentsListGrid();
  }
  
  onCloseSubmitApprovalPaymentItemsClicked(){
    this.isSubmitApprovalPaymentItems = false;
  }

  onOpenViewPaymentsBatchClicked(data?:any){
    this.isViewPaymentsBatchDialog = true;
    this.selectedApprovalId = data?.approvalId;
    this.batchDetailModalSourceList = this.approvalsPaymentsGridUpdatedResult.map((item:any)=>({...item}));
  }

  onCloseViewPaymentsBatchClicked(){
    this.isViewPaymentsBatchDialog = false;
  }

  onBatchModalSaveClicked(data:any){
    this.isViewPaymentsBatchDialog = false;
    this.approvalsPaymentsGridUpdatedResult = data.map((item:any)=>({...item}));
    this.loadApprovalPaymentsListGrid();
  }

  onLoadBatchDetailPaymentsList(data?:any){
    this.loadBatchDetailPaymentsGridEvent.emit(data);
  }
  private loadApprovalPaymentsListGrid(): void {
    this.loadApprovalPayments(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadApprovalPayments(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isApprovalPaymentsGridLoaderShow = false;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter: JSON.stringify(this.filter),
    };
        let selectedPaymentType = this.selectedPaymentType;
    this.loadApprovalsPaymentsGridEvent.emit({gridDataRefinerValue, selectedPaymentType});    
  }

  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'batchName',
              operator: this.selectedSearchColumn == 'creationTime'? 'eq' : 'startswith',
              value: data,
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

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
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
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, '', this.filter);
    this.loadApprovalPaymentsListGrid();    
    this.sortByProperty();
  }

  private setFilterBy(isFromGrid: boolean, searchValue: any = '', filter: any = []) {
    this.filteredByColumnDesc = '';
    if (isFromGrid) {
      if (filter.length > 0) {
        const filteredColumns = this.filter?.map((f: any) => {
          const filteredColumns = f.filters?.filter((fld:any)=> fld.value)?.map((fld: any) =>
            this.gridColumns[fld.field])
          return ([...new Set(filteredColumns)]);
        });

        this.filteredByColumnDesc = ([...new Set(filteredColumns)])?.sort()?.join(', ') ?? '';
      }
      return;
    }

    if (searchValue !== '') {
      this.filteredByColumnDesc = this.searchColumnList?.find(i => i.columnName === this.selectedSearchColumn)?.columnDesc ?? '';
    }
    console.log('this.filteredByColumnDesc',this.filteredByColumnDesc);
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadApprovalPaymentsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  

  onDepositDetailClicked(  template: TemplateRef<unknown>): void {   
    this.depositDetailsDialog = this.dialogService.open({
      content: template,
      animation:{
        direction: 'left',
        type: 'slide',  
      }, 
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }

  onCloseDepositDetailClicked(){
    this.depositDetailsDialog.close();
  }

  onPaymentTypeCodeValueChange(paymentSubTypeCode: any){
    this.selectedPaymentType = paymentSubTypeCode;    
    this.loadApprovalPaymentsListGrid();
    this.mainListDataHandle();
    this.selectedSearchColumn = 'ALL';  
    this.cd.detectChanges();   
  }

  onRowLevelApproveClicked(e: boolean,dataItem: any, control: any, rowIndex: any)
  {
    dataItem.approveButtonDisabled=false;
    dataItem.sendBackButtonDisabled=true;
    dataItem.sendBackNotes="";
    if(dataItem.batchStatus === undefined || dataItem.batchStatus === '' || dataItem.batchStatus === null)
    {
      dataItem.batchStatus=this.approveStatus;
    } 
    else if(dataItem.batchStatus == this.approveStatus)   
    {
      dataItem.batchStatus="";
      dataItem.sendBackNotesInValidMsg="";
      dataItem.sendBackNotesInValid = false;
      dataItem.sendBackButtonDisabled=true;
    }
    else if(dataItem.batchStatus == this.sendbackStatus) 
    {
      dataItem.batchStatus=this.approveStatus;
      dataItem.sendBackNotesInValidMsg="";
      dataItem.sendBackNotesInValid = false;  
      dataItem.sendBackButtonDisabled=true;
    }
    this.sendBackNotesChange(dataItem);
    this.assignRowDataToMainList(dataItem);
    this.ngDirtyInValid(dataItem,control,rowIndex);
    this.approveAndSendbackCount();
  }

  onRowLevelSendbackClicked(e: boolean,dataItem: any, control: any, rowIndex: any)
  {
    dataItem.approveButtonDisabled=true;
    dataItem.sendBackButtonDisabled=false;
    if(dataItem.batchStatus === undefined || dataItem.batchStatus === '' || dataItem.batchStatus === null)
    {
      dataItem.batchStatus=this.sendbackStatus;  
      dataItem.sendBackNotesInValidMsg= this.sendbackNotesRequireMessage;
      dataItem.sendBackNotesInValid = true;    
    }   
    else if(dataItem.batchStatus == this.sendbackStatus)   
    {
      dataItem.batchStatus="";
      dataItem.sendBackNotesInValidMsg="";
      dataItem.sendBackNotesInValid = false;
      dataItem.sendBackButtonDisabled=true;
    }
    else
    {
      dataItem.batchStatus=this.sendbackStatus;
      dataItem.sendBackNotesInValidMsg=this.sendbackNotesRequireMessage;
      dataItem.sendBackNotesInValid = true;
      dataItem.sendBackButtonDisabled=false;
    } 
   
    this.sendBackNotesChange(dataItem);    
    this.assignRowDataToMainList(dataItem);
    this.ngDirtyInValid(dataItem,control,rowIndex);
    this.isApproveAllClicked = false; 
    this.approveAndSendbackCount(); 
  }  

  private tAreaVariablesInitiation(dataItem: any) {
    dataItem.forEach((dataItem: any) => {
      this.calculateCharacterCount(dataItem);
    });
  }

  calculateCharacterCount(dataItem: any) {
    let tAreaCessationCharactersCount = dataItem.sendBackNotes
      ? dataItem.sendBackNotes.length
      : 0;
    dataItem.tAreaCessationCounter = `${tAreaCessationCharactersCount}/${this.tAreaCessationMaxLength}`;
  }
  
  gridDataHandle() {
    this.approvalsPaymentsLists$.subscribe((response: any) => {
      
      if (response.data.length > 0) {
        this.assignDataFromUpdatedResultToPagedResult(response);
        this.tAreaVariablesInitiation(this.approvalsPaymentsGridPagedResult);
        this.isApprovalPaymentsGridLoaderShow = false;
        this.gridApprovalPaymentsDataSubject.next(this.approvalsPaymentsGridPagedResult);
        if (response?.total >= 0 || response?.total === -1) {
          this.isApprovalPaymentsGridLoaderShow = false;
        }
        this.cd.detectChanges();
      }
      else {
        this.approvalsPaymentsGridPagedResult = response;
        this.isApprovalPaymentsGridLoaderShow = false;
        this.cd.detectChanges();
      }
    });
    this.isApprovalPaymentsGridLoaderShow = false;
    this.cd.detectChanges();
  }

  assignDataFromUpdatedResultToPagedResult(itemResponse: any) {
    itemResponse.data.forEach((item: any, index: number) => {
      itemResponse.data[index].sendBackButtonDisabled=true;
      itemResponse.data[index].sendBackNotes=""; 
      itemResponse.data[index].batchStatus ="";
      let ifExist = this.approvalsPaymentsGridUpdatedResult.find((x: any) => x.approvalId === item.approvalId);
      if (ifExist !== undefined && item.approvalId === ifExist.approvalId) {
        
        itemResponse.data[index].approvalId = ifExist?.approvalId;
        itemResponse.data[index].paymentRequestBatchId = ifExist?.paymentRequestBatchId;
        itemResponse.data[index].batchName = ifExist?.batchName;
        itemResponse.data[index].totalAmountDue = ifExist?.totalAmountDue;
        itemResponse.data[index].providerCount = ifExist?.providerCount;
        itemResponse.data[index].totalPayments = ifExist?.totalPayments;
        itemResponse.data[index].totalClaims = ifExist?.totalClaims;
        itemResponse.data[index].sendBackNotes = ifExist?.sendBackNotes;
        itemResponse.data[index].sendBackNotesInValidMsg = ifExist?.sendBackNotesInValidMsg;
        itemResponse.data[index].sendBackNotesInValid = ifExist?.sendBackNotesInValid;
        itemResponse.data[index].tAreaCessationCounter = ifExist?.tAreaCessationCounter;
        itemResponse.data[index].batchStatus = ifExist?.batchStatus;
      }
    });
   
    this.approvalsPaymentsGridPagedResult = itemResponse.data;
    
  }

  sendBackNotesChange(dataItem: any) {
    this.calculateCharacterCount(dataItem);
    this.assignRowDataToMainList(dataItem);
  }   

  ngDirtyInValid(dataItem: any, control: any, rowIndex: any) {
    let inValid = false;    
    
    if (control === 'sendBackNotes') {
      dataItem.sendBackNotesInValid = (dataItem.batchStatus == this.sendbackStatus && dataItem.sendBackNotes.length <= 0);
      dataItem.sendBackNotesInValidMsg = (dataItem.batchStatus == this.sendbackStatus && dataItem.sendBackNotes.length <= 0) ? this.sendbackNotesRequireMessage : "";
      inValid =  dataItem.sendBackNotesInValid;
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

  updatedResultValidationSendBack(index: any) {    
    if (this.approvalsPaymentsGridUpdatedResult[index].sendBackNotes === null
      || this.approvalsPaymentsGridUpdatedResult[index].sendBackNotes === ''
      || this.approvalsPaymentsGridUpdatedResult[index].sendBackNotes === undefined) {
      this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValid = true;
      this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValidMsg = this.sendbackNotesRequireMessage;          
    }
    else
    {
      this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValid = false;
      this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValidMsg = null; 
    }
  }

  updatedResultValidation() {
    if (this.approvalsPaymentsGridUpdatedResult.length > 0) {
      this.approvalsPaymentsGridUpdatedResult.forEach((item: any, index: number) => { 
            if (this.approvalsPaymentsGridUpdatedResult[index].batchStatus==this.sendbackStatus) {
              this.updatedResultValidationSendBack(index);
            }
            else {
              this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValid = false;
              this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValidMsg = null;
            }
        }
      );
    }
  }

  onOpenSubmitApprovalPaymentItemsClicked(){
    this.validateApprovalsPaymentsGridRecord();
    const isValid = this.approvalsPaymentsGridUpdatedResult.filter((x: any) => x.sendBackNotesInValid);
    const totalCount = isValid.length;
    if (isValid.length > 0) {
      this.pageValidationMessage = totalCount +  " validation errors found, please review each page for errors.";
    }
    else if(this.approvalsPaymentsGridUpdatedResult.filter((x: any) => x.batchStatus == this.approveStatus || x.batchStatus == this.sendbackStatus).length <= 0){
      this.pageValidationMessage = "No data for approval";
    }
    else {
      this.pageValidationMessage = "validation errors are cleared";
      this.selectedApprovalSendbackDataRows = this.approvalsPaymentsGridUpdatedResult.filter((x: any) => x.batchStatus == this.approveStatus || x.batchStatus == this.sendbackStatus);
    }
    this.selectedBatchIds = [];
    if (isValid.length <= 0 && this.selectedApprovalSendbackDataRows.length>0) {
      this.loadSubmittedSummaryData();   
      this.isSubmitApprovalPaymentItems = true;     
    }
  }

  onApproveAllClicked(){
    this.isApproveAllClicked=true;
    if(this.isApproveAllClicked)
    {
      this.approvalsPaymentsGridPagedResult.forEach((currentPage: any, index: number) => {
        currentPage.batchStatus=this.approveStatus;
        currentPage.sendBackNotesInValid=false;
        currentPage.sendBackNotesInValidMsg="";
        currentPage.sendBackButtonDisabled=true;
        this.assignRowDataToMainList(currentPage);
      });

      this.approvalsPaymentsGridUpdatedResult.forEach((currentPage: any, index: number) => {
        currentPage.batchStatus=this.approveStatus;
        currentPage.sendBackNotesInValid=false;
        currentPage.sendBackNotesInValidMsg="";
        currentPage.sendBackButtonDisabled=true;       
        this.assignRowDataToMainList(currentPage);
      });
    }
    this.approveAndSendbackCount();
  }

  validateApprovalsPaymentsGridRecord() {
    this.approvalsPaymentsGridPagedResult.forEach((currentPage: any, index: number) => {
      
      if (currentPage.batchStatus !== null
        && currentPage.batchStatus === this.sendbackStatus
        && currentPage.batchStatus !== undefined) {
        if (currentPage.sendBackNotes == null || currentPage.sendBackNotes === undefined || currentPage.sendBackNotes === '') {
          currentPage.sendBackNotesInValid = true;
          currentPage.sendBackNotesInValidMsg = this.sendbackNotesRequireMessage;
        }
      }
      else {
        currentPage.sendBackNotesInValid = false;
        currentPage.sendBackNotesInValidMsg = null;
      }
    });

    this.updatedResultValidation();
    this.assignPagedGridItemToUpdatedList(this.approvalsPaymentsGridPagedResult);
  }

  assignPagedGridItemToUpdatedList(dataItem: any) {
    dataItem.forEach((item: any) => {
      this.assignRowDataToMainList(item);
    })
  }

  assignRowDataToMainList(dataItem: any) {
    let ifExist = this.approvalsPaymentsGridUpdatedResult.find((x: any) => x.approvalId === dataItem.approvalId);
    if (ifExist !== undefined) {
      this.approvalsPaymentsGridUpdatedResult.forEach((item: any, index: number) => {
        if (item.approvalId === ifExist.approvalId) {
          this.approvalsPaymentsGridUpdatedResult[index].approvalId = ifExist?.approvalId;
          this.approvalsPaymentsGridUpdatedResult[index].paymentRequestBatchId = ifExist?.paymentRequestBatchId;
          this.approvalsPaymentsGridUpdatedResult[index].batchName = ifExist?.batchName;
          this.approvalsPaymentsGridUpdatedResult[index].totalAmountDue = ifExist?.totalAmountDue;
          this.approvalsPaymentsGridUpdatedResult[index].providerCount = ifExist?.providerCount;
          this.approvalsPaymentsGridUpdatedResult[index].totalPayments = ifExist?.totalPayments;
          this.approvalsPaymentsGridUpdatedResult[index].totalClaims = ifExist?.totalClaims;
          this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValidMsg = dataItem?.sendBackNotesInValidMsg;
          this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValid = dataItem?.sendBackNotesInValid;
          this.approvalsPaymentsGridUpdatedResult[index].tAreaCessationCounter = dataItem?.tAreaCessationCounter;          
          this.approvalsPaymentsGridUpdatedResult[index].batchStatus = dataItem?.batchStatus;
          this.approvalsPaymentsGridUpdatedResult[index].sendBackNotes = dataItem?.sendBackNotes;
        }
      });
    }
    else {
      this.approvalsPaymentsGridUpdatedResult.push(dataItem);
    }
  }
  
  approveAndSendbackCount()
  {
      this.approveBatchCount=0;
      this.sendbackBatchCount=0;
      this.approvalsPaymentsGridUpdatedResult.forEach((item: any, index: number) => {        
      this.approveBatchCount = item.batchStatus == this.approveStatus ? this.approveBatchCount + 1 : this.approveBatchCount;
      this.sendbackBatchCount = item.batchStatus == this.sendbackStatus ? this.sendbackBatchCount + 1 : this.sendbackBatchCount;
    });
  }

  mainListDataHandle() {
    const gridDataRefinerValue = {
      skipCount: 0,
      pagesize: 99999,
      sortColumn: this.sortValue,
      sortType: this.sortType,
    };
    let selectedPaymentType = this.selectedPaymentType;
    this.loadApprovalsPaymentsMainListEvent.emit({gridDataRefinerValue, selectedPaymentType});
    this.approvalsPaymentsGridUpdatedResult = [];
    this.hasPaymentPendingApproval=false;
    this.approvalsPaymentsMainLists$.subscribe((response: any) => {
      if (response.data.length > 0) {       
        this.approvalsPaymentsGridUpdatedResult=response.data.map((item:any) => ({  
          ...item,           
          sendBackNotesInValidMsg: '', 
          sendBackNotesInValid : false,
          batchStatus : '',
          sendBackNotes : ''
          }));  
          this.hasPaymentPendingApproval=response.data.length > 0;
          this.cd.detectChanges();
        this.gridApprovalPaymentsMainListDataSubject.next(this.approvalsPaymentsGridUpdatedResult);
      }
    });
  }

  sortByProperty() {
    const ascending=this.sortType == "asc";
    if(this.approvalsPaymentsGridUpdatedResult.length >=0)
    {      
      this.approvalsPaymentsGridUpdatedResult.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
            if (ascending) {
             return this.sortListAscendingOrder(a[this.sortValue],b[this.sortValue]) ;            
        } else {
          return this.sortListDescendingOrder(a[this.sortValue],b[this.sortValue]); 
        }
      });   
      this.cd.detectChanges();    
    }
  }

  sortListAscendingOrder(a:any,b:any)
  {
    if(a < b){return -1;}
    else if (a > b){return 1;}
    else{return 0;}
  }
  sortListDescendingOrder(a:any,b:any)
  {
    if(b < a){return -1;}
    else if (b > a){return 1;}
    else{return 0;}
  }

  loadSubmittedSummaryData()
  {
    this.selectedApprovalSendbackDataRows.filter((x: any) => x.batchStatus == this.approveStatus).forEach((currentPage: any, index: number) => {
      this.selectedBatchIds.push(currentPage.paymentRequestBatchId);
    });
    this.loadSubmittedSummaryEvent.emit(this.selectedBatchIds);    
    this.pendingApprovalSubmittedSummary$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.requestedCheck = response?.checkCount;
        this.requestedACHPayments=response?.achCount;
        this.requestedDORHoldPayments = response?.dorHoldCount;
        this.totalAmountSubmitted = response?.totalAmount; 
        this.cd.detectChanges();
      }
    });        
  }

  private addSearchSubjectSubscription() {
    this.searchSubject.pipe(debounceTime(300))
      .subscribe((searchValue) => {
        this.onChange(searchValue);
      });
  }

  private isValidDate = (searchValue: any) => isNaN(searchValue) && !isNaN(Date.parse(searchValue));

  private formatSearchValue(searchValue: any, isDateSearch: boolean) {
    if (isDateSearch) {
      if (this.isValidDate(searchValue)) {
        return this.intl.formatDate(new Date(searchValue), this.configProvider?.appSettings?.dateFormat);
      }
      else {
        return '';
      }
    }

    return searchValue;
  }
}
