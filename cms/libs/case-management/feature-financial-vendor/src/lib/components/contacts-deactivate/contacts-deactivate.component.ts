import { ChangeDetectionStrategy, Component,EventEmitter,Output,Input } from '@angular/core';
import { ContactsFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-contacts-deactivate',
  templateUrl: './contacts-deactivate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsDeactivateComponent {
  @Input() VendorContactId:any;
  @Output() closeDeactivateContactAddress = new EventEmitter();

 /** Constructor **/
 constructor(
  private readonly contactsFacade: ContactsFacade
) {
}
  onCloseDeactivateContactAddressClicked() {
    this.closeDeactivateContactAddress.emit(true);
  }
  deactiveContactAddress(){
    this.contactsFacade.deactiveContactAddress(this.VendorContactId).then((isDeavtivated:any) =>{
      if(isDeavtivated){
        this.onCloseDeactivateContactAddressClicked();
      } 
    })
  }
 
}
