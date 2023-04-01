/** Angular **/
import { Component, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ContactFacade } from '@cms/case-management/domain';
import { SnackBarNotificationType,NotificationSnackbarService, LoggingService} from '@cms/shared/util-core';

@Component({
  selector: 'case-management-delete-friend-or-family-confirmation',
  templateUrl: './delete-friend-or-family-confirmation.component.html',
  styleUrls: ['./delete-friend-or-family-confirmation.component.css']
})
export class DeleteFriendOrFamilyConfirmationComponent{

  @Input() clientContact!: any;
  @Input() clientId!: number;

  @Output() deleteModalCloseEvent= new EventEmitter<any>();
  constructor(private readonly contactFacade: ContactFacade, private readonly cdr: ChangeDetectorRef,
    private readonly snackbarService: NotificationSnackbarService, private readonly loggingService: LoggingService) { }

  deleteContact() {
    if (this.clientContact) {
      this.contactFacade.showLoader();
      this.contactFacade.deleteClientContact(this.clientId, this.clientContact.clientRelationshipId).subscribe({
        next: (response: any) => {
          if(response){
            this.contactFacade.hideLoader();
            this.closeDeleteModal();
            this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Friend Or Family Contact Deleted Successfully.")
          }
        },
        error: (error: any) => {
          this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR,error);
          this.loggingService.logException(error);
        }
      })
    }
  }


  closeDeleteModal(){
    this.deleteModalCloseEvent.emit(true);
  }

}
