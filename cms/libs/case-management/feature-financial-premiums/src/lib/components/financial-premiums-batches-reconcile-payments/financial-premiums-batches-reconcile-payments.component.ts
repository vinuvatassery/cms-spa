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
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
@Component({
  selector: 'cms-financial-premiums-batches-reconcile-payments',
  templateUrl: './financial-premiums-batches-reconcile-payments.component.html',
  styleUrls: ['./financial-premiums-batches-reconcile-payments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchesReconcilePaymentsComponent implements OnInit, OnChanges{
  @ViewChild('PrintAuthorizationDialog', { read: TemplateRef })
  PrintAuthorizationDialog!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isReconcileGridLoaderShow = false;
  printAuthorizationDialog : any;
  LeavePageDialog: any;
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
  @Input() claimsType: any;
  entityId: any;
  public isBreakoutPanelShow:boolean=true;
  @Output() loadReconcileBreakoutSummaryEvent = new EventEmitter<any>();
  @Output() loadReconcilePaymentBreakoutListEvent = new EventEmitter<any>();
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
  
  
  /** Constructor **/
  constructor(private route: Router,   private dialogService: DialogService ) {}
  
  ngOnInit(): void {
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
      sort: this.sort,
    };

    this.loadReconcileListGrid();
  }


  private loadReconcileListGrid(): void {
    this.loadReconcile(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
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
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadReconcileListEvent.emit(gridDataRefinerValue);
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
    this.loadReconcileListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadReconcileListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  reconcileGridLists = [
    {
      type: 14534,
      clientName:'Cheque',
      vendorName: 'Very Nice Provider 1',
      refundWarrant:'1234', 
      refundAmount:'1000', 
      depositDate:'09/20/2023', 
      depositMethod:'Test', 
      indexCode:'12', 
      // serviceCount:'1', 
      // totalCost:'1000', 
      // amountDue:'500', 
      // paymentStatusCode:'InProgress', 
      // by: 'by',
      vendorId: '3F111CFD-906B-4F56-B7E2-7FCE5A563C36',
      paymentRequestId: '012D6618-C464-41C1-852D-03584075A17B',
      paymentRequestBatchId: '1B9F14A7-A983-44A9-BDC9-9B85716BE4DD'
    },
    {
      type: 837534,
      clientName:'ACH',
      vendorName: 'Very Nice Provider 2',
      refundWarrant:'123445', 
      refundAmount:'2000', 
      depositDate:'09/19/2023', 
      depositMethod:'Test1', 
      indexCode:'13', 
      vendorId: '433D134A-99D4-4A67-9A7D-8773190035CD',
      paymentRequestId: 'AF1338C1-A6CC-4E76-8741-B9ABA59ABC99',
      paymentRequestBatchId: '1B9F14A7-A983-44A9-BDC9-9B85716BE4DD'
    }
  ];
  gridDataHandle() {
    this.reconcileGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridClaimsReconcileDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isReconcileGridLoaderShow = false;
      }
    });
    this.isReconcileGridLoaderShow = false;
  }

  public onPrintAuthorizationOpenClicked(template: TemplateRef<unknown>): void {
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
      if(!this.isBreakoutPanelShow)
      {
        this.reconcileBreakoutSummary$.warrantTotal=0;
        this.reconcileBreakoutSummary$.paymentToReconcileCount=0;
      }
    }

  onRowSelection(grid:any, selection:any)
    {
      const data = selection.selectedRows[0].dataItem;
      this.isBreakoutPanelShow=true;
      this.entityId=data.entityId;
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
}

