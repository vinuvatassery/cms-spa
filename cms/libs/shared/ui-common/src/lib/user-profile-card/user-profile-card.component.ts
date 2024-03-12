/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { UserManagementFacade, UserDefaultRoles } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'common-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileCardComponent implements OnInit {
  @Input() userId!: any;
  @Input() reassign?: boolean = false;
  @Input() sendEmail?: boolean = false;
  @Input() clientName: any;
  @Input() clientCaseId: any;
  @Input() userProfilePhotoExists: any;
  userImage$ = this.userManagementFacade.userImage$;
  userById$ = this.userManagementFacade.usersById$;
  caseOwners$ = this.userManagementFacade.usersByRole$;
  imageLoaderVisible = true;
  businessLogicPopupOpen = false;
  hasReassignPermission = false;
  private reassignCaseTemp: any;
  /** Constructor**/
  constructor(
    private userManagementFacade: UserManagementFacade,
    private dialogService: DialogService
  ) {
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    if(this.userProfilePhotoExists){
    this.loadProfilePhoto();
    }
    this.loadProfileData();
    this.loadUsersByRole();
    this.hasReassignPermission = this.userManagementFacade.hasPermission([
      'Reassign_Cases',
    ]);
  }

  loadProfilePhoto() {
    if (this.userId) {
      this.userManagementFacade.getUserImage(this.userId);
    }
  }

  loadProfileData() {
    if (this.userId) {
      this.userManagementFacade.getUserById(this.userId);
    }
  }

  onLoad() {
    this.imageLoaderVisible = false;
  }

  loadUsersByRole() {
    this.userManagementFacade.getUsersByRole(UserDefaultRoles.CACaseWorker);
  }

  onReassignClicked(data: any) {
    this.userManagementFacade.showLoader();
    this.userManagementFacade.reassignCase(data).subscribe({
      next: (response: any) => {
        this.userManagementFacade.hideLoader();
        this.userManagementFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, response[1].message, response[0].message);
        this.businessLogicPopupClose();
      },
      error: (err: any) => {
        this.userManagementFacade.hideLoader();
        this.userManagementFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      }
    });
  }

  public openBusinessPopup(template: TemplateRef<unknown>): void {
    this.reassignCaseTemp = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-md app-c-modal-np',
    });
    this.businessLogicPopupOpen = true;
  }

  businessLogicPopupClose() {
    this.reassignCaseTemp.close();
    this.businessLogicPopupOpen = false;
  }
}
