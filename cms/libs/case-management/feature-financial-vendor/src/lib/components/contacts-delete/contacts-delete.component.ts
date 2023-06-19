import { ChangeDetectionStrategy, Component,Output,EventEmitter ,Input} from '@angular/core';
import { ContactsFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-contacts-delete',
  templateUrl: './contacts-delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsDeleteComponent {
  @Input() VendorContactId:any;
  @Output() closeDeleteContactAddress = new EventEmitter();
 /** Constructor **/
 constructor(
  private readonly contactsFacade: ContactsFacade
) {
}
  onCloseDeleteContactAddressClicked() {
    this.closeDeleteContactAddress.emit(true);
  }
  deleteContactAddress(){
    
    this.contactsFacade.removeContactAddress(this.VendorContactId).then((isDeleted:any) =>{
      if(isDeleted){
        this.onCloseDeleteContactAddressClicked();
      } 
    })
  }
}
