import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PaymentsFacade } from '@cms/case-management/domain';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-financial-payments',
  templateUrl: './financial-payments.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPaymentComponent {
  /** Input Properties **/
  @Input() vendorId!: string;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public sortValue = this.paymentsFacade.sortValue;
  public sortType = this.paymentsFacade.sortType;
  public pageSizes = this.paymentsFacade.gridPageSizes;
  public gridSkipCount = this.paymentsFacade.skipCount;
  public sort: SortDescriptor[] = [{ field: 'BatchName', dir: 'asc'}];
  public state!: State;
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
    this.state = stateData;
    this.loadPaymentsListGrid();
  }

  loadPaymentsListGrid() {
    this.paymentsFacade.loadPaymentsListGrid(this.vendorId, this.state);
  }

}
