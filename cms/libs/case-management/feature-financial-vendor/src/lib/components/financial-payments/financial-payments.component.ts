import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GridFilterParam, PaymentsFacade } from '@cms/case-management/domain';
import { CompositeFilterDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FilterService } from '@progress/kendo-angular-grid';
@Component({
  selector: 'cms-financial-payments',
  templateUrl: './financial-payments.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPaymentComponent {
  /** Input Properties **/
  @Input() vendorId!: string;
  formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  sortValue = 'batchName';
  sortType = this.paymentsFacade.sortType;
  pageSizes = this.paymentsFacade.gridPageSizes;
  gridSkipCount = this.paymentsFacade.skipCount;
  sort: SortDescriptor[] = [{ field: 'BatchName', dir: 'asc' }];
  state!: State;
  filter!: any;
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  paymentStatusFilter = '';
  paymentBatchesGridView$ = this.paymentsFacade.paymentBatches$;
  paymentBatchLoader$ = this.paymentsFacade.paymentBatchLoader$;

  ClientGridLists = [
    {
      ClientName: 'FName LName `',
      PrimaryInsuranceCard: 'FName LName',
      PremiumAmount: '500.00',
      MemberID: 'XXXXXX',
      PolicyID: 'XXXXXX',
      GroupID: 'XXXXXX',
      PaymentID: 'XXXXXX',
    },
  ];

  paymentStatusList = [
    'SUBMITTED',
    'PENDING_APPROVAL',
    'DENIED',
    'MANAGER_APPROVED',
    'PAYMENT_REQUESTED',
    'ONHOLD',
    'FAILED',
    'PAID',
  ];

  /** Constructor **/
  constructor(private readonly paymentsFacade: PaymentsFacade) { }

  ngOnInit(): void {
    this.loadPaymentsListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  // updating the pagination info based on dropdown selection
  pageSelectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPaymentsListGrid();
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.filter = stateData?.filter?.filters;
    this.state = stateData;
    this.loadPaymentsListGrid();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentStatus') {
      this.paymentStatusFilter = value;
    }

    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'or',
    });
  }

  loadPaymentsListGrid() {
    const params = new GridFilterParam(this.state.skip, this.state.take, this.sortValue, this.sortType, JSON.stringify(this.filter))
    this.paymentsFacade.loadPaymentsListGrid(this.vendorId, params);
  }

}
