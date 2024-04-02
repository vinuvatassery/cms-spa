/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
/** facades **/
import { ClientAddress, ContactFacade, CaseFacade } from '@cms/case-management/domain';
import { AddressType, StatusFlag } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';

@Component({
  selector: 'case-management-address-list',
  templateUrl: './address-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressListComponent implements OnInit {
  addressListLoader = false;
  /** Input properties**/
  @Input() clientId!: number;
  @Input() caseEligibilityId!: string;
  /** Public properties**/
  showAddPopup$ = this.contactFacade.showAddPopup$ ;
  editAddress$  = this.contactFacade.editAddress$;
 	addressGridView:any[]=[];
  allAddressList:any[]=[];
  isEditAddress!: boolean;
  isDeactivateAddressPopup = false;
  isDeleteAddressPopup = false;
  showHistoricalFlag!:boolean;
  gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  clientAddress!:ClientAddress;
  isDeactivateFlag:boolean = false;
  isDeleteFlag:boolean = false;
  showFormFieldsFlag:boolean = false;
  clientAddressId!:any;
  editAddressTypeText:string='';
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  DialogboxTitle!:string;
  distinctUserIds!: string;
  allProfilePhotosList:any[]=[];
  userPhotosSubject = new Subject<any>();
  addressListProfilePhoto$ = this.contactFacade.addressListProfilePhotoSubject;
  distinctUserIds!: string;
  allProfilePhotosList:any[]=[];
  userPhotosSubject = new Subject<any>();
  addressListProfilePhoto$ = this.contactFacade.addressListProfilePhotoSubject;
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit Address",
      icon: "edit",
      click: (address:any): void => {
        if(address.clientAddressId !== undefined){
          this.clientAddress = address;
          this.editAddressTypeText ='Edit ' + address?.addressTypeDesc + ' Address';
        } 
          this.contactFacade.editedAddressSubject.next(this.clientAddress);
          this.onAddressDetailClicked(true);
          this.contactFacade.editAddressSubject.next(false);
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Deactivate Address",
      icon: "block",
      click: (address:any): void => {
        if(address.clientAddressId){
          this.clientAddress = address;
          this.onDeactivateAddressClicked(address)
        }
      },
    },
    {
      buttonType: "btn-h-danger",
      text: "Delete Address",
      icon: "delete",
      click: (address:any): void => {
        if(address.clientAddressId){
          this.clientAddress = address;
          this.onDeleteAddressClicked(address)
        }
      },
    },
   
    
 
  ];
  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade, private readonly cdr:ChangeDetectorRef,private caseFacade: CaseFacade,) {}
  constructor(private readonly contactFacade: ContactFacade, private readonly cdr:ChangeDetectorRef,private caseFacade: CaseFacade,) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadAddress();
  }

  /** Private methods **/
  private loadAddress() {
    this.contactFacade.getClientAddress(this.clientId);
    this.contactFacade.address$.subscribe((address:any[])=>{
    this.contactFacade.address$.subscribe((address:any[])=>{
      this.addressGridView= address.filter((x:any)=>x.activeFlag == StatusFlag.Yes);
      this.allAddressList=address;
      if(this.showHistoricalFlag){
        this.addressGridView=this.allAddressList;
        this.addressGridView=this.allAddressList;
      }
      this.cdr.detectChanges();
    })
    this.addressListLoader = false;
  }

  /** Internal event methods **/
  onAddressDetailClosed() {
    this.contactFacade.showAddPopupSubject.next(false);
  }

  onAddressDetailClicked(editValue: boolean) {
    this.contactFacade.showAddPopupSubject.next(true);
    this.isEditAddress = editValue;
    this.showFormFieldsFlag=false;
    this.isDeactivateFlag=false;
    this.isDeleteFlag=false;
  }
 
  onDeactivateAddressClosed() {
    this.isDeactivateAddressPopup = false;
  }

  onDeactivateAddressClicked(address:any) {
    if(address.addressTypeCode == AddressType.Home||address.addressTypeCode == AddressType.UnHoused){
      this.isDeactivateAddressPopup = true;
    }
    if(address.addressTypeCode == AddressType.Mailing){
      this.showFormFieldsFlag=true;
      this.isEditAddress=false;
      this.isDeactivateFlag=true;
      this.isDeleteFlag=false;
      this.clientAddressId=address.clientAddressId;
      this.contactFacade.showAddPopupSubject.next(true);
    }
  }
  
  onDeleteAddressClicked(address:any){
    if(address.addressTypeCode == AddressType.Home){
      this.isDeleteAddressPopup = true;
      this.DialogboxTitle="Delete Home Address?"
    }
    if(address.addressTypeCode == AddressType.UnHoused){
      this.isDeleteAddressPopup = true;
      this.DialogboxTitle="Delete Unhoused Address";
    }
    if(address.addressTypeCode == AddressType.Mailing){
      this.showFormFieldsFlag=true;
      this.isEditAddress=false;
      this.isDeactivateFlag=false;
      this.isDeleteFlag=true;
      this.clientAddressId=address.clientAddressId;
      this.contactFacade.showAddPopupSubject.next(true);
    }
  }

  onDeleteAddressClosed() {
    this.isDeleteAddressPopup = false;
  }

  handleShowHistoricalClick(){
    this.addressListLoader = true;
    if(this.showHistoricalFlag){
      this.addressGridView=this.allAddressList;
    }
    else{
      this.addressGridView= this.allAddressList.filter((x:any)=>x.activeFlag == StatusFlag.Yes);
    }
    this.addressListLoader = false;
    this.contactFacade.loadAddressDistinctUserIdsAndProfilePhoto(this.addressGridView);
    this.cdr.detectChanges();
    this.contactFacade.loadAddressDistinctUserIdsAndProfilePhoto(this.addressGridView);
    this.cdr.detectChanges();
  }

  public rowClass = (args:any) => ({
    "table-row-disabled": (args.dataItem.activeFlag != StatusFlag.Yes),
  });

  closeDeactivateModalAndReload(event:any){
    this.onDeactivateAddressClosed();
    this.contactFacade.getClientAddress(this.clientId);
  }

  closeDeleteModalAndReload(event:any){
    this.onDeleteAddressClosed();
    this.contactFacade.getClientAddress(this.clientId);
  }

  onAddressDetailCloseEvent(event:any){
    this.contactFacade.getClientAddress(this.clientId);
    this.onAddressDetailClosed();
  }

  onDeactivateButtonClick(event:any){
    this.contactFacade.showAddPopupSubject.next(false);
    this.onDeactivateAddressClicked(this.clientAddress)
  }
}
