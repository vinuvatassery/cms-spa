import {
  ChangeDetectionStrategy,
  Component,
  Input,
  SimpleChanges, OnChanges,  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import { VendorContactsFacade, ContactResponse } from '@cms/case-management/domain';
import { LoaderService} from '@cms/shared/util-core';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'cms-contact-address-list',
  templateUrl: './contact-address-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactAddressListComponent implements OnChanges {
  contactResponse: ContactResponse[] = [];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isContactAddressDeactivateShow = false;
  isContactAddressDeleteShow = false;
  isContactAddressDetailShow = false;
  isContactsDetailShow = false;
  VendorContactId:any;
  VendorContactAddressId: string="";
  @Input() VendorAddressId: any;
  public state!: State;
  
  showLoader() {
    this.loaderService.show();
  }
  hideLoader() {
    this.loaderService.hide();
  }

  public contactAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Contact',
      icon: 'edit',
      click: (data: any): void => {
        if (data?.vendorContactId) {
          this.VendorContactId = data;
          this.clickOpenAddEditContactAddressDetails();
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Contact',
      icon: 'block',
      click: (data: any): void => {
        if (data?.vendorContactId) {
          this.VendorContactId = data?.vendorContactId;
          this.clickOpenDeactivateContactAddressDetails();
        }

      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Contact',
      icon: 'delete',
      click: (data: any): void => {
        if (data?.vendorContactId) {
          this.VendorContactId = data?.vendorContactId;
          this.clickOpenDeleteContactAddressDetails();
        }
      },
    },
  ];
  constructor(private readonly vendocontactsFacade: VendorContactsFacade, private cd: ChangeDetectorRef, private readonly loaderService: LoaderService,) { }

  ngOnChanges(changes: SimpleChanges) { 
    this.vendocontactsFacade.loadcontacts(this.VendorAddressId);    
    this.vendocontactsFacade.contacts$.subscribe((res: any) => {
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

  clickCloseDeleteContactAddress() {
    this.isContactAddressDeleteShow = false;
  }

  clickCloseDeactivateContactAddress() {
    this.isContactAddressDeactivateShow = false;
  }

  onCancelPopup(isCancel: any) {
    if (isCancel) {
      this.vendocontactsFacade.loadcontacts(this.VendorAddressId);
      this.clickCloseDeleteContactAddress();
    }
  }

  onDeactiveCancel(isCancel: any) {
    if (isCancel) {
      this.vendocontactsFacade.loadcontacts(this.VendorAddressId);
      this.clickCloseDeactivateContactAddress();

    }
  }

  clickCloseAddEditContactsDetails() {
    this.isContactsDetailShow = false;
  }

}
