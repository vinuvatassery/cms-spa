import { ChangeDetectionStrategy, Component,EventEmitter,Output,Input } from '@angular/core';
import { VendorContactsFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-contacts-deactivate',
  templateUrl: './contacts-deactivate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsDeactivateComponent {
  @Input() VendorContactId:any;
  @Input() vendorId:any;
  @Output() closeDeactivateContactAddress = new EventEmitter();

 /** Constructor **/
 constructor(
  private readonly vendorContactsFacade: VendorContactsFacade
) {
}
  onCloseDeactivateContactAddressClicked() {
    this.closeDeactivateContactAddress.emit(true);
  }
  deactiveContactAddress(){
    this.vendorContactsFacade.deactiveContactAddress(this.VendorContactId).then((isDeavtivated:any) =>{
      if(isDeavtivated){
        this.onCloseDeactivateContactAddressClicked();
        this.vendorContactsFacade.loadVendorAllContacts(this.vendorId);
      }
    })
  }

}
