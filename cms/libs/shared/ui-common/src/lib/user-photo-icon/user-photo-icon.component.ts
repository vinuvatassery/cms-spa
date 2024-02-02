/** Angular **/
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { UserDataService, UserManagementFacade } from '@cms/system-config/domain';

import { Subject } from 'rxjs';

@Component({
  selector: 'common-user-photo-icon',
  templateUrl: './user-photo-icon.component.html',
  styleUrls: ['./user-photo-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPhotoIconComponent implements OnChanges {
  @Input() userId!: any;
  @Input() userFirstName!: any;
  @Input() userLastName!: any;
  @Input() userProfilePhotoExists!: any;
  @Input() linkType!: any;
  userFullName!: any;
  imageLoaderVisible = true;
  userImageSubject = new Subject<any>();
  userByIdSubject = new Subject<any>();
  userImage$ = this.userManagementFacade.userImage$;

  /** Constructor**/
  constructor(
    private userManagementFacade: UserManagementFacade,
    private readonly userDataService: UserDataService
  ) {}

  /** Lifecycle hooks **/
  ngOnChanges(): void {
    this.userFullName = this.userFirstName +' '+ this.userLastName;
    if(this.userId && this.userProfilePhotoExists == true){
    this.loadprofilePhoto();
    }
  }

  loadprofilePhoto() {
      this.userDataService.getUserImage(this.userId).subscribe({
        next: (userImageResponse: any) => {
          this.userImageSubject.next(userImageResponse);
        },
        error: (err) => {
          this.userManagementFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
        },
      });
  }

  onLoad() {
    this.imageLoaderVisible = false;
  }
}
