import { ChangeDetectionStrategy, Component, Input } from '@angular/core'; 
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { InvoiceFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { Router } from '@angular/router';

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
  providerId:any;
  @Input() tabCode: any;

  
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
   constructor(private readonly invoiceFacade: InvoiceFacade,private readonly router: Router,) {}


   
  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.providerId='4A0C8A12-9480-4AE6-B979-08FC6BEAA712'
    this.loadInvoiceListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }
  public dataStateChange(stateData: any): void {
    debugger;
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.loadInvoiceListGrid();
  }
  pageSelectionChange(data: any) {
    debugger;
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadInvoiceListGrid();
  }
  loadInvoiceListGrid() {
    this.invoiceFacade.loadInvoiceListGrid(this.providerId,this.state,this.tabCode);
  }
  loadPaymentRequestServices(){
    //invoiceNumber:any,vendorId:any,vendorType:any,paymentRequestBatchId:any,clientId:any

  }
  onClientClicked(clientId: any) {
      this.router.navigate([`/case-management/cases/case360/${clientId}`]);
      
  }
  onBatchClicked() {
    this.router.navigate([`/financial-management/medical-claims`]);    
  }
}
