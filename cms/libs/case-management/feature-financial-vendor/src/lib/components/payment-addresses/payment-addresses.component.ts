import { ChangeDetectionStrategy, Component } from '@angular/core'; 
import { PaymentsFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-payment-addresses',
  templateUrl: './payment-addresses.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentAddressesComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isPaymentsAddressGridLoaderShow = false;
  public sortValue = this.paymentsFacade.sortValue;
  public sortType = this.paymentsFacade.sortType;
  public pageSizes = this.paymentsFacade.gridPageSizes;
  public gridSkipCount = this.paymentsFacade.skipCount;
  public sort = this.paymentsFacade.sort;
  public state!: State;
  paymentsAddressGridView$ = this.paymentsFacade.paymentsAddressData$;
  isPaymentAddressDetailShow = false;
  isPaymentAddressDetailIsEdit = false;
  isPaymentAddressDeactivateShow = false;
  isPaymentAddressDeleteShow = false;
  paymentAddressInnerGridLists = [
    {
      Name: 'FName LName',
      Description:'FName LName', 
      PremiumAmount: '500.00',
      PhoneNumber: 'XXXXXX',
      FaxNumber: 'XXXXXX',
      EmailAddress: 'XXXXXX',
      EffectiveDate: 'XXXXXX', 
      by: 'XX', 
    },
  ];
     

  
  public paymentAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Address',
      icon: 'edit',
      click: (data: any): void => {        
        console.log(data); 
        this.clickOpenAddEditPaymentAddressDetails();
         
      },
    }, 
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Address',
      icon: 'block',
      click: (data: any): void => {
        console.log(data); 
        this.clickOpenDeactivatePaymentAddressDetails();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Address',
      icon: 'delete',
      click: (data: any): void => {
        console.log(data);  
        this.clickOpenDeletePaymentAddressDetails();
      },
    },
  ];

   /** Constructor **/
   constructor(private readonly paymentsFacade: PaymentsFacade) {}
   
  ngOnInit(): void {
    this.loadPaymentsAddressListGrid();
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
  loadPaymentsAddressListGrid() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.paymentsFacade.loadPaymentsAddressListGrid();
  }

  
  
  clickOpenAddEditPaymentAddressDetails() {
    this.isPaymentAddressDetailShow = true;
    this.isPaymentAddressDetailIsEdit=false;
  }

  clickCloseAddEditPaymentAddressDetails() {
    this.isPaymentAddressDetailShow = false;
  }

  closePaymentAddressDetails(event:any){
   this.clickCloseAddEditPaymentAddressDetails(); 
  }

  clickOpenDeactivatePaymentAddressDetails() {
    this.isPaymentAddressDeactivateShow = true;
  }
  clickCloseDeactivatePaymentAddress() {
    this.isPaymentAddressDeactivateShow = false;
  }

  clickOpenDeletePaymentAddressDetails() {
    this.isPaymentAddressDeleteShow = true;
  }
  clickCloseDeletePaymentAddress() {
    this.isPaymentAddressDeleteShow = false;
  }
}
