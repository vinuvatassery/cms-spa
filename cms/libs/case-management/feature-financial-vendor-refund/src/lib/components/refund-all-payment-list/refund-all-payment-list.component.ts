import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
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
  @Input() vendorRefundAllPaymentsGridLists$: any;
  @Output() loadVendorRefundAllPaymentsListEvent = new EventEmitter<any>();
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

  gridVendorsAllPaymentsDataSubject = new Subject<any>();
  gridVendorsAllPaymentsData$ = this.gridVendorsAllPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };


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
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Refund',
      icon: 'delete',
    },
  ];


  /** Constructor **/
  constructor(private route: Router,
    private dialogService: DialogService,) { }

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
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
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
              field: this.selectedColumn ?? 'vendorName',
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
      if (data?.total >= 0 || data?.total === -1) {
        this.isVendorRefundAllPaymentsGridLoaderShow = false;
      }
    });
    this.isVendorRefundAllPaymentsGridLoaderShow = false;
  }

  public selectedPayments: any[] = [];
  isProcessGridExpand = false;
  hideActionButton = false;
  hideReceiptingLogActionButtons = true
  receptingLogClicked() {
    this.isProcessGridExpand = !this.isProcessGridExpand;
    this.hideReceiptingLogActionButtons = !this.hideReceiptingLogActionButtons;
    this.hideActionButton = !this.hideActionButton;
  }

  cancelActions() {
    this.isProcessGridExpand = !this.isProcessGridExpand;
    this.hideActionButton = !this.hideActionButton;
    this.hideReceiptingLogActionButtons = !this.hideReceiptingLogActionButtons;
  }

  selectedKeysChange(selection: any) {
    this.selectedPayments = selection;
  }
  
  vendorRefundAllPaymentsGridData = [
    {
      batch: "Batch1",
      vendor: "Vendor1",
      type: "Type1",
      primaryInsurance: "Insurance1",
      clientName: "Client1",
      memberID: "Member1",
      refundWarrant: "Warrant1",
      refundAmount: 100,
      depositDate: "2023-01-01",
      depositMethod: "Method1",
      originalWarranty: "Warranty1",
      originalAmount: 200,
      indexCode: "Code1",
      pca: "PCA1",
      grant: "Grant1",
      vp: "VP1",
      refundNote: "Note1",
      entryDate: "2023-01-02",
      by: "User1",
    },
    {
      batch: "Batch2",
      vendor: "Vendor2",
      type: "Type2",
      primaryInsurance: "Insurance2",
      clientName: "Client2",
      memberID: "Member2",
      refundWarrant: "Warrant2",
      refundAmount: 150,
      depositDate: "2023-02-01",
      depositMethod: "Method2",
      originalWarranty: "Warranty2",
      originalAmount: 250,
      indexCode: "Code2",
      pca: "PCA2",
      grant: "Grant2",
      vp: "VP2",
      refundNote: "Note2",
      entryDate: "2023-02-02",
      by: "User2",
    },
    // Add more data as needed
  ];



}
