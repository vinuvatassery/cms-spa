/** Angular **/
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
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
  @Input() userFullName!: any;
  @Input() userProfilePhoto!: any;
  @Input() linkType!: any;

  imageLoaderVisible = true;
  userImageSubject = new Subject<any>();
  userByIdSubject = new Subject<any>();

  /** Constructor**/
  constructor(
  ) {}

  /** Lifecycle hooks **/
  ngOnChanges(): void {
  }

  onLoad() {
    this.imageLoaderVisible = false;
  }
}
