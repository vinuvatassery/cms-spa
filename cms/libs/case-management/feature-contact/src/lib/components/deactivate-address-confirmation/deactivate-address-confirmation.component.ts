/** Angular **/
import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef, Output, EventEmitter, } from '@angular/core';
import { ContactFacade} from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-deactivate-address-confirmation',
  templateUrl: './deactivate-address-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateAddressConfirmationComponent {

  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade, private readonly cdr: ChangeDetectorRef) { }
  @Input() clientAddress!: any;
  @Input() clientId!: number;
  @Input() caseEligibilityId!: string;

  @Output() deactivateModalCloseEvent= new EventEmitter<any>();

  deactivateHomeAddress() {
    if (this.clientAddress) {
      this.clientAddress.activeFlag=StatusFlag.No;
      this.clientAddress.endDate= new Date();
      this.contactFacade.showLoader();
      this.contactFacade.updateAddress(this.clientId ?? 0, this.caseEligibilityId ?? '', this.clientAddress).subscribe({
        next: (response: any) => {
          if(response){
            this.contactFacade.hideLoader();
            this.closeDeactivateModal();
          }
        },
        error: (error: any) => {
          this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR,error)
        }
      })
    }
  }

  closeDeactivateModal(){
    this.deactivateModalCloseEvent.emit(true);
  }

}
