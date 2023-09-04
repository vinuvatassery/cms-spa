import { ChangeDetectionStrategy, Component,Output,EventEmitter ,Input} from '@angular/core';
import { VendorContactsFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-contacts-delete',
  templateUrl: './contacts-delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsDeleteComponent {
  @Input() VendorContactId:any;
  @Input() vendorId:any;
  @Output() closeDeleteContactAddress = new EventEmitter();
 /** Constructor **/
 constructor(
  private readonly vendorContactsFacade: VendorContactsFacade
) {
}
  onCloseDeleteContactAddressClicked() {
    this.closeDeleteContactAddress.emit(true);
  }
  deleteContactAddress(){

    this.vendorContactsFacade.removeContactAddress(this.VendorContactId).then((isDeleted:any) =>{
      if(isDeleted){
        this.onCloseDeleteContactAddressClicked();
        this.vendorContactsFacade.loadVendorAllContacts(this.vendorId);
      }
    })
  }
}
