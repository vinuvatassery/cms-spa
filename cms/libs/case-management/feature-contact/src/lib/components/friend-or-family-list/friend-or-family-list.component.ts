/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ContactFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-friend-or-family-list',
  templateUrl: './friend-or-family-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendOrFamilyListComponent implements OnInit {
  /** Public properties **/
  friendsOrFamily$ = this.contactfacade.friendsOrFamily$;
  isFriendsorFamilyEdit!: boolean;
  isFriendOrFamilyDetailOpened = false;
  isDeactivateFriendOrFamilyOpened = false;
  // gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';

  public gridOptionData = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Contact",
      icon: "edit",
      click: (): void => {
        this.onFriendOrFamilyDetailClicked(true);
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Deactivate Phone",
      icon: "block",
      click: (): void => {
      //  this.onDeactivatePhoneNumberClicked()
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete Contact",
      icon: "delete",
      click: (): void => {
      //  this.onDeactivatePhoneNumberClicked()
      },
    },
  ];

  /** Constructor **/
  constructor(private readonly contactfacade: ContactFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadFriendsOrFamily();
  }

  /** Private methods **/
  private loadFriendsOrFamily() {
    this.contactfacade.loadFriendsorFamily();
  }

  /** Internal event methods **/
  onFriendOrFamilyDetailClosed() {
    this.isFriendOrFamilyDetailOpened = false;
  }

  onFriendOrFamilyDetailClicked(editValue: boolean) {
    this.isFriendOrFamilyDetailOpened = true;
    this.isFriendsorFamilyEdit = editValue;
  }

  onDeactivateFriendOrFamilyClosed() {
    this.isDeactivateFriendOrFamilyOpened = false;
  }

  onDeactivateFriendOrFamilyClicked() {
    this.isDeactivateFriendOrFamilyOpened = true;
  }
}
