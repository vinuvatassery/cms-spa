/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ClientEligibilityFacade } from '@cms/case-management/domain';
import {
  DateInputSize,
  DateInputRounded,
  DateInputFillMode,
} from '@progress/kendo-angular-dateinputs';



@Component({
  selector: 'case-management-accept-application',
  templateUrl: './accept-application.component.html',
  styleUrls: ['./accept-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptApplicationComponent implements OnInit {

  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';
  /** Public properties **/
  ddlAcceptApplications$ = this.clientEligibilityFacade.ddlAcceptApplications$;

  /** Constructor **/
  constructor(
    private readonly clientEligibilityFacade: ClientEligibilityFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlAcceptApplications();
  }

  /** Private methods **/
  private loadDdlAcceptApplications() {
    this.clientEligibilityFacade.loadDdlAcceptApplications();
  }
}
