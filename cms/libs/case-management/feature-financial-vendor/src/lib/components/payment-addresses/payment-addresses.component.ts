import {  Component,Input } from '@angular/core'; 
import { PaymentsFacade,ContactsFacade, contactResponse } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-payment-addresses',
  templateUrl: './payment-addresses.component.html',
  styleUrls: [],
})
export class PaymentAddressesComponent {
  @Input() vendorId: any;
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
  isContactDetailShow = false;
  isPaymentAddressDeactivateShow = false;
  isPaymentAddressDeleteShow = false; 
  VendorAddressId:any;
  public paymentAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Address',
      icon: 'edit',
      click: (data: any): void => {;
        this.clickOpenAddEditPaymentAddressDetails();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Address',
      icon: 'block',
      click: (data: any): void => {
        this.clickOpenDeactivatePaymentAddressDetails();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Address',
      icon: 'delete',
      click: (data: any): void => {
        this.clickOpenDeletePaymentAddressDetails();
      },
    },
  ];
  contactResponse: contactResponse[] = [];
  /** Constructor **/
  constructor(private readonly paymentsFacade: PaymentsFacade,private readonly contactFacade: ContactsFacade) {}

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

  pageSelectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
  }
  public onDetailCollapse(e: any): void {
  }

  public onDetailExpand(e: any): void { 
    //this.VendorAddressId=e.dataItem.VendorAddressId;
    this.VendorAddressId='84EBA062-31D0-489B-8154-ADABD5A81192';   
   
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
  }

  clickCloseAddEditPaymentAddressDetails() {
    this.isPaymentAddressDetailShow = false;
  }
  clickOpenAddContactDetails() {
    this.isContactDetailShow = true;
  }
  onClose(isClosed: any) {
    if (isClosed) {
      this.clickCloseAddContactDetails();
    }
  }

  clickCloseAddContactDetails() {
    this.isContactDetailShow = false;
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
