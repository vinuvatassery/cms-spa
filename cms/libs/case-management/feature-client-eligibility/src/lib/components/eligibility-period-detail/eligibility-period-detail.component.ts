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
  selector: 'case-management-eligibility-period-detail',
  templateUrl: './eligibility-period-detail.component.html',
  styleUrls: ['./eligibility-period-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EligibilityPeriodDetailComponent implements OnInit {
  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';
 currentDate = new Date();
  /** Public properties **/
  ddlGroups$ = this.clientEligibilityFacade.ddlGroups$;
  ddlStatus$ = this.clientEligibilityFacade.ddlStatus$;

  /** Constructor **/
  constructor(
    private readonly clientEligibilityFacade: ClientEligibilityFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlGroups();
    this.loadDdlStatus();
  }

  /** Private methods **/
  private loadDdlGroups() {
    this.clientEligibilityFacade.loadDdlGroups();
  }

  private loadDdlStatus() {
    this.clientEligibilityFacade.loadDdlStatus();
  }
}
