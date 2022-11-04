/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
/** Facades **/
import { ClientFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'

@Component({
  selector: 'case-management-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseDetailsComponent implements OnInit {
  currentDate = new Date();
  public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Public properties **/
  ddlCaseOrigins$ = this.clientFacade.ddlCaseOrigins$;

  /** Constructor **/
  constructor(private readonly clientFacade: ClientFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlCaseOrigin();
  }

  /** Private methods **/
  private loadDdlCaseOrigin() {
    this.clientFacade.loadDdlCaseOrigin();
  }
}
