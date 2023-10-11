/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input,Output, EventEmitter } from '@angular/core';
/** Facades **/
import { ContactFacade,FriendsOrFamilyContactClientProfile} from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SnackBarNotificationType,NotificationSnackbarService, LoaderService, LoggingService} from '@cms/shared/util-core';
@Component({
  selector: 'case-management-deactivate-friend-or-family-confirmation',
  templateUrl: './deactivate-friend-or-family-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateFriendOrFamilyConfirmationComponent implements OnInit {
  /** Public properties **/
  @Input() clientContact!: any;
  @Input() clientId!: number;
  @Input() isEdit!: any;

  @Output() deactivateModalCloseEvent= new EventEmitter<any>();
  ddlRelationshipToClient$ = this.contactFacade.ddlRelationshipToClient$;
  contact!: FriendsOrFamilyContactClientProfile ;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade,  private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService, private readonly snackbarService: NotificationSnackbarService) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlRelationshipToClientData();
    this.populateModel()
  }

  /** Private methods **/
  private loadDdlRelationshipToClientData() {
    this.contactFacade.loadDdlRelationshipToClient();
  }
  closeDeactivateModal(isCancelClicked : boolean){
    this.deactivateModalCloseEvent.emit(isCancelClicked);
  }
  populateModel()
  {
    this.contact = {
      clientRelationshipId: this.clientContact.clientRelationshipId,
      clientId: this.clientId,
      clientCaseEligibilityId: this.clientContact.clientCaseEligibilityId,
      relationshipSubTypeCode: this.clientContact.relationshipSubTypeCode,
      firstName: this.clientContact.firstName,
      lastName: this.clientContact.lastName,
      phoneNbr: this.clientContact.phoneNbr,
      activeFlag: StatusFlag.No,
      concurrencyStamp: this.clientContact.concurrencyStamp
    }
  }
  deactivateContact()
  {
    this.loaderService.show();
    return this.contactFacade.updateContact(this.clientId ?? 0, this.contact).subscribe({
      next:(data)=>{
        this.loaderService.hide();
        this.deactivateModalCloseEvent.emit(this.isEdit);
        this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Friend Or Family Contact Updated Successfully.")
      },
      error:(error)=>{
        this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR,error)
        this.loggingService.logException(error);
         this.loaderService.hide();
      }
    });
  }
}
