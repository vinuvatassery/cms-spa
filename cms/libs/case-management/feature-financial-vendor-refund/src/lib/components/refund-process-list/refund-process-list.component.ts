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
  isProcessBatchClosed = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isVendorRefundProcessGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() vendorRefundProcessGridLists$: any;
  @Output() loadVendorRefundProcessListEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'vendorFullName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  gridVendorsProcessDataSubject = new Subject<any>();
  gridVendorsProcessData$ = this.gridVendorsProcessDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  public refundProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'BATCH REFUNDS',
      icon: 'check',
      click: (data: any): void => {
        if (!this.isProcessBatchClosed) {
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
        if (!this.isDeleteBatchClosed) {
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
      sort: this.sort,
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

  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'vendorFullName',
              operator: 'startswith',
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };
    let stateData = this.state;
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
    if (stateData.filter?.filters.length > 0) {
      const stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;}
      else {
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
    });
  }
}
