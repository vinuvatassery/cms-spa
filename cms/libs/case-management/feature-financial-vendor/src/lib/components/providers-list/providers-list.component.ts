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
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialProviderTypeCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-financial-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProvidersListComponent implements OnChanges, OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() financeTabTypeCode!: string;
  @Input() providerTypeCode!: string;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() providersList$: any;

  @Output() loadFinancialProvidersListEvent = new EventEmitter<any>();

  providerId!: string;
  public state!: State;
  groupData: any = [];
  caseStatusTypes: any = [];
  sortColumn = 'Provider Name';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;

  selectedColumn!: any;

  gridDataResult!: GridDataResult;
  gridProvidersDataSubject = new Subject<any>();
  gridProvidersData$ = this.gridProvidersDataSubject.asObservable();
  columnDroplistSubject = new Subject<any[]>();
  columnDroplist$ = this.columnDroplistSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  loader = false;

  columns: any = {
    providerName: 'Provider Name',
    tin: 'Tin',
    paymentMethod: 'Payment Method',
    totalPayments: 'Total Payments',
    unreconciledPayments: 'Unreconciled Payments',
    insurancePlans: 'Insurance Plans',
    clients: 'Clients',
    invoiceDelivery: 'Invoice Delivery',
    totalDrugs: 'Total Drugs',
    openInvoices: 'Open Invoices',
    phones: 'Phones',
    emails: 'Emails',
    mailCode: 'Mail Code',
    address: 'Address',
    preferredFlag: 'Preferred Flag',
    nabp: 'Nabp',
    ncpdp: 'Ncpdp',
    physicalAddress: 'Physical Address',
  };

  dropDowncolumns: any = [];

  constructor(
    private route: Router,  
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    if (this.providerTypeCode) {      
      this.loadFinancialProvidersList();
    }
  }

  ngOnInit(): void {
    this.bindDropdownClumns();
    if (!this.selectedColumn) {
      this.selectedColumn = '';
    }
  }

  private bindDropdownClumns() {
    this.dropDowncolumns = this.dropDowncolumns.filter(
      (x: any) =>
        x.vendorTypeCode === this.providerTypeCode || x.vendorTypeCode === 'ALL'
    );
  }

  get financeProviderTypeCodes(): typeof FinancialProviderTypeCode {
    return FinancialProviderTypeCode;
  }

  private loadFinancialProvidersList(): void {
    this.loadProviders(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  loadProviders(
    skipcountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.loader = true;
    const gridDataRefinerValue = {
      skipCount: skipcountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      providerTypeCode: this.providerTypeCode,
    };
    this.loadFinancialProvidersListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  onProviderClicked(providerId: string) {
    const query = {
      queryParams: {
        v_id: providerId,
        tab_code: this.financeTabTypeCode,
      },
    };
    this.route.navigate(['/financial-management/vendors/profile'], query);
  }

  onChange(data: any) {
    this.defaultGridState();

    this.sortColumn = this.columns[this.selectedColumn];
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'providerName',
              operator: 'contains',
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

    this.sortColumn = this.columns[stateData.sort[0]?.field];
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';

    if (stateData.filter?.filters.length > 0) {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
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

    this.loadFinancialProvidersList();
  }

  // updating the pagination infor based on dropdown selection
  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialProvidersList();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {   

    this.providersList$.subscribe((data: GridDataResult) => {          

      this.gridDataResult = data    
      this.gridDataResult.data = filterBy(this.gridDataResult.data, this.filterData)
      this.gridProvidersDataSubject.next(this.gridDataResult);  
        if (data?.total >= 0 || data?.total === -1) {
          this.loader = false;          
        }
    });

  }
}
