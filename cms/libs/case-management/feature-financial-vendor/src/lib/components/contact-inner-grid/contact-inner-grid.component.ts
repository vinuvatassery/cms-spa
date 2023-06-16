import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import { ContactsFacade, contactResponse } from '@cms/case-management/domain';
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
  isContactsDetailShow=false;
  VendorContactId:any;
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
        if(data?.vendorContactId){
          this.VendorContactId = data?.vendorContactId;
          this.clickOpenDeactivateContactAddressDetails();
        }
        
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Address',
      icon: 'delete',
      click: (data: any): void => {
       
        if(data?.vendorContactId){
          this.VendorContactId = data?.vendorContactId;
          this.clickOpenDeleteContactAddressDetails();
        }
        
      },
    },
  ];
  constructor(private readonly contactsfacade: ContactsFacade,private cd:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.contactResponse=[];
    this.contactsfacade.contacts$.subscribe((res: any) => {
      this.contactResponse = res;
      this.cd.detectChanges();

    });
  }
  clickOpenAddEditContactAddressDetails() {
    this.isContactsDetailShow = true;
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
  clickCloseAddEditContactsDetails() {
    this.isContactsDetailShow = false;
  }
  
}
