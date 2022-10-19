/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'case-management-client-read-only-view',
  templateUrl: './client-read-only-view.component.html',
  styleUrls: ['./client-read-only-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientReadOnlyViewComponent {
  /** Public properties **/
  isEditClientInformationPopup = false;

  /** Internal event methods **/
  onCloseEditClientInformationClicked() {
    this.isEditClientInformationPopup = false;
  }

  onEditClientInformationClicked() {
    this.isEditClientInformationPopup = true;
  }
}
