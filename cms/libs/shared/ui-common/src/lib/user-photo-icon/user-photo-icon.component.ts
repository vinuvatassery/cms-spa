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
  @Input() userData!: any;
  @Input() linkType!: any;

  imageLoaderVisible = true;
  // userData!: any;
  userImageSubject = new Subject<any>();
  userByIdSubject = new Subject<any>();

  /** Constructor**/
  constructor(
    private userManagementFacade: UserManagementFacade,
    private readonly userDataService: UserDataService
  ) {}

  /** Lifecycle hooks **/

  ngOnChanges(): void {
    this.loadprofilePhoto();
    this.loadprofileData();
  }

  loadprofilePhoto() {
    if (this.userData?.creatorId) {
      const userId = this.userData?.creatorId;
      this.userDataService.getUserImage(userId).subscribe({
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
  }

  loadprofileData() {
    if (this.userData) {
      this.userByIdSubject.next(this.userData);
      // this.userDataService.getUserById(this.userId).subscribe({
      //   next: (userDataResponse: any) => {
      //     this.userByIdSubject.next(userDataResponse);
      //   },
      //   error: (err) => {
      //     this.userManagementFacade.showHideSnackBar(
      //       SnackBarNotificationType.ERROR,
      //       err
      //     );
      //   },
      // });
    }
  }

  onLoad() {
    this.imageLoaderVisible = false;
  }
}
