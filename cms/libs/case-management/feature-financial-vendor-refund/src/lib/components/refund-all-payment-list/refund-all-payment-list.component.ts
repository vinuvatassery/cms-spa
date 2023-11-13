
import {
  ChangeDetectionStrategy,
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
import { Router } from '@angular/router';
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject, first } from 'rxjs';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
@Component({
  selector: 'cms-refund-all-payment-list',
  templateUrl: './refund-all-payment-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundAllPaymentListComponent implements OnInit, OnChanges {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isVendorRefundAllPaymentsGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() sortValueRefunds: any;
  @Input() vendorRefundAllPaymentsGridLists$: any;
  @Output() loadVendorRefundAllPaymentsListEvent = new EventEmitter<any>();
  @ViewChild('unBatchRefundsDialogTemplate', { read: TemplateRef })
  unBatchRefundsDialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteRefundsConfirmationDialogTemplate', { read: TemplateRef })
  deleteRefundsConfirmationDialogTemplate!: TemplateRef<any>;

  public state!: State;
  sortColumn = 'entryDate';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;

  gridVendorsAllPaymentsDataSubject = new Subject<any>();
  gridVendorsAllPaymentsData$ =
    this.gridVendorsAllPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  isUnBatchRefundsClosed = false;
  isDeleteClaimClosed = false;
  UnBatchDialog: any;
  deleteRefundsDialog: any;
  selected: any;
  deletemodelbody = 'This action cannot be undone, but you may add a claim at any time. This claim will not appear in a batch';

  public allPaymentsGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Refund',
      icon: 'edit',
    },
    {
      buttonType: 'btn-h-primary',
      text: 'UnAllPayments Refund',
      icon: 'undo',
      click: (data: any) =>{
        if (!this.isUnBatchRefundsClosed) {
          this.isUnBatchRefundsClosed = true;
          this.selected = data;
          this.onUnBatchOpenClicked(this.unBatchRefundsDialogTemplate);
        }
      }
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Refund',
      icon: 'delete',
      click: (data: any): void => {
        this.isUnBatchRefundsClosed = false;
        this.isDeleteClaimClosed = true;
        this.onSingleClaimDelete(data.paymentRequestId.split(','));
        this.onDeleteRefundsOpenClicked(
          this.deleteRefundsConfirmationDialogTemplate
        );
      },
    },
  ];

  /** Constructor **/
  constructor(
    private route: Router,
    private financialVendorRefundFacade: FinancialVendorRefundFacade,
    private dialogService: DialogService) {}

  ngOnInit(): void {
    this.loadVendorRefundAllPaymentsListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadVendorRefundAllPaymentsListGrid();
  }

  private loadVendorRefundAllPaymentsListGrid(): void {
    this.loadRefundAllPayments(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadRefundAllPayments(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isVendorRefundAllPaymentsGridLoaderShow = true;
    const gridDataRefinerValue = {
      SkipCount: skipCountValue,
      MaxResultCount: maxResultCountValue,
      Sorting: sortValue,
      SortType: sortTypeValue,
      Filter: JSON.stringify(this.state?.['filter']?.['filters'] ?? []),
    };
    this.loadVendorRefundAllPaymentsListEvent.emit(gridDataRefinerValue);
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
              field: this.selectedColumn ?? 'entryDate',
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
    this.loadVendorRefundAllPaymentsListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadVendorRefundAllPaymentsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.vendorRefundAllPaymentsGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridVendorsAllPaymentsDataSubject.next(this.gridDataResult);
      this.isVendorRefundAllPaymentsGridLoaderShow = false;
    });
  }

  onUnBatchOpenClicked(template: TemplateRef<unknown>): void {
    this.UnBatchDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onUnBatchCloseClicked(result: any) {
    if (result) {
      this.handleUnbatchRefunds();
      this.financialVendorRefundFacade.unbatchRefund(
        [this.selected.paymentRequestId]
      );
    }
    this.isUnBatchRefundsClosed = false;
    this.UnBatchDialog.close();
  }

  handleUnbatchRefunds() {
    this.financialVendorRefundFacade.unbatchRefunds$
      .pipe(first((unbatchResponse: any) => unbatchResponse != null))
      .subscribe((unbatchResponse: any) => {
        if (unbatchResponse ?? false) {
          this.loadVendorRefundAllPaymentsListGrid();
        }
      });
  }

  public onDeleteRefundsOpenClicked(template: TemplateRef<unknown>): void {
    this.deleteRefundsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onModalDeleteRefundsModalClose(result: any) {
    if (result) {
      this.isDeleteClaimClosed = false;
      this.deleteRefundsDialog.close();
    }
  }

  onSingleClaimDelete(selection: any) {
    this.selected = selection;
  }

  onModalBatchDeletingRefundsButtonClicked(action: any) {
    if (action) {
      this.handleDeleteRefunds();
      this.financialVendorRefundFacade.deleteRefunds(this.selected);
    }
  }

  handleDeleteRefunds() {
    this.financialVendorRefundFacade.deleteRefunds$
      .pipe(first((deleteResponse: any) => deleteResponse != null))
      .subscribe((deleteResponse: any) => {
        if (deleteResponse != null) {
          this.isDeleteClaimClosed = false;
          this.deleteRefundsDialog.close();
          this.loadVendorRefundAllPaymentsListGrid();
        }
      });
  }
}
