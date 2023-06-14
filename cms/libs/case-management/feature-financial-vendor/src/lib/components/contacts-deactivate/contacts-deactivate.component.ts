import { ChangeDetectionStrategy, Component,EventEmitter,Output } from '@angular/core';
import { ContactsFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-contacts-deactivate',
  templateUrl: './contacts-deactivate.component.html',
  styleUrls: ['./contacts-deactivate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsDeactivateComponent {
  @Output() closeDeactivateContactAddress = new EventEmitter();

 /** Constructor **/
 constructor(
  private readonly contactsFacade: ContactsFacade
) {
}
  onCloseDeactivateContactAddressClicked() {
    this.closeDeactivateContactAddress.emit();
  }

  onDeactivateClick()
  {
   // this.contactsFacade.deactiveContactAddress(this.clientPharmacyDetails.clientPharmacyId);
  }
}
