/** Angular **/
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'common-user-photo-icon',
  templateUrl: './user-photo-icon.component.html',
  styleUrls: ['./user-photo-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPhotoIconComponent implements OnChanges, OnDestroy {
  @Input() userId!: any;
  @Input() userFirstName!: any;
  @Input() userLastName!: any;
  @Input() userProfilePhotoExists!: any;
  @Input() linkType!: any;
  @Input() userPhotos$!: any;
  @Input() reassign: boolean = false;
  @Input() clientName!: string;
  @Input() clientCaseId!: string;
  @Input() position: any = "left";
  @Input() callout: boolean = true;
  userFullName!: any;
  imageLoaderVisible$ = new BehaviorSubject(true);
  userImageSubject = new Subject<any>();
  userByIdSubject = new Subject<any>();
  profilePhotoSubscription = new Subscription();
  userProfilePhoto!: string;

  /** Constructor**/
  constructor(
  ) {}

  /** Lifecycle hooks **/
  ngOnChanges(): void {
    this.userFullName = this.userFirstName +' '+ this.userLastName;
    this.addUserProfilePhotoSubscription();
  }

  ngOnDestroy(): void {
    if(this.profilePhotoSubscription &&  this.profilePhotoSubscription.closed !== undefined){
      this.profilePhotoSubscription.unsubscribe();
    }
  }  

  addUserProfilePhotoSubscription(){
    this.profilePhotoSubscription = this.userPhotos$?.subscribe((item: any) => {
      let filteredUserPhoto = item.filter((userPhoto: any) => userPhoto.creatorId == this.userId)[0];
      if(filteredUserPhoto){
        this.userProfilePhoto = filteredUserPhoto.profilePhoto;
        this.userImageSubject.next(this.userProfilePhoto);
        this.onLoad();
      }
    })
  }

  onLoad() {
    this.imageLoaderVisible$.next(false);
  }
}
