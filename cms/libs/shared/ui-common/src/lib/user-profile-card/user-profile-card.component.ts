/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  OnInit,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
//import { UserDefaultRoles } from '@cms/case-management/domain';
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
  @Input() clientId: any;
  @Input() clientCaseId: any;
  @Output() reassignClicked = new EventEmitter<any>();
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
    this.hasReassignPermission = userManagementFacade.hasPermission([
      'Reassign_Cases',
    ]);
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadProfilePhoto();
    this.loadProfileData();
    this.loadUsersByRole();
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
    this.userManagementFacade.getUsersByRole("CACW");
  }

  onReassignClicked(data: any) {debugger;
    console.log('2-data',data);
    this.reassignClicked.emit(data);
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
