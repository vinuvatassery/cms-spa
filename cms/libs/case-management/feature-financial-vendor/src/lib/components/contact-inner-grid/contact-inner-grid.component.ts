import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import { PaymentsFacade, contactResponse } from '@cms/case-management/domain';
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
        this.clickOpenDeactivateContactAddressDetails();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Address',
      icon: 'delete',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenDeleteContactAddressDetails();
      },
    },
  ];
  constructor(private readonly paymentsFacade: PaymentsFacade,private cd:ChangeDetectorRef) {}

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
}
