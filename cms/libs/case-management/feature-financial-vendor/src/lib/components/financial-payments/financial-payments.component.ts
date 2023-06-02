import { ChangeDetectionStrategy, Component } from '@angular/core'; 
import { PaymentsFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-financial-payments',
  templateUrl: './financial-payments.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPaymentComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isPaymentsGridLoaderShow = false;
  public sortValue = this.paymentsFacade.sortValue;
  public sortType = this.paymentsFacade.sortType;
  public pageSizes = this.paymentsFacade.gridPageSizes;
  public gridSkipCount = this.paymentsFacade.skipCount;
  public sort = this.paymentsFacade.sort;
  public state!: State;
  paymentsGridView$ = this.paymentsFacade.paymentsData$;
 
  ClientGridLists = [
    {
      ClientName: 'FName LName `',
      PrimaryInsuranceCard:'FName LName', 
      PremiumAmount: '500.00',
      MemberID: 'XXXXXX',
      PolicyID: 'XXXXXX',
      GroupID: 'XXXXXX',
      PaymentID: 'XXXXXX', 
    },
  ];
   

  
   /** Constructor **/
   constructor(private readonly paymentsFacade: PaymentsFacade) {}
   
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
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
  }
  loadPaymentsListGrid() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.paymentsFacade.loadPaymentsListGrid();
  }

}
