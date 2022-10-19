/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'case-management-client-eligibility',
  templateUrl: './client-eligibility.component.html',
  styleUrls: ['./client-eligibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientEligibilityComponent {
  /** Public properties **/
  isShowException = false;
  isOpenAcceptance = false;
  isOpenDeny = false;

  /** Internal event methods **/
  onToggleExceptionClicked() {
    this.isShowException = !this.isShowException;
  }

  onCloseAcceptanceClicked() {
    this.isOpenAcceptance = false;
  }

  isOpenAcceptanceClicked() {
    this.isOpenAcceptance = true;
  }

  isCloseDenyClicked() {
    this.isOpenDeny = false;
  }

  isOpenDenyClicked() {
    this.isOpenDeny = true;
  }
}
