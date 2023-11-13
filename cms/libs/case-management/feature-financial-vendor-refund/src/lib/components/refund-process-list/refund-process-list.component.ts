/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { DialogService } from '@progress/kendo-angular-dialog';
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-refund-process-list',
  templateUrl: './refund-process-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundProcessListComponent implements OnInit, OnChanges {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @ViewChild('batchRefundConfirmationDialog', { read: TemplateRef })
  batchRefundConfirmationDialog!: TemplateRef<any>;
  @ViewChild('deleteRefundConfirmationDialog', { read: TemplateRef })
  deleteRefundConfirmationDialog!: TemplateRef<any>;
  private deleteRefundDialog: any;
  private batchConfirmRefundDialog: any;
  private addEditRefundFormDialog: any;
  isDeleteBatchClosed = false;
  isDataAvailable=true;
  isProcessBatchClosed = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isVendorRefundProcessGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() vendorRefundProcessGridLists$: any;
  isColumnsReordered = false;
  columnChangeDesc = 'Default Columns';
  filteredByColumnDesc = '';
  sortColumnDesc = 'Vendor Name';
  searchText = '';
  @Output() loadVendorRefundProcessListEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'Vendor Name';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn='VendorName';
  gridDataResult!: GridDataResult;
  showExportLoader = false;
  isBatchSelected=false;
  gridVendorsProcessDataSubject = new Subject<any>();
  gridVendorsProcessData$ = this.gridVendorsProcessDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  gridColumns: { [key: string]: string }  = {
    ALL: 'All Columns',
    VendorName: "Vendor Name",
  };

  columns: any = {
    VendorName: 'Vendor Name',
    type: 'Type' ,
    clientFullName: 'Client Name',
    refundWarrentnbr: 'Refund Warrant #',
    refundAmount:'Refund Amount',
    indexCode: 'Index Code',
    pcaCode:'PCA',
    vp:'VP',
    refunfNotes:'Refund Note',
  
    
  };

  dropDowncolumns: any = [
   
    {
      columnCode: 'VendorName',
      columnDesc: 'Vendor Name',
    },
    {
      columnCode: 'type',
      columnDesc: 'Type',
    },
    {
      columnCode: 'clientFullName',
      columnDesc: 'Client Name',
    },
    {
      columnCode: 'refundWarrentnbr',
      columnDesc: 'Refund Warrant #',
    },
    {
      columnCode: 'refundAmount',
      columnDesc: 'Refund Amount',
    },
  
    {
      columnCode: 'indexCode',
      columnDesc: 'Index Code',
    },
   
    {
      columnCode: 'pcaCode',
      columnDesc: 'PCA',
    },
  
    {
      columnCode: 'vp',
      columnDesc: 'VP',
    },
 
    {
      columnCode: 'refundNotes',
      columnDesc: 'Refund Note',
    },
  ]
  
  public refundProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'BATCH REFUNDS',
      icon: 'check',
      click: (data: any): void => {
        if (!this.isProcessBatchClosed && this.isDataAvailable) {
          this.isProcessBatchClosed = true;
          this.onBatchRefundClicked(this.batchRefundConfirmationDialog, data);
        }
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'DELETE REFUNDS',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isDeleteBatchClosed && this.isDataAvailable) {
          this.isDeleteBatchClosed = true;
          this.onDeleteRefundOpenClicked(
            this.deleteRefundConfirmationDialog,
            data
          );
        }
      },
    },
  ];
  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService, 
  ) {}

  ngOnInit(): void {
    this.loadVendorRefundProcessListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'VendorName', dir: 'asc' }]
    };
    this.loadVendorRefundProcessListGrid();
  }
  private loadVendorRefundProcessListGrid(): void {
    this.loadRefundProcess(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadRefundProcess(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isVendorRefundProcessGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter: this.state?.['filter']?.['filters'] ?? [],
    };
    this.loadVendorRefundProcessListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  public onBatchRefundClicked(template: TemplateRef<unknown>, data: any): void {
    this.batchConfirmRefundDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalBatchRefundModalClose(result: any) {
    if (result) {
      this.isProcessBatchClosed = false;
      this.batchConfirmRefundDialog.close();
    }
  }

  public onDeleteRefundOpenClicked(
    template: TemplateRef<unknown>,
    data: any
  ): void {
    this.deleteRefundDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalDeleteRefundModalClose(result: any) {
    if (result) {
      this.isDeleteBatchClosed = false;
      this.deleteRefundDialog.close();
    }
  }

  onClickOpenAddEditRefundFromModal(template: TemplateRef<unknown>): void {
    this.addEditRefundFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-96full add_refund_modal',
    });
  }
  modalCloseAddEditRefundFormModal(result: any) {
    if (result) {
      this.addEditRefundFormDialog.close();
    }
  }
  searchColumnChangeHandler(data:any){
    this.onChange(data)
  }

  onChange(data: any) {
    this.defaultGridState();
    let operator = 'contains';
    if (
      this.selectedColumn === 'refundAmount' ||
      this.selectedColumn === 'refundWarrentnbr' ||
      this.selectedColumn === 'indexCode' 
    ) {
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'VendorName',
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
    this.sortColumn = this.columns[stateData.sort[0]?.field];
    if (stateData.filter?.filters.length > 0) {
      const stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    } else {
      this.filter = '';
      this.isFiltered = false;
    }
    this.loadVendorRefundProcessListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadVendorRefundProcessListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.vendorRefundProcessGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridVendorsProcessDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isVendorRefundProcessGridLoaderShow = false;
      }
      if(data?.total < 1)
      {
        this.isDataAvailable=false;
      }
    });
  }
  
  setToDefault() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.sortColumn = 'Vendor Name';
    this.sortDir = 'Ascending';
    this.filter = '';
    this.selectedColumn = 'VendorName';
    this.isFiltered = false;
    this.columnsReordered = false;
    this.sortValue = 'VendorName';
    this.sortType = 'asc';
    this.sort = this.sortColumn;
    this.searchValue =''
    this.loadVendorRefundProcessListGrid();
  }
}
