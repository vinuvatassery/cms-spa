/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
/** Facades **/
import { ContactFacade, StatusFlag } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-friend-or-family-list',
  templateUrl: './friend-or-family-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendOrFamilyListComponent implements OnInit {


  @Input() clientId!: number;
  @Input() caseEligibilityId!: string;
  /** Public properties **/
  isEdit!: boolean;
  showAddContactPopup$ = this.contactFacade.showAddContactPopup$;
  friendsOrFamily$ = this.contactFacade.friendsOrFamily$;
  isFriendsorFamilyEdit!: boolean;
  isFriendOrFamilyDetailOpened = false;
  isDeactivateFriendOrFamilyOpened = false;
  isDeleteFriendOrFamilyOpened = false
  gridView:any[]=[];
  allList:any[]=[];
  showHistoricalDataFlag = false
  selectedContact!:any;

  // gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';

  public gridOptionData = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Contact",
      icon: "edit",
      click: (contact:any): void => {
        this.selectedContact = contact;
        this.onFriendOrFamilyDetailClicked(true);
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Deactivate Contact",
      icon: "block",
      click: (contact:any): void => {
        if(contact.clientRelationshipId)
        {
          this.selectedContact = contact;
          this.onDeactivateFriendOrFamilyClicked();
        }
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete Contact",
      icon: "delete",
      click: (contact:any): void => {
        if(contact.clientRelationshipId)
        {
          this.selectedContact = contact;
          this.onDeleteFriendOrFamilyClicked();
        }
      },
    },
  ];

  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade,  private readonly cdr:ChangeDetectorRef) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadFriendsOrFamily();
  }

  /** Private methods **/
  private loadFriendsOrFamily() {
    this.contactFacade.loadFriendsorFamily(this.clientId);
    this.contactFacade.friendsOrFamily$.subscribe((contacts:any)=>{
      this.gridView= contacts.filter((x:any)=>x.activeFlag == StatusFlag.Yes);
      this.allList=contacts;
      if(this.showHistoricalDataFlag){
        this.gridView=this.allList
      }
      this.cdr.detectChanges();
    })
  }

  /** Internal event methods **/
  onFriendOrFamilyDetailClosed() {
    this.contactFacade.showAddContactPopupSubject.next(false);
    this.isFriendOrFamilyDetailOpened = false;
  }

  onFriendOrFamilyDetailClicked(editValue: boolean) {
    this.contactFacade.showAddContactPopupSubject.next(true);
    this.isEdit = editValue;
    this.isFriendOrFamilyDetailOpened = true;
    this.isFriendsorFamilyEdit = editValue;
  }

  onDeactivateFriendOrFamilyClosed() {
    this.isDeactivateFriendOrFamilyOpened = false;
  }

  onDeactivateFriendOrFamilyClicked() {
    this.isEdit = false;
    this.isDeactivateFriendOrFamilyOpened = true;
  }
  onDeleteFriendOrFamilyClicked() {
    this.isEdit = false;
    this.isDeleteFriendOrFamilyOpened = true;
  }
  onDeleteFriendOrFamilyClosed() {
    this.isDeleteFriendOrFamilyOpened = false;
  }

  onFriendOrFamilyDetailCloseEvent(event:any){
    this.contactFacade.loadFriendsorFamily(this.clientId);
    this.onFriendOrFamilyDetailClosed();
  }
  showHistoricalDataClick(){
    if(this.showHistoricalDataFlag){
      this.gridView=this.allList;
    }
    else{
      this.gridView= this.allList.filter((x:any)=>x.activeFlag == StatusFlag.Yes);
    }
    this.cdr.detectChanges();
  }
  public rowClass = (args:any) => ({
    "table-row-disabled": (args.dataItem.activeFlag != StatusFlag.Yes),
  });
  closeDeleteModal(event:any){
    this.contactFacade.loadFriendsorFamily(this.clientId);
    this.isDeleteFriendOrFamilyOpened = false;
  }
  closeDeactivateModal(event:any){
    this.contactFacade.loadFriendsorFamily(this.clientId);
    this.isDeactivateFriendOrFamilyOpened = false;
  }
}
