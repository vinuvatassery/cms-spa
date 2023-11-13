
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
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
@Component({
  selector: 'cms-refund-all-payment-list',
  templateUrl: './refund-all-payment-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundAllPaymentListComponent implements OnInit, OnChanges{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isVendorRefundAllPaymentsGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() sortValueRefunds: any;
  @Input() vendorRefundAllPaymentsGridLists$: any;
  @Input() exportButtonShow$: any;

  @Output() loadVendorRefundAllPaymentsListEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();

  public state!: State;
  sortColumn = 'Batch #';
  sortDir = 'Descending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn ='batchNumber'
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

  columns: any = {
    batchNumber: 'Batch #',
    providerName: 'Vendor',
    paymentType: 'Type',
    clientFullName: 'Client Name',
    insuranceName: 'Name on Primary Insurance Card',
    clientId: 'Client ID',
    warrantNumber: 'Refund Warrant #',
    refundAmount: 'Refund Amount',
    depositDate: 'Deposit Date',
    originalWarrantNumber: 'Original Warrant #',
    originalAmount: 'Original Amount',
    indexCode: 'Index Code',
    pcaCode :'PCA',
    voucherPayable :'VP',
    refundNote:'Refund Note',
    entryDate : 'Entry Date'
  };

  dropDowncolumns: any = [
    {
      columnCode: 'batchNumber',
      columnDesc: 'Batch #',
    },
    {
      columnCode: 'providerName',
      columnDesc: 'Vendor',
    },
    {
      columnCode: 'paymentType',
      columnDesc: 'Type',
    },
    {
      columnCode: 'clientFullName',
      columnDesc: 'Client Name',
    },   
    {
      columnCode: 'insuranceName',
      columnDesc: 'Name on Primary Insurance Card',
    },
    {
      columnCode: 'clientId',
      columnDesc: 'Client ID',
    },
    {
      columnCode: 'warrantNumber',
      columnDesc: 'Refund Warrant #',
    },
    {
      columnCode: 'refundAmount',
      columnDesc: 'Refund Amount',
    }   
  ];
  showExportLoader = false;
 
  
  /** Constructor **/
  constructor(private route: Router,  private readonly cdr: ChangeDetectorRef ) {}

  ngOnInit(): void {
    this.sortType = 'desc'
    this.loadVendorRefundAllPaymentsListGrid();
  }
  ngOnChanges(): void {
    this.sortType = 'desc'
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

    if(sortValue  === 'batchNumber')
    {
      sortValue = 'entryDate'  
    }  

    const gridDataRefinerValue = {
      SkipCount: skipCountValue,
      MaxResultCount: maxResultCountValue,
      Sorting: sortValue,
      SortType: sortTypeValue,
      Filter: JSON.stringify(this.state?.['filter']?.['filters'] ?? [])
    };
    this.loadVendorRefundAllPaymentsListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  searchColumnChangeHandler(data:any){      
    this.onChange('')    
  }

  
  onChange(data: any) {
    this.defaultGridState();
    let operator = 'startswith';

    if (
      this.selectedColumn === 'clientId' ||
      this.selectedColumn === 'refundAmount' ||
      this.selectedColumn === 'originalAmount'     
    ) {
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'batchNumber',
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
      this.gridVendorsAllPaymentsDataSubject.next(this.gridDataResult);      
        this.isVendorRefundAllPaymentsGridLoaderShow = false;     
    });
   
  }

  onClickedExport() {
    this.showExportLoader = true;
    this.exportGridDataEvent.emit();
    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false;
        this.cdr.detectChanges();
      }
    });
  }

  setToDefault() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.sortColumn = 'Batch #';
    this.sortDir = 'Ascending';
    this.filter = '';
    this.selectedColumn = 'batchNumber';
    this.isFiltered = false;
    this.columnsReordered = false;

    this.sortValue = 'batchNumber';
    this.sortType = 'asc';
    this.sort = this.sortColumn;
    this.searchValue =''

    this.loadVendorRefundAllPaymentsListGrid();
  } 

 
}
