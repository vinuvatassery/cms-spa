/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
/** facades **/
import { ContactFacade, StatusFlag } from '@cms/case-management/domain';

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
 	addressGridView:any[]=[];
  allAddressList:any[]=[];
  isEditAddress!: boolean;
  isDeactivateAddressPopup = false;
  showHistoricalFlag!:boolean;
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
  constructor(private readonly contactFacade: ContactFacade, private readonly cdr:ChangeDetectorRef) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadAddress();
  }

  /** Private methods **/
  private loadAddress() {
    this.contactFacade.getClientAddress(this.clientId);
    this.contactFacade.address$.subscribe((address:any)=>{
      this.addressGridView= address.filter((x:any)=>x.activeFlag == StatusFlag.Yes);
      this.allAddressList=address;
      this.cdr.detectChanges();
    })
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

  handleShowHistoricalClick(){
    if(this.showHistoricalFlag){
      this.addressGridView=this.allAddressList;
    }
    else{
      this.addressGridView= this.allAddressList.filter((x:any)=>x.activeFlag == StatusFlag.Yes);
    }
    this.cdr.detectChanges();
  }
}
