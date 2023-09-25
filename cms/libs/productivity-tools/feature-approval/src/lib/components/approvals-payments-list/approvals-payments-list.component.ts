/** Angular **/
import { 
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ChangeDetectorRef
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { Router } from '@angular/router';
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'productivity-tools-approvals-payments-list',
  templateUrl: './approvals-payments-list.component.html', 
})
export class ApprovalsPaymentsListComponent implements OnInit, OnChanges{ 
  isSubmitApprovalPaymentItems = false;
  isViewPaymentsBatchDialog = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isApprovalPaymentsGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() approvalsPaymentsLists$: any;
  @Output() loadApprovalsPaymentsGridEvent = new EventEmitter<any>();
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

  /* Vikas Work Start */
  approveStatus:string="APPROVE";
  sendbackStatus:string="SENDBACK";
  sendbackNotesRequireMessage:string = "Send Back Notes is required.";
  tAreaCessationMaxLength:any=100;
  approveBatchCount:any=0;
  sendbackBatchCount:any=0;
  pageValidationMessage:any=null;
  isApproveAllClicked : boolean = false;
  approvalsPaymentsGridPagedResult:any =[];
  approvalsPaymentsGridUpdatedResult: any=[];
  selectedApprovalSendbackDataRows: any[] = [];
  /* Vikas Work End */
  selectedPaymentType: any;

  gridApprovalPaymentsDataSubject = new Subject<any>();
  gridApprovalPaymentsBatchData$ = this.gridApprovalPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  
  
  private depositDetailsDialog: any;

  pendingApprovalPaymentType$ = this.lovFacade.pendingApprovalPaymentType$;
  
  /** Constructor **/
  constructor(private route: Router, 
    private dialogService: DialogService,private readonly cd: ChangeDetectorRef,
    private lovFacade: LovFacade) {}

  ngOnInit(): void {
    this.gridDataHandle();
    this.loadApprovalPaymentsListGrid();
    this.lovFacade.getPandingApprovalPaymentTypeLov();
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadApprovalPaymentsListGrid();
  }
  
  onCloseSubmitApprovalPaymentItemsClicked(){
    this.isSubmitApprovalPaymentItems = false;
  }

  onOpenViewPaymentsBatchClicked(){
    this.isViewPaymentsBatchDialog = true;
  }
  onCloseViewPaymentsBatchClicked(){
    this.isViewPaymentsBatchDialog = false;
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
              field: this.selectedColumn ?? 'batch',
              operator: 'startswith',
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
    this.loadApprovalPaymentsListGrid();
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
  }

  onRowLevelApproveClicked(dataItem: any, control: any, rowIndex: any)
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

  onRowLevelSendbackClicked(dataItem: any, control: any, rowIndex: any)
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
      if (response.length > 0) {
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
    itemResponse.forEach((item: any, index: number) => {
      itemResponse[index].sendBackButtonDisabled=false;
      itemResponse[index].sendBackNotes=""; 
      itemResponse[index].batchStatus =this.sendbackStatus;
      let ifExist = this.approvalsPaymentsGridUpdatedResult.find((x: any) => x.id === item.id);
      if (ifExist !== undefined && item.id === ifExist.id) {
        itemResponse[index].id = ifExist?.id
        itemResponse[index].sendBackNotes = ifExist?.sendBackNotes;
        itemResponse[index].sendBackNotesInValidMsg = ifExist?.sendBackNotesInValidMsg;
        itemResponse[index].sendBackNotesInValid = ifExist?.sendBackNotesInValid;
        itemResponse[index].tAreaCessationCounter = ifExist?.tAreaCessationCounter;
        itemResponse[index].batchStatus = ifExist?.batchStatus;
      }
    });
   
    this.approvalsPaymentsGridPagedResult = itemResponse;
    
  }

  sendBackNotesChange(dataItem: any) {
    this.calculateCharacterCount(dataItem);
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
      this.pageValidationMessage = "validation errors found, please review each page for errors " +
        totalCount + " is the total number of validation errors found.";
    }
    else if(this.approvalsPaymentsGridUpdatedResult.filter((x: any) => x.batchStatus == this.approveStatus || x.batchStatus == this.sendbackStatus).length <= 0){
      this.pageValidationMessage = "No data for approval";
    }
    else {
      this.pageValidationMessage = "validation errors are cleared";
      this.selectedApprovalSendbackDataRows = this.approvalsPaymentsGridUpdatedResult.filter((x: any) => x.batchStatus == this.approveStatus || x.batchStatus == this.sendbackStatus);
    }
    if (isValid.length <= 0 && this.selectedApprovalSendbackDataRows.length>0) {
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
    let ifExist = this.approvalsPaymentsGridUpdatedResult.find((x: any) => x.id === dataItem.id);
    if (ifExist !== undefined) {
      this.approvalsPaymentsGridUpdatedResult.forEach((item: any, index: number) => {
        if (item.id === ifExist.id) {
          this.approvalsPaymentsGridUpdatedResult[index].id = dataItem.id;
          this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValidMsg = dataItem?.sendBackNotesInValidMsg;
          this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValid = dataItem?.sendBackNotesInValid;
          this.approvalsPaymentsGridUpdatedResult[index].tAreaCessationCounter = dataItem?.tAreaCessationCounter;
          debugger;
          this.approvalsPaymentsGridUpdatedResult[index].batchStatus = dataItem?.batchStatus;
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
}
