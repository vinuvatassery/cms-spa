import { Component, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';

@Component({
  selector: 'common-delete-profile-photo-confirmation',
  templateUrl: './delete-profile-photo-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteProfilePhotoConfirmationComponent {
  @Output() isModalDeleteCloseClicked = new EventEmitter();
  @Output() isModalDeleteClicked = new EventEmitter();

  onCloseDeleteClicked() 
  {
  this.isModalDeleteCloseClicked.emit(true);
  }
  onDeleteClicked() 
  {
  this.isModalDeleteClicked.emit(true);
  }
}
