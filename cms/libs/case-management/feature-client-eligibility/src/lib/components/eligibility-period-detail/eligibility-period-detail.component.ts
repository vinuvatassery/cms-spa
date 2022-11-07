/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ClientEligibilityFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'

@Component({
  selector: 'case-management-eligibility-period-detail',
  templateUrl: './eligibility-period-detail.component.html',
  styleUrls: ['./eligibility-period-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EligibilityPeriodDetailComponent implements OnInit {
  public formUiStyle : UIFormStyle = new UIFormStyle();
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
