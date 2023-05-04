/** Angular **/
import { Component, ChangeDetectionStrategy, Input,Output, EventEmitter} from '@angular/core';
import {CaseFacade,CaseStatusCode} from '@cms/case-management/domain';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';


@Component({
  selector: 'case-management-reject-application',
  templateUrl: './reject-application.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RejectApplicationComponent {

  @Input() clientCaseEligibilityId: string = '';
  @Input() clientCaseId: string = '';
  @Output() isCloseDenyModal: EventEmitter<boolean> = new EventEmitter();
  
  constructor(private readonly caseFacade: CaseFacade,private readonly loaderService: LoaderService) {}

  updateCaseStatus()
  {
    this.loaderService.show();
    this.caseFacade.updateCaseStatus(this.clientCaseId,CaseStatusCode.reject,this.clientCaseEligibilityId).subscribe({
      next: (data) => {
        this.caseFacade.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'Case status updated successfully.'
        );
        this.isCloseDenyModal.emit(true);
        this.loaderService.hide();
      },
      error: (err) => {
        if (err){
          this.loaderService.hide();
          this.caseFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
        }
      },
    });
  }

  onModalClose()
  {
    this.isCloseDenyModal.emit(false);
  }
}
