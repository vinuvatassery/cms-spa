import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
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
import { DrugsDataService } from '../../../../../domain/src/lib/infrastructure/financial-management/drugs.data.service';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider } from '@cms/shared/util-core';
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
  @Input() exportButtonShow$: any;

  @Output() loadVendorRefundAllPaymentsListEvent = new EventEmitter<any>();
  
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

  searchColumnChangeHandler(data:any){
    this.onChange(data)
  }
  
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
  constructor(
    private readonly configProvider: ConfigurationProvider,
    private readonly intl: IntlService,
    private readonly tempService: DrugsDataService,
    private route: Router,
    private dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  isColumnsReordered = false;
  columnChangeDesc = 'Default Columns';
  filteredByColumnDesc = '';
  sortColumnDesc = 'Vendor Name';
  @Output() loadVendorRefundProcessListEvent = new EventEmitter<any>();
  dataListApi:any;
  
  setToDefault() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.sortColumn = 'Vendor Name';
    this.sortDir = 'Ascending';
    this.filter = '';
    this.selectedColumn = 'vendorName';
    this.isFiltered = false;
    this.columnsReordered = false;
    this.sortValue = 'vendorName';
    this.sortType = 'asc';
    this.sort = this.sortColumn;
    this.searchValue =''
    this.loadVendorRefundAllPaymentsListGrid();
  }

  ngOnInit(): void {
  }

  private loadVendorRefundReceiptLogListGrid(): void {
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
    this.isVendorRefundAllPaymentsGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter: this.state?.['filter']?.['filters'] ?? [],
    };
    this.loadVendorRefundAllPaymentsListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  ngOnChanges(): void {
    this.sortType = 'desc'
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'vendorName', dir: 'asc' }]
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

  onChange(data: any) {
    this.defaultGridState();
    let operator = 'contains';
    if (
      this.selectedColumn === 'refundAmount' ||
      this.selectedColumn === 'refundWarrentnbr'||
      this.selectedColumn === 'grantNumber' ||
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
              field: this.selectedColumn ?? 'vendorName',
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

  isDataAvailable=true;
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
      if(data?.total < 1)
      {
        this.isDataAvailable=false;
      }
    });
   
  }

  public selectedPayments: any[] = [];
  isLogGridExpanded = false;
  hideActionButton = false;
  RefundLogMode = false
  receptingLogClicked() {
    this.isLogGridExpanded = !this.isLogGridExpanded;
    this.RefundLogMode = !this.RefundLogMode;
    this.hideActionButton = !this.hideActionButton;
  }

  cancelActions() {
    this.isLogGridExpanded = !this.isLogGridExpanded;
    this.hideActionButton = !this.hideActionButton;
    this.RefundLogMode = !this.RefundLogMode;
  }

  @Output() exportGridDataEvent = new EventEmitter<any>();
  @Input() exportButtonShow$: any;

  showExportLoader = false;
  onClickedExport() {
    this.showExportLoader = true;
    this.exportGridDataEvent.emit(this.vendorRefundAllPaymentsGridData);
    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false;
        this.cdr.detectChanges();
      }
    });
  }

  refundGridData = [
    {
        "dateReceived": "2023-11-11T18:57:32.0225408+05:00",
        "vendorId": "00000000-0000-0000-0000-000000000000",
        "vendorName": "Vendor 100",
        "paymentRequestId": "00000000-0000-0000-0000-000000000000",
        "checkRequestId": "00000000-0000-0000-0000-000000000000",
        "clientCaseEligibilityId": "00000000-0000-0000-0000-000000000000",
        "refundWarrentnbr": "Warrant #1",
        "vp": "VP1",
        "clientId": 0,
        "clientFullName": "Client 1",
        "type": null,
        "refundAmount": 100.50,
        "depositDate": "2023-11-11T18:57:32.0232501+05:00",
        "pcaCode": null,
        "indexCode": null,
        "refundNotes": "Note 1",
        "creatorId": null,
        "creationTime": "0001-01-01T00:00:00",
        "refundType": "Type A",
        "credit": "Credit1",
        "addedField": null,
        "grantNumber": "Grant #1",
        "entryDate": "2023-11-11T18:57:32.0235538+05:00",
        "enteredBy": "User 1"
    },
    {
        "dateReceived": "2023-11-11T18:57:32.0239411+05:00",
        "vendorId": "00000000-0000-0000-0000-000000000000",
        "vendorName": "Vendor 100",
        "paymentRequestId": "00000000-0000-0000-0000-000000000000",
        "checkRequestId": "00000000-0000-0000-0000-000000000000",
        "clientCaseEligibilityId": "00000000-0000-0000-0000-000000000000",
        "refundWarrentnbr": "Warrant #1",
        "vp": "VP1",
        "clientId": 0,
        "clientFullName": "Client 1",
        "type": null,
        "refundAmount": 100.50,
        "depositDate": "2023-11-11T18:57:32.0239454+05:00",
        "pcaCode": null,
        "indexCode": null,
        "refundNotes": "Note 1",
        "creatorId": null,
        "creationTime": "0001-01-01T00:00:00",
        "refundType": "Type A",
        "credit": "Credit1",
        "addedField": null,
        "grantNumber": "Grant #1",
        "entryDate": "2023-11-11T18:57:32.0239465+05:00",
        "enteredBy": "User 1"
    },
    {
        "dateReceived": "0001-01-01T00:00:00",
        "vendorId": "00000000-0000-0000-0000-000000000000",
        "vendorName": "Vendor 100",
        "paymentRequestId": "00000000-0000-0000-0000-000000000000",
        "checkRequestId": "00000000-0000-0000-0000-000000000000",
        "clientCaseEligibilityId": "00000000-0000-0000-0000-000000000000",
        "refundWarrentnbr": "Warrant #1",
        "vp": "VP1",
        "clientId": 0,
        "clientFullName": "Client 1",
        "type": null,
        "refundAmount": 100.50,
        "depositDate": "2023-11-11T18:57:32.0239469+05:00",
        "pcaCode": null,
        "indexCode": null,
        "refundNotes": "Note 1",
        "creatorId": null,
        "creationTime": "0001-01-01T00:00:00",
        "refundType": "Type A",
        "credit": "Credit1",
        "addedField": null,
        "grantNumber": "Grant #1",
        "entryDate": "2023-11-11T18:57:32.023947+05:00",
        "enteredBy": "User 1"
    },
    {
        "dateReceived": "0001-01-01T00:00:00",
        "vendorId": "00000000-0000-0000-0000-000000000000",
        "vendorName": "Vendor 100",
        "paymentRequestId": "00000000-0000-0000-0000-000000000000",
        "checkRequestId": "00000000-0000-0000-0000-000000000000",
        "clientCaseEligibilityId": "00000000-0000-0000-0000-000000000000",
        "refundWarrentnbr": "Warrant #1",
        "vp": "VP1",
        "clientId": 0,
        "clientFullName": "Client 1",
        "type": null,
        "refundAmount": 100.50,
        "depositDate": "2023-11-11T18:57:32.0239472+05:00",
        "pcaCode": null,
        "indexCode": null,
        "refundNotes": "Note 1",
        "creatorId": null,
        "creationTime": "0001-01-01T00:00:00",
        "refundType": "Type A",
        "credit": "Credit1",
        "addedField": null,
        "grantNumber": "Grant #1",
        "entryDate": "2023-11-11T18:57:32.0239473+05:00",
        "enteredBy": "User 1"
    },
    {
        "dateReceived": "0001-01-01T00:00:00",
        "vendorId": "00000000-0000-0000-0000-000000000000",
        "vendorName": "Vendor 100",
        "paymentRequestId": "00000000-0000-0000-0000-000000000000",
        "checkRequestId": "00000000-0000-0000-0000-000000000000",
        "clientCaseEligibilityId": "00000000-0000-0000-0000-000000000000",
        "refundWarrentnbr": "Warrant #1",
        "vp": "VP1",
        "clientId": 0,
        "clientFullName": "Client 1",
        "type": null,
        "refundAmount": 100.50,
        "depositDate": "2023-11-11T18:57:32.0239475+05:00",
        "pcaCode": null,
        "indexCode": null,
        "refundNotes": "Note 1",
        "creatorId": null,
        "creationTime": "0001-01-01T00:00:00",
        "refundType": "Type A",
        "credit": "Credit1",
        "addedField": null,
        "grantNumber": "Grant #1",
        "entryDate": "2023-11-11T18:57:32.0239477+05:00",
        "enteredBy": "User 1"
    }
]

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
    {
      batch: "Batch3",
      vendor: "Vendor3",
      type: "Type3",
      primaryInsurance: "Insurance3",
      clientName: "Client3",
      memberID: "Member3",
      refundWarrant: "Warrant3",
      refundAmount: 120,
      depositDate: "2023-03-01",
      depositMethod: "Method3",
      originalWarranty: "Warranty3",
      originalAmount: 300,
      indexCode: "Code3",
      pca: "PCA3",
      grant: "Grant3",
      vp: "VP3",
      refundNote: "Note3",
      entryDate: "2023-03-02",
      by: "User3",
    },
    {
      batch: "Batch4",
      vendor: "Vendor4",
      type: "Type4",
      primaryInsurance: "Insurance4",
      clientName: "Client4",
      memberID: "Member4",
      refundWarrant: "Warrant4",
      refundAmount: 130,
      depositDate: "2023-04-01",
      depositMethod: "Method4",
      originalWarranty: "Warranty4",
      originalAmount: 400,
      indexCode: "Code4",
      pca: "PCA4",
      grant: "Grant4",
      vp: "VP4",
      refundNote: "Note4",
      entryDate: "2023-04-02",
      by: "User4",
    },
    {
      batch: "Batch5",
      vendor: "Vendor5",
      type: "Type5",
      primaryInsurance: "Insurance5",
      clientName: "Client5",
      memberID: "Member5",
      refundWarrant: "Warrant5",
      refundAmount: 140,
      depositDate: "2023-05-01",
      depositMethod: "Method5",
      originalWarranty: "Warranty5",
      originalAmount: 500,
      indexCode: "Code5",
      pca: "PCA5",
      grant: "Grant5",
      vp: "VP5",
      refundNote: "Note5",
      entryDate: "2023-05-02",
      by: "User5",
    },
  ];

  searchText: null | string = null;
  showDateSearchWarning = false;
  showNumberSearchWarning = false;
  dateColumns: any[] = ['depositDate', 'entryDate'];
  selectedSearchColumn: null | string = null;

  private isValidDate = (searchValue: any) =>
  isNaN(searchValue) && !isNaN(Date.parse(searchValue));


  private formatSearchValue(searchValue: any, isDateSearch: boolean) {
    if (isDateSearch) {
      if (this.isValidDate(searchValue)) {
        return this.intl.formatDate(
          new Date(searchValue),
          this.configProvider?.appSettings?.dateFormat
        );
      } else {
        return '';
      }
    }

    return searchValue;
  }

  onSearch(searchValue: any) {
    // const isDateSearch = searchValue.includes('/');
    // this.showDateSearchWarning =
    //   isDateSearch || this.dateColumns.includes(this.selectedSearchColumn);
    // searchValue = this.formatSearchValue(searchValue, isDateSearch);
    // if (isDateSearch && !searchValue) return;
    //this.setFilterBy(false, searchValue, []);
    //this.searchSubject.next(searchValue);
  }

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

  searchColumnList: { columnName: string; columnDesc: string }[] = [
    {
      columnName: 'dateReceived',
      columnDesc: 'Date Received',
    },
    {
      columnName: 'vendorName',
      columnDesc: 'Vendor',
    },
    {
      columnName: 'clientId',
      columnDesc: 'Client',
    },
    {
      columnName: 'type',
      columnDesc: 'Refund Type',
    },
    {
      columnName: 'refundWarrentnbr',
      columnDesc: 'Refund Warrant Number',
    },
    {
      columnName: 'refundAmount',
      columnDesc: 'Refund Amount',
    },
    {
      columnName: 'depositDate',
      columnDesc: 'Deposit Date',
    },
    {
      columnName: 'vp',
      columnDesc: 'Vp Suffix',
    },
    {
      columnName: 'credit',
      columnDesc: 'Credit Suffix',
    },
    {
      columnName: 'addedField',
      columnDesc: 'Added Field',
    },
    {
      columnName: 'grantNumber',
      columnDesc: 'Grant #',
    },
    {
      columnName: 'refundNotes',
      columnDesc: 'Refund Note',
    },
    {
      columnName: 'entryDate',
      columnDesc: 'Entry Date',
    },
    {
      columnName: 'enteredBy',
      columnDesc: 'Entered By',
    },
  ];

}
