/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
/** facades **/
import { ContactFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-address-list',
  templateUrl: './address-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressListComponent implements OnInit {

  /** Input properties**/
  @Input() clientId!: number;
  @Input() caseEligibilityId!: string;
  /** Public properties**/
  showAddPopup$ = this.contactFacade.showAddPopup$ ;
  editAddress$  = this.contactFacade.editAddress$;
  address$ = this.contactFacade.address$;
  isEditAddress!: boolean;
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
    this.contactFacade.showAddPopupSubject.next(false);
    //this.isAddressDetailPopup = false;
  }

  onAddressDetailClicked(editValue: boolean) {
    this.contactFacade.showAddPopupSubject.next(true);
    //this.isAddressDetailPopup = true;
    this.isEditAddress = editValue;
  }

  onDeactivateAddressClosed() {
    this.isDeactivateAddressPopup = false;
  }

  onDeactivateAddressClicked() {
    this.isDeactivateAddressPopup = true;
  }
}
