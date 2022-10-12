/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** facades **/
import { ContactFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressListComponent implements OnInit {
  /** Public properties**/
  address$ = this.contactFacade.address$;
  isEditAddress!: boolean;
  isAddressDetailPopup = false;
  isDeactivateAddressPopup = false;
  gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit Address",
      icon: "edit",
      click: (): void => {
        this.onAddressDetailClicked(true);
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Deactivate Address",
      icon: "block",
      click: (): void => {
       this.onDeactivateAddressClicked()
      },
    },
    {
      buttonType: "btn-h-danger",
      text: "Delete Address",
      icon: "delete",
      click: (): void => {
      //  this.onDeactivateAddressClicked()
      },
    },
   
    
 
  ];
  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadAddress();
  }

  /** Private methods **/
  private loadAddress() {
    this.contactFacade.loadAddress();
  }

  /** Internal event methods **/
  onAddressDetailClosed() {
    this.isAddressDetailPopup = false;
  }

  onAddressDetailClicked(editValue: boolean) {
    this.isAddressDetailPopup = true;
    this.isEditAddress = editValue;
  }

  onDeactivateAddressClosed() {
    this.isDeactivateAddressPopup = false;
  }

  onDeactivateAddressClicked() {
    this.isDeactivateAddressPopup = true;
  }
}
