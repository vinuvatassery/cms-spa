import { ChangeDetectionStrategy, Component,EventEmitter,Output,Input } from '@angular/core';
import { VendorContactsFacade } from '@cms/case-management/domain';
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
  private readonly vendocontactsFacade: VendorContactsFacade
) {
}
  onCloseDeactivateContactAddressClicked() {
    this.closeDeactivateContactAddress.emit(true);
  }
  deactiveContactAddress(){
    this.vendocontactsFacade.deactiveContactAddress(this.VendorContactId).then((isDeavtivated:any) =>{
      if(isDeavtivated){
        this.onCloseDeactivateContactAddressClicked();
      } 
    })
  }
 
}
