import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import { PaymentsFacade, contactResponse,ContactsFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-contact-inner-grid',
  templateUrl: './contact-inner-grid.component.html',
  styleUrls: ['./contact-inner-grid.component.scss'],
   encapsulation: ViewEncapsulation.None,
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactInnerGridComponent {
  contactResponse: contactResponse[] = [];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isContactAddressDeactivateShow = false;
  isContactAddressDeleteShow = false; 
  isContactAddressDetailShow = false;
  VendorContactId:any;
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
  public contactAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Address',
      icon: 'edit',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenAddEditContactAddressDetails();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Address',
      icon: 'block',
      click: (data: any): void => {
        console.log(data);
        if(data?.VendorContactId){
          this.VendorContactId = data?.VendorContactId;
          this.clickOpenDeactivateContactAddressDetails();
        }
        
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Address',
      icon: 'delete',
      click: (data: any): void => {
       
        if(data?.VendorContactId){
          this.VendorContactId = data?.VendorContactId;
          this.clickOpenDeleteContactAddressDetails();
        }
        
      },
    },
  ];
  constructor(private readonly paymentsFacade: PaymentsFacade,
    private cd:ChangeDetectorRef,
    private readonly contactsFacade: ContactsFacade,
    ) {}

  ngOnInit(): void {
    this.contactResponse=[];
    this.paymentsFacade.contacts$.subscribe((res: any) => {
      this.contactResponse = res;
      this.cd.detectChanges();

    });
  }
  clickOpenAddEditContactAddressDetails() {
    this.isContactAddressDetailShow = true;
  }
  clickOpenDeactivateContactAddressDetails() {
    this.isContactAddressDeactivateShow = true;
  }
  clickOpenDeleteContactAddressDetails() {
    this.isContactAddressDeleteShow = true;
  }
  
  clickCloseDeleteContactAddress()
  {
    this.isContactAddressDeleteShow = false;
  }
  clickCloseDeactivateContactAddress()
  {
    this.isContactAddressDeactivateShow = false;
  }
  onCancelPopup(isCancel:any){
   if(isCancel){
    this.clickCloseDeleteContactAddress();
   }
  }
  onDeactiveCancel(isCancel:any){
    if(isCancel){
      this.clickCloseDeactivateContactAddress();
     }
  }
  
}
