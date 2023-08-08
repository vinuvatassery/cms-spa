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
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FinancialClaimsFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-financial-claims-batches-reconcile-payments',
  templateUrl: './financial-claims-batches-reconcile-payments.component.html',
  styleUrls: ['./financial-claims-batches-reconcile-payments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchesReconcilePaymentsComponent implements OnInit, OnChanges{
  @ViewChild('PrintAuthorizationDialog', { read: TemplateRef })
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
  reconcileGridLists1$ = this.financialClaimsFacade.reconcileDataList$;
  @Input() reconcileBreakoutSummary$:any;
  @Input() reconcilePaymentBreakoutList$ :any;
  @Output() loadReconcileListEvent = new EventEmitter<any>();
  @Output() loadReconcileBreakoutSummaryEvent = new EventEmitter<any>();
  @Output() loadReconcilePaymentBreakoutListEvent = new EventEmitter<any>();
  batchId: any = '587B0312-1324-49F8-A91D-0657C93D19B2';
  entityId: any = '823E2464-0649-49DA-91E7-26DCC76A2A6B';
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
  //tareaCessationCounter: string="200";
  
  /** Constructor **/
  constructor(private route: Router,   private dialogService: DialogService, public activeRoute: ActivatedRoute,
    private readonly cd: ChangeDetectorRef,   private readonly financialClaimsFacade: FinancialClaimsFacade,) {}
  
  ngOnInit(): void {
    this.isBreakoutPanelShow=false;
    this.loadReconcilePaymentSummary(this.batchId,'0');
    //this.loadReconcileListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sortBatch,
    };
    this.gridDataHandle();
    this.loadReconcileListGrid();
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
    };
    this.loadReconcileListEvent.emit(gridDataRefinerValue);    
  }
 
  
  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'vendorName',
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
    this.loadReconcileListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadReconcileListGrid();
  }

  assignRowDataToMainList(dataItem:any){
      let ifExist = this.reconcilePaymentGridUpdatedResult.find((x:any)=>x.vendorId ===dataItem.vendorId);
      if(ifExist !== undefined){
        this.reconcilePaymentGridUpdatedResult.forEach((item: any, index: number) => {
          if (item.vendorId === ifExist.vendorId) {
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
          }
        });
      }
      else{
        this.reconcilePaymentGridUpdatedResult.push(dataItem);
      }
  }

  assignDataFromUpdatedResultToPagedResult(){
      this.reconcilePaymentGridPagedResult.data.forEach((item: any, index: number) => {
        let ifExist = this.reconcilePaymentGridUpdatedResult.find((x:any)=>x.vendorId ===item.vendorId);
        if (ifExist !== undefined && item.vendorId === ifExist.vendorId) {
          this.reconcilePaymentGridPagedResult.data[index].paymentReconciledDate = ifExist?.paymentReconciledDate;
          this.reconcilePaymentGridPagedResult.data[index].paymentSentDate = ifExist?.paymentSentDate;
          this.reconcilePaymentGridPagedResult.data[index].checkNbr = ifExist?.checkNbr;
          this.reconcilePaymentGridPagedResult.data[index].comments = ifExist?.comments;
          this.reconcilePaymentGridPagedResult.data[index].datePaymentRecInValid = ifExist?.datePaymentRecInValid;
          this.reconcilePaymentGridPagedResult.data[index].datePaymentRecInValidMsg = ifExist?.datePaymentRecInValidMsg;
          this.reconcilePaymentGridPagedResult.data[index].datePaymentSentInValid = ifExist?.datePaymentSentInValid;
          this.reconcilePaymentGridPagedResult.data[index].datePaymentSentInValidMsg = ifExist?.datePaymentSentInValidMsg;
          this.reconcilePaymentGridPagedResult.data[index].isPrintAdviceLetter = ifExist?.isPrintAdviceLetter;
          this.reconcilePaymentGridPagedResult.data[index].tAreaCessationCounter = ifExist?.tAreaCessationCounter;

        }
      });
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
     this.reconcileGridLists$.subscribe((data: any) => {
      this.reconcilePaymentGridPagedResult = data;
      this.assignDataFromUpdatedResultToPagedResult();
      this.tAreaVariablesInitiation(this.reconcilePaymentGridPagedResult.data);
      this.reconcilePaymentGridPagedResult = filterBy(
        this.reconcilePaymentGridPagedResult,
        this.filterData
      );
      this.isReconcileGridLoaderShow = false;
      this.gridClaimsReconcileDataSubject.next(this.reconcilePaymentGridPagedResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isReconcileGridLoaderShow = false;       
      }
      this.cd.detectChanges()
    });
     this.isReconcileGridLoaderShow = false;
     this.cd.detectChanges()
  }


  dateChange(enteredDate: Date,dataItem:any,type:any) {    
    const todayDate = new Date(); 
    switch (type.toUpperCase()) {
      case "DATE_PAYMENT_RECONCILED":
        if (enteredDate > todayDate) {  
          dataItem.datePaymentRecInValid = true;
          dataItem.datePaymentRecInValidMsg = "Future dates not allowed.";
        }     
        else{
          dataItem.datePaymentRecInValid = false;
          dataItem.datePaymentRecInValidMsg =null
        }
        break;
      case "DATE_PAYMENT_SENT":
        if (enteredDate > todayDate) {  
          dataItem.datePaymentSentInValid = true;
          dataItem.datePaymentSentInValidMsg ="Future dates not allowed.";
        }     
        else{
          dataItem.datePaymentSentInValid = false;
          dataItem.datePaymentSentInValidMsg =null;
        }
        break;        
    }  
    this.assignRowDataToMainList(dataItem); 
  }

  printAdviceLetterChange(dataItem:any){
    this.assignRowDataToMainList(dataItem);
  }
  noteChange(dataItem:any){
    this.calculateCharacterCount(dataItem)
    this.assignRowDataToMainList(dataItem);
  }
  
  private tAreaVariablesInitiation(dataItem:any) {
    dataItem.forEach((dataItem:any) => {
      this.calculateCharacterCount(dataItem);
    });
    
  }

  calculateCharacterCount(dataItem:any){
    let tAreaCessationCharactersCount = dataItem.comments
      ? dataItem.comments.length
      : 0;
      dataItem.tAreaCessationCounter = `${tAreaCessationCharactersCount}/${this.tAreaCessationMaxLength}`;
  }
  warrantNumberChange(dataItem:any){
    if(dataItem.checkNbr !== null  && dataItem.checkNbr !== undefined && dataItem.checkNbr !== ''){
      dataItem.isPrintAdviceLetter = true;
      dataItem.paymentReconciledDate = this.currentDate;
      dataItem.datePaymentRecInValid = false;
      dataItem.datePaymentRecInValidMsg = null;
      dataItem.datePaymentSentInValid = false;
      dataItem.datePaymentSentInValidMsg = null;
    }
    else{
      dataItem.isPrintAdviceLetter = false;
    }
    if(this.datePaymentReconciled === null || this.datePaymentReconciled === undefined){
    
    }
    this.assignRowDataToMainList(dataItem);
  }

  validateReconcileGridRecord() {
    this.reconcilePaymentGridPagedResult.data.forEach((currentPage: any, index: number) => {
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

    if (this.reconcilePaymentGridUpdatedResult.length > 0) {
      this.reconcilePaymentGridUpdatedResult.forEach((item: any, index: number) => {
        if ((this.reconcilePaymentGridUpdatedResult[index].checkNbr !== null
          && this.reconcilePaymentGridUpdatedResult[index].checkNbr !== ''
          && this.reconcilePaymentGridUpdatedResult[index].checkNbr !== undefined)) {
          if ((this.reconcilePaymentGridUpdatedResult[index].paymentReconciledDate === null
            && this.reconcilePaymentGridUpdatedResult[index].paymentReconciledDate === ''
            && this.reconcilePaymentGridUpdatedResult[index].paymentReconciledDate === undefined)) {
            this.reconcilePaymentGridUpdatedResult[index].datePaymentRecInValid = true;
            this.reconcilePaymentGridUpdatedResult[index].datePaymentRecInValidMsg = 'Date payment reconciled is required.';
          }      

          if (this.reconcilePaymentGridUpdatedResult[index].paymentSentDate === null
            && this.reconcilePaymentGridUpdatedResult[index].paymentSentDate === ''
            && this.reconcilePaymentGridUpdatedResult[index].paymentSentDate === undefined) {
            this.reconcilePaymentGridUpdatedResult[index].datePaymentSentInValid = true;
            this.reconcilePaymentGridUpdatedResult[index].datePaymentSentInValidMsg = 'Date payment sent is required.';
          }
        }
        else {
          this.reconcilePaymentGridUpdatedResult[index].datePaymentRecInValid = false;
          this.reconcilePaymentGridUpdatedResult[index].datePaymentRecInValidMsg = null;
          this.reconcilePaymentGridUpdatedResult[index].datePaymentSentInValid = false;
          this.reconcilePaymentGridUpdatedResult[index].datePaymentSentInValidMsg = null;
        }      
      });
    }

    this.assignPagedGridItemToUpdatedList(this.reconcilePaymentGridPagedResult.data);

  }

  assignPagedGridItemToUpdatedList(dataItem:any){
    dataItem.forEach((item:any) => {
       this.assignRowDataToMainList(item);
    })
      
  }
  public onPrintAuthorizationOpenClicked(template: TemplateRef<unknown>): void {
    this.validateReconcileGridRecord();
    let isValid = this.reconcilePaymentGridUpdatedResult.filter((x:any)=>x.datePaymentSentInValid || x.datePaymentRecInValid);
    if(isValid.length<=0){
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
     navToBatchDetails(event : any){  
      this.route.navigate(['/financial-management/claims/' + this.claimsType] );
 
     }

    toggleBreakoutPanel()
    {
      this.isBreakoutPanelShow=!this.isBreakoutPanelShow;
    }

    loadBreakOutDetailOnRowClick(batchId:any,entityId:any)
    {
      this.loadReconcilePaymentSummary(batchId,entityId);
      this.loadReconcilePaymentBreakoutListEvent.emit({
        batchId: batchId,
        entityId: entityId,
        skipCount:0, 
        pageSize:this.pageSizes[0]?.value, 
        sort:this.sort,
        sortType:this.sortType
      });
      this.isBreakoutPanelShow=true;
    }

    loadReconcilePaymentSummary(batchId:any,entityId:any)
    {
      this.loadReconcileBreakoutSummaryEvent.emit({batchId: batchId, entityId: entityId});
    }

  loadReconcilePaymentBreakOutGridList(event:any)
  {
    this.loadReconcilePaymentBreakoutListEvent.emit({
      batchId: this.batchId,
      entityId: this.entityId,
      skipCount:event.skipCount, 
      pageSize:event.pagesize, 
      sort:event.sortColumn,
      sortType:event.sortType
    });
  }
}

