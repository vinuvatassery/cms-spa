/** Angular **/
import { Component, 
  ChangeDetectionStrategy,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
/** Internal Libraries **/
import { CaseFacade, CaseStatusCode } from '@cms/case-management/domain';
import { LoaderService, LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-duplicate-client-found',
  templateUrl: './duplicate-client-found.component.html',
  styleUrls: ['./duplicate-client-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuplicateClientFoundComponent implements OnInit {

  @Input() currentClientInfo: any = {};
  @Input() matchingClientInfo: any = {};
  @Input() clientCaseEligibilityId: string = '';
  duplicateBtnDisabled = false;

  @Output() closeModalClick = new EventEmitter<any>();
  ssn: string = '';
  constructor(private router: Router,
    private caseFacade: CaseFacade,
    private loaderService: LoaderService,
    private loggingService: LoggingService) {

  }

  ngOnInit(): void {
    if (this.currentClientInfo.ssn != this.matchingClientInfo.ssn) {
      this.ssn =  '___-__-____'
    }
    else {
      this.ssn = this.currentClientInfo.ssn
    }
    if(isNaN(this.currentClientInfo.dob)){
      this.currentClientInfo.dob=null
    }
  }
  formatSSN(ssn: string): string {
    return ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
  }
  onDuplicateFoundClick() {
    this.duplicateBtnDisabled = true;
    this.loaderService.show();
    this.caseFacade.updateCaseStatus(this.currentClientInfo.clientCaseId, CaseStatusCode.canceled,this.clientCaseEligibilityId).subscribe({
      next: (response: any) => {
        this.router.navigate([`/case-management/cases/case360/${this.matchingClientInfo.clientId}`])
        this.closeModalClick.next(true);
        this.loaderService.hide();
      },
      error: (err: any) => {
        this.loaderService.hide();
        this.loggingService.logException(err);
        this.caseFacade.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        this.duplicateBtnDisabled = false;
      }
    })
  }

  onNotaDuplicateClick() {
    this.closeModalClick.next(true);
  }
}

