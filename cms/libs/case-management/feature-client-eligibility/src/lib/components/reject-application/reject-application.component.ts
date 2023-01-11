/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit,Input,Output, EventEmitter} from '@angular/core';
import {CaseFacade,CaseStatusCode} from '@cms/case-management/domain';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';


@Component({
  selector: 'case-management-reject-application',
  templateUrl: './reject-application.component.html',
  styleUrls: ['./reject-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RejectApplicationComponent implements OnInit {


  @Input() clientCaseId: string = '';
  @Output() isCloseDenyModal: EventEmitter<boolean> = new EventEmitter();
  caseStatus = {
    clientCaseId : '',
    caseStatusCode:''
  }

  constructor(private readonly caseFacade: CaseFacade,private readonly loaderService: LoaderService) {}
  ngOnInit(): void {
    this.caseStatus.clientCaseId = this.clientCaseId;
    this.caseStatus.caseStatusCode = CaseStatusCode.reject;
  }
  updateCaseStatus()
  {
    this.loaderService.show();
    this.caseFacade.updateCaseStatuss(this.caseStatus).subscribe({
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
