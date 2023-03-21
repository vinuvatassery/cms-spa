/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, Output, EventEmitter, } from '@angular/core';
import { ContactFacade } from '@cms/case-management/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-delete-address-confirmation',
  templateUrl: './delete-address-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAddressConfirmationComponent implements OnInit {

  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade, private readonly cdr: ChangeDetectorRef) { }
  @Input() clientAddress!: any;
  @Input() clientId!: number;

  @Output() deleteModalCloseEvent= new EventEmitter<any>();
  /** Lifecycle hooks **/
  ngOnInit(): void {
  }

  deleteHomeAddress() {
    if (this.clientAddress) {
      this.contactFacade.showLoader();
      this.contactFacade.deleteClientAddress(this.clientId, this.clientAddress.clientAddressId).subscribe({
        next: (response: any) => {
          if(response){
            this.contactFacade.hideLoader();
            this.closeDeleteModal();
          }
        },
        error: (error: any) => {
          this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR,error)
        }
      })
    }
  }

  closeDeleteModal(){
    this.deleteModalCloseEvent.emit(true);
  }
}