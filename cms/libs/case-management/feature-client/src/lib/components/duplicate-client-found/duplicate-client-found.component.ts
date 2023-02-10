/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CaseFacade, CaseStatusCode } from '@cms/case-management/domain';
import { LoaderService, LoggingService, SnackBarNotificationType, NotificationSnackbarService } from '@cms/shared/util-core';
import { Router } from '@angular/router';
@Component({
  selector: 'case-management-duplicate-client-found',
  templateUrl: './duplicate-client-found.component.html',
  styleUrls: ['./duplicate-client-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuplicateClientFoundComponent implements OnInit {

  @Input() currentClientInfo: any = {};
  @Input() matchingClientInfo: any = {};

  @Output() closeModalClick = new EventEmitter<any>();
  ssn: string = '';
  constructor(private router: Router,
    private caseFacade: CaseFacade,
    private loaderService: LoaderService,
    private loggingService: LoggingService) {

  }

  ngOnInit(): void {
    if (this.currentClientInfo.ssn != this.matchingClientInfo.ssn) {
      this.ssn = '000-00-0000'
    }
    else {
      this.ssn = this.currentClientInfo.ssn
    }
    if(isNaN(this.currentClientInfo.dob)){
      this.currentClientInfo.dob=null
    }
  }

  onDuplicateFoundClick() {
    this.loaderService.show();
    this.caseFacade.updateCaseStatus(this.currentClientInfo.clientCaseId, CaseStatusCode.canceled).subscribe({
      next: (response: any) => {
        this.router.navigate([`/case-management/cases/case360/${this.matchingClientInfo.clientId}`])
        this.closeModalClick.next(true);
        this.loaderService.hide();
      },
      error: (err: any) => {
        this.loaderService.hide();
        this.loggingService.logException(err);
        this.caseFacade.showHideSnackBar(SnackBarNotificationType.ERROR,err);
      }
    })
  }

  onNotaDuplicateClick() {
    this.closeModalClick.next(true);
  }
}

