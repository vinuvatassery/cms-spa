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
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import {  GridDataResult } from '@progress/kendo-angular-grid';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
import { PaymentBatchName } from '@cms/case-management/domain';
@Component({
  selector: 'cms-financial-claims-batches-log-lists',
  templateUrl: './financial-claims-batches-log-lists.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchesLogListsComponent implements OnInit, OnChanges {
  @ViewChild('previewSubmitPaymentDialogTemplate', { read: TemplateRef })
  previewSubmitPaymentDialogTemplate!: TemplateRef<any>;
  @ViewChild('unBatchClaimsDialogTemplate', { read: TemplateRef })
  unBatchClaimsDialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteClaimsConfirmationDialogTemplate', { read: TemplateRef })
  deleteClaimsConfirmationDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isBatchLogGridLoaderShow = false;
  isRequestPaymentClicked = false;
  isPrintAdviceLetterClicked = false;
  isUnBatchClaimsClosed = false;
  isDeleteClaimClosed = false;
  PreviewSubmitPaymentDialog: any;
  printAuthorizationDialog: any;
  UnBatchDialog: any;
  deleteClaimsDialog: any;

  bathcLogGridDataLst =[
    {
      item: 1,
      invoiceID:14323,
      providerName: 'Very Nice Provider 1',
      taxID:'1234', 
      paymentMethod:'ACH', 
      clientName:'Client 1', 
      nameOnPrimaryInsuranceCard:'Test User', 
      memberID:'12', 
      serviceCount:'1', 
      totalCost:'1000', 
      totalDue:'500', 
      paymentStatus:'InProgress', 
      by: 'by',
      vendorId: '3F111CFD-906B-4F56-B7E2-7FCE5A563C36',
      paymentRequestId: '012D6618-C464-41C1-852D-03584075A17B',
      paymentRequestBatchId: '1B9F14A7-A983-44A9-BDC9-9B85716BE4DD'
    },
    {
      item: 2,
      invoiceID:24533,
      providerName: 'Test Provider 2',
      taxID:'4321', 
      paymentMethod:'Check', 
      clientName:'Client 2', 
      nameOnPrimaryInsuranceCard:'John Deo', 
      memberID:'21', 
      serviceCount:'2', 
      totalCost:'2000', 
      totalDue:'800', 
      paymentStatus:'InProgress', 
      by: 'by',
      vendorId: '433D134A-99D4-4A67-9A7D-8773190035CD',
      paymentRequestId: 'AF1338C1-A6CC-4E76-8741-B9ABA59ABC99',
      paymentRequestBatchId: '1B9F14A7-A983-44A9-BDC9-9B85716BE4DD'
    }
  ];

  
  public bulkMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Request Payments',
      icon: 'local_atm',
      click: (data: any): void => {
      this.isRequestPaymentClicked = true;
      this.isPrintAdviceLetterClicked = false;
        
      },  
    },
    
    {
      buttonType: 'btn-h-primary',
      text: 'Reconcile Payments',
      icon: 'edit',
      click: (data: any): void => {
        this.navToReconcilePayments(data);
      },  
    },

    {
      buttonType: 'btn-h-primary',
      text: 'Print Advice Letters',
      icon: 'print',
      click: (data: any): void => {
        this.isRequestPaymentClicked = false;
        this.isPrintAdviceLetterClicked = true;
          
        },
    },
  ];

  public batchLogGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Claims',
      icon: 'edit',
      
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Unbatch Claims',
      icon: 'undo',
      click: (data: any): void => {
        if (!this.isUnBatchClaimsClosed) {
          this.isUnBatchClaimsClosed = true;
          this.onUnBatchOpenClicked(this.unBatchClaimsDialogTemplate);
        }
       
      }      
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Claims',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isDeleteClaimClosed) {
          this.isDeleteClaimClosed = true;
          this.onDeleteClaimsOpenClicked(this.deleteClaimsConfirmationDialogTemplate);
        }
       
      }

      
    },
  ];
  @Input() claimsType: any;
  @Input() batchId: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchLogGridLists$: any;
  @Input() loader$!: Observable<boolean>;
  @Input() paymentBatchName$!:  Observable<PaymentBatchName>;
  @Output() loadBatchLogListEvent = new EventEmitter<any>();
  public state!: State;
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
  gridClaimsBatchLogDataSubject = new Subject<any>();
  gridClaimsBatchLogData$ = this.gridClaimsBatchLogDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  gridColumns : {[key: string]: string} = {
    paymentNbr: 'Item #',
    invoiceNbr: 'Invoice ID',
    vendorName: 'Provider Name',
    tin: 'Tax ID',
    clientId: 'Member ID',
    clientFullName: 'Client Name',
    nameOnInsuranceCard:'Name on Primary Insurance Card',
    serviceCount: 'Service Count',
    serviceCost: 'Total Cost',
    amountDue: 'Total Due',
    paymentMethodCode:'Payment Method',
    paymentTypeCode:'Payment Type',
    paymentStatusCode:'Payment Status',
    clientMaximum:'Client Annual Total',
    balanceAmount:'Client Balance'
  };

  paymentMethods = ['CHECK', 'ACH', 'SPOTS'];
  paymentTypes = ['PAYMENT', 'REFUND', 'COPAYMENT', 'DEDUCTIBLE', 'FULL PAY'];
  paymentStatusList = ['SUBMITTED', 'PENDING_APPROVAL', 'DENIED', 'MANAGER_APPROVED', 'PAYMENT_REQUESTED', 'ONHOLD', 'FAILED', 'PAID'];
  paymentMethodFilter:string ='';
  paymentTypeFilter:string ='';
  paymentStatusFilter:string='';
  /** Constructor **/
  constructor(private route: Router,private dialogService: DialogService, public activeRoute: ActivatedRoute ) {}
  
  ngOnInit(): void { 
    this.sortColumnName = 'Item #';
    this.loadBatchLogListGrid();
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadBatchLogListGrid();
  }


  private loadBatchLogListGrid(): void {
    this.loadBatchLog(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  loadBatchLog(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isBatchLogGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: this.sortColumn ?? 'paymentNbr',
      sortType: sortTypeValue ?? 'asc',
      filter: this.filter
    };
    this.loadBatchLogListEvent.emit(gridDataRefinerValue);
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
    this.sortColumn = stateData.sort[0]?.field
    this.sortColumnName = this.gridColumns[this.sortColumn];
    this.filter = stateData?.filter?.filters;
    this.loadBatchLogListGrid();
  }

  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    if(field === 'paymentMethodCode'){
      this.paymentMethodFilter = value;
    }
    else if(field === 'paymentTypeCode'){
      this.paymentTypeFilter = value;
    }
    else if(field === 'paymentStatusCode'){
      this.paymentStatusFilter = value;
    }

    filterService.filter({
        filters: [{
          field: field,
          operator: "eq",
          value:value
      }],
        logic: "or"
    });
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchLogListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

   backToBatch(event : any){  
    this.route.navigate(['/financial-management/claims/' + this.claimsType ] ); 
  }

  goToBatchItems(event : any){   
    this.route.navigate([this.route.url, 'items'] ); 
  }

  paymentClickHandler(paymentRequestId: string){
    const batchId = this.activeRoute.snapshot.queryParams['bid'];
    this.route.navigate([this.route.url.split('?')[0] , 'items'], {
      queryParams: { bid: batchId, iid: paymentRequestId}
    }); 
  }
  navToReconcilePayments(event : any){  
    this.route.navigate(['/financial-management/claims/' + this.claimsType +'/batch/reconcile-payments'] ); 
  }
  public onPreviewSubmitPaymentOpenClicked(template: TemplateRef<unknown>): void {
    this.PreviewSubmitPaymentDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }

  onPreviewSubmitPaymentCloseClicked(result: any) {
    if (result) { 
      this.PreviewSubmitPaymentDialog.close();
    }
  }

  onBulkOptionCancelClicked(){
    this.isRequestPaymentClicked = false;
    this.isPrintAdviceLetterClicked = false;
  }

  onPrintAuthorizationOpenClicked(template: TemplateRef<unknown>): void {
    this.printAuthorizationDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-xlg',
    });
  }

 
  onPrintAuthorizationCloseClicked(result: any) {
    if (result) { 
      this.printAuthorizationDialog.close();
    }
  }


  onUnBatchOpenClicked(template: TemplateRef<unknown>): void {
    this.UnBatchDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

 
  onUnBatchCloseClicked(result: any) {
    if (result) { 
      this.isUnBatchClaimsClosed = false;
      this.UnBatchDialog.close();
    }
  }

  public onDeleteClaimsOpenClicked(template: TemplateRef<unknown>): void {
    this.deleteClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalDeleteClaimsModalClose(result: any) {
    if (result) { 
      this.deleteClaimsDialog.close();
    }
  }

  onSelectionChange(selectedKeys: any): void {
    if(selectedKeys.selectedRows.length > 0 || selectedKeys.deselectedRows.length > 0){
      if(selectedKeys.selectedRows[0] != undefined){
        selectedKeys.selectedRows.forEach((element:any) => {
          const eachSelectedRow = { ...element.dataItem, isChecked: true };
          this.selectedDataRows.push(eachSelectedRow);
        });
      }
      if(selectedKeys.deselectedRows[0] != undefined){
        selectedKeys.deselectedRows.forEach((element:any) => {
          this.selectedDataRows.splice(element.index);
        });
      }
      this.selectedCount = this.selectedDataRows.length;
    }
  }
 
}
