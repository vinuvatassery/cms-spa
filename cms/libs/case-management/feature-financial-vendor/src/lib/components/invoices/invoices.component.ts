import { ChangeDetectionStrategy, Component } from '@angular/core'; 
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { InvoiceFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'cms-invoices',
  templateUrl: './invoices.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isInvoiceGridLoaderShow = false;
  public sortValue = this.invoiceFacade.sortValue;
  public sortType = this.invoiceFacade.sortType;
  public pageSizes = this.invoiceFacade.gridPageSizes;
  public gridSkipCount = this.invoiceFacade.skipCount;
  public sort = this.invoiceFacade.sort;
  public state!: State;
  invoiceGridView$ = this.invoiceFacade.invoiceData$;
 

  
  ClientGridLists = [
    {
      ServiceStart: 'MMDDYYYY_XXX `',
      ServiceEnd:'MMDDYYYY_XXX', 
      CPTCode: 'XXXXXXX',
      MedicalService: 'LIPID Testing',
      ServiceCost: '500.000',
      AmountDue: '20.00',
      PaymentType: 'Regular Pay', 
      ClientAnnualTotal: '5,600.00', 
      ClientBalance: '2,000.00', 
    },
  ];
   
   /** Constructor **/
   constructor(private readonly invoiceFacade: InvoiceFacade) {}


   
  ngOnInit(): void {
    this.loadInvoiceListGrid();
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
  loadInvoiceListGrid() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.invoiceFacade.loadInvoiceListGrid();
  }
}
