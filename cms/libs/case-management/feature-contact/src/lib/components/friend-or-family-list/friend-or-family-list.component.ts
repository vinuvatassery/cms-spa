/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
/** Facades **/
import { ContactFacade, CaseFacade } from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { UserManagementFacade } from '@cms/system-config/domain';
import { Subject } from 'rxjs';

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
  isGridLoaderShow = true;
  contactGridLoader$ = this.contactFacade.contactGridLoader$;
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
  userAlternateGridPhotosSubject = new Subject<any>();
  familyFriendsProfilePhoto$ = this.contactFacade.familyFriendsProfilePhotoSubject;

  // gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
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
  constructor(private readonly contactFacade: ContactFacade,  private readonly cdr:ChangeDetectorRef,private caseFacade: CaseFacade,
    private readonly userManagementFacade: UserManagementFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadFriendsOrFamily();
  }

  /** Private methods **/
  private loadFriendsOrFamily() {
    this.contactFacade.loadFriendsorFamily(this.clientId, this.caseEligibilityId);
    this.contactFacade.friendsOrFamily$.subscribe((contacts:any)=>{
      this.gridView= contacts.filter((x:any)=>x.activeFlag == StatusFlag.Yes);
      this.allList=contacts;
      if(this.showHistoricalDataFlag){
        this.gridView=this.allList
      }
      this.cdr.detectChanges();
    })
    this.contactGridLoader$.subscribe((data : any) => {
      this.isGridLoaderShow = data;
    });
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
    this.contactFacade.loadFriendsorFamily(this.clientId, this.caseEligibilityId);
    this.onFriendOrFamilyDetailClosed();
  }
  showHistoricalDataClick(){
    if(this.showHistoricalDataFlag){
      this.gridView=this.allList;
    }
    else{
      this.gridView= this.allList.filter((x:any)=>x.activeFlag == StatusFlag.Yes);
    }
    this.contactFacade.loadFamilyAndFriendsDistinctUserIdsAndProfilePhoto(this.gridView);
    this.cdr.detectChanges();
  }
  public rowClass = (args:any) => ({
    "table-row-disabled": (args.dataItem.activeFlag != StatusFlag.Yes),
  });
  closeDeleteModal(event:any){
    this.contactFacade.loadFriendsorFamily(this.clientId, this.caseEligibilityId);
    this.isDeleteFriendOrFamilyOpened = false;
  }
  closeDeactivateModal(event:any){
    this.contactFacade.loadFriendsorFamily(this.clientId, this.caseEligibilityId);
    this.isDeactivateFriendOrFamilyOpened = false;
  }
}
