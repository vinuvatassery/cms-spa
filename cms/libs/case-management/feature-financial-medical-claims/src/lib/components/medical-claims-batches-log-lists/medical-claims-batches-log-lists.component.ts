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
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'cms-medical-claims-batches-log-lists',
  templateUrl: './medical-claims-batches-log-lists.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsBatchesLogListsComponent implements OnInit, OnChanges {
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

  bathcLogGridDataLst =[
    {
      item: 1,
      invoiceID:1,
      providerName: 'Very Nice Provider',
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
    },
    {
      item: 2,
      invoiceID:2,
      providerName: 'Test Provider',
      taxID:'4321', 
      paymentMethod:'Check', 
      clientName:'Client Client', 
      nameOnPrimaryInsuranceCard:'John Deo', 
      memberID:'21', 
      serviceCount:'2', 
      totalCost:'2000', 
      totalDue:'800', 
      paymentStatus:'InProgress', 
      by: 'by',
    }
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
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchLogGridLists$: any;
  @Output() loadVendorRefundBatchListEvent = new EventEmitter<any>();
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
  gridClaimsBatchLogDataSubject = new Subject<any>();
  gridClaimsBatchLogData$ = this.gridClaimsBatchLogDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  selectedDataRows: any[] = [];
  selectedKeys: any[] = [];
  selectedCount: number = 0;
  onlyPrintAdviceLetter : boolean = true;
   
  /** Constructor **/
  constructor(private route: Router,private dialogService: DialogService ) {}
  
  ngOnInit(): void {
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
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadVendorRefundBatchListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
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
    this.loadBatchLogListGrid();
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

  gridDataHandle() {
    this.batchLogGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridClaimsBatchLogDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isBatchLogGridLoaderShow = false;
      }
    });
    this.isBatchLogGridLoaderShow = false;
  }

   backToBatch(event : any){  
    this.route.navigate(['/financial-management/medical-claims'] );
  }

  goToBatchItems(event : any){  
    this.route.navigate(['/financial-management/medical-claims/batch/items'] );
  }

  navToReconcilePayments(event : any){  
    this.route.navigate(['/financial-management/medical-claims/batch/reconcile-payments'] );
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
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
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
          this.selectedDataRows.push(element.dataItem);
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
