/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ContactFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-phone-list',
  templateUrl: './phone-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneListComponent implements OnInit {
  /** Public properties **/
  phoneNumbers$ = this.contactFacade.phoneNumbers$;
  isEditPhoneNumber!: boolean;
  isPhoneNumberDetailPopup = false;
  isDeactivatePhoneNumberPopup = false;
  // gridOption: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public gridOption = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Phone",
      icon: "edit",
      click: (): void => {
        this.onPhoneNumberDetailClicked(true);
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Make Preferred",
      icon: "star",
      click: (): void => {
      //  this.onDeactivateEmailAddressClicked()
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Deactivate Phone",
      icon: "block",
      click: (): void => {
       this.onDeactivatePhoneNumberClicked()
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete Phone",
      icon: "delete",
      click: (): void => {
      //  this.onDeactivatePhoneNumberClicked()
      },
    },
   
    
 
  ];

  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadPhoneNumbers();
  }

  /** Private methods **/
  private loadPhoneNumbers() {
    this.contactFacade.loadPhoneNumbers();
  }

  /** Internal event methods **/
  onPhoneNumberDetailClosed() {
    this.isPhoneNumberDetailPopup = false;
  }

  onPhoneNumberDetailClicked(editValue: boolean) {
    this.isPhoneNumberDetailPopup = true;
    this.isEditPhoneNumber = editValue;
  }

  onDeactivatePhoneNumberClosed() {
    this.isDeactivatePhoneNumberPopup = false;
  }

  onDeactivatePhoneNumberClicked() {
    this.isDeactivatePhoneNumberPopup = true;
  }
}
